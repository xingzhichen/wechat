const
    {
      requestGet,
      verifySendMessageRules,
      requestPost,
      Token,
    } = require('./utils');

const {
  serviceMessageUrl, //发送客服消息url
  templateMessageUrl, //发送模板消息url
  patchGetUserInfoUrl, //批量获取用户信息url
  getUserInfoUrl //获得用户信息url
} = require('./constant')

class WeChat extends Token {
  constructor(config) {
    super(config);
  }

  //发送客服消息
  async sendService(data) {
    await this.sendMessage(serviceMessageUrl, data)

  }

  //发送模板消息
  async sendTemplateMessage(data) {
    await this.sendMessage(templateMessageUrl, data)
  }

  async sendMessage(url, data) {
    verifySendMessageRules.forEach(item => {
      item.action(data) && item.match(data);
    })
    const token = await this.getAccessToken();
    url = `${url}?access_token=${token}`;
    await requestPost(url, body);
  }

  //获取用户信息
  async getuserInfo(openid, lang = 'zh_CN') {
    const token = await this.getAccessToken();
    const url = `${getUserInfoUrl}?access_token=${token}&openid=${openid}&lang=${lang}`;
    const result = await requestGet(url);
    return result
  }

  //批量获取用户信息
  async batchGetUserInfo(data) {
    const token = await this.getAccessToken();
    const url = `${patchGetUserInfoUrl}?access_token=${token}`;
    const result = await requestPost(url, data);
    return result
  }
}

module.exports = {
  WeChat
}

