const path = require('path')
const redis = require('redis');
const fs = require('fs');
const request = require('request');
const access_token_config = require('./access_token.json');
const {WECHAT_DOMAIN, ACCESS_TOKEN} = require('./constant');
const verifyConfigRules = [
  {
    action: () => true,
    match: (config) => {
      const normalKey = ['token', 'appID', 'appScrect'];
      normalKey.forEach(item => {
        if (!config.hasOwnProperty(item)) {
          throw new Error(`配置文件中${item}是必须配置的`)
        }
      })
    }
  }, {
    action: ({redis_config}) => {
      return !!redis_config;
    },
    match: (config) => {
      if (config.type === 'redis') {
        if (!config.redis_config) {
          throw new Error(`如果储存access_token在redis,需要redis_config配置`)
        }
        const needKey = ['host', 'port'];
        needKey.forEach(item => {
          if (!config.redis_config.hasOwnProperty(item)) {
            throw new Error(`配置文件中redis_config的${item}是必须配置的`)
          }
        })
      }
    }
  }
]
const verifySendMessageRules = [
  {
    action: () => true,
    match: (data) => {
      const items = ['touser'];
      items.forEach(item => {
        if (!data.hasOwnProperty(item)) {
          throw new Error(`发送消息${item}字段是必须的`)

        }
      })
    }
  }
]
const defaultConfig = {
  "wechatApiDomain": WECHAT_DOMAIN,
  "wechatApiURL": {
    "accessTokenApi": ACCESS_TOKEN
  },
  "access_token": {
    type: 'file'
  }
}

function requestGet(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (body.errcode) {
        throw new Error(`错误码为${data.errcode},错误信息为${data.errmsg}`)
      } else {
        resolve(body)
      }
    })

  })

}

function requestPost(url, body) {
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: "POST",
      json: true,
      body: body
    }, function (err, response, body) {
      if (body.errcode) {
        throw new Error(`错误码为${body.errcode},错误信息为${body.errmsg}`)
      } else {
        resolve(body)
      }
    });
  })
}

class redisClient {
  constructor() {
  }
}

redisClient.client = ''
redisClient.getinstance = function ({access_token: {redis_config: {host, port, opts}}}) {
  return new Promise((resolve, reject) => {
    if (!redisClient.client) {
      const client = redis.createClient(port, host, opts);
      client.on('connect', (res) => {
        redisClient.client = new Client(client);
        resolve(redisClient.client)
      });
    } else {
      resolve(redisClient.client)
    }
  })

}

class Client {
  constructor(client) {
    this.client = client;
  }

  exists(key) {
    return new Promise((resolve, reject) => {
      this.client.exists(key, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res)
      })
    })
  }

  set(key, value, time) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', time, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res)
      })
    })
  }
}

class Token {
  constructor(config) {
    this.config = Object.assign({}, config, defaultConfig);
    this.verifyConfig(this.config);
  }

  verifyConfig(config) {
    verifyConfigRules.forEach(item => {
      item.action(config) && item.match(config);
    })
  }

  async getAccessToken() {
    const token = await this.getAccessTokenHandle().bind(this)();
    return token
  }

  getAccessTokenHandle() {
    const {access_token: {type}} = this.config;
    return {
      redis: this.redisTokenHandle,
      file: this.fileTokenHandle
    }[type];
  }

  async redisTokenHandle() {
    const {access_token: {redis_config: {key}}} = this.config;
    const client = await redisClient.getinstance(this.config);
    if (client.exists(key) === 1) {
      return client.get(key);
    } else {
      const {access_token, expires_in} = JSON.parse(await this.getTokenFromUrl());
      await client.set(key, access_token, expires_in);
      return access_token;
    }

  }

  async getTokenFromUrl() {
    const {wechatApiURL: {accessTokenApi}, appID, appScrect} = this.config;
    const url = `${accessTokenApi}appid=${appID}&secret=${appScrect}`;
    const data = await requestGet(url);

    return data
  }

  async fileTokenHandle() {
    const currentTime = Date.now();
    const {access_token, expires_time} = access_token_config;
    if (!(access_token === "" || currentTime > expires_time)) {
      return Promise.resolve(access_token);
    }
    const data = JSON.parse(await this.getTokenFromUrl());
    const obj = {
      access_token: data.access_token,
      expires_time: Date.now() + (data.expires_in - 600) * 1000
    }
    fs.writeFileSync(path.resolve(__dirname, 'access_token.json'), JSON.stringify(obj));
    return data.access_token;
  }

}


module.exports = {
  verifyConfigRules,
  defaultConfig,
  requestGet,
  requestPost,
  redisClient,
  verifySendMessageRules,
  Token
}



