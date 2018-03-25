

# wechat

use node.js
 ## 基本配置
```javascript
const {WeChat} = require('./wechat/index');
const config={
  "appID": "wx5a871dcae03bc0cb",
  "appScrect": "8da3a136b0fc00b248b44ac71844d295",
   "access_token": {
     "type": "redis", //或者file默认为file
     "redis_config": { //type为file此字段不填
       "host": "127.0.0.1",
       "port": "6379",
       "opts":{
         "auth_pass": "xzc8840241" //redis密码
       },
       "key":"access_token" //redis存储的字段名
     }
   }
}
const wechat = new WeChat(config);
```

## api

1. 获取access_token  **wechat.getAccessToken()**

   ```javascript
    /**
      * 获取access_token
      * @returns {Promise<*>}
      */
   wechat.getAccessToken();
   ```

2. 获取基本信息 **wechat.getuserInfo(openid,lang)**

   ​

   ```Javascript
     /**
      * 获取用户基本信息
      * @param   {String} openid
      * @param   {String} lang 默认为中文，可不传
      * @returns {Promise}
      */
   wechat.getuserInfo('o5vQ10tlcdbaKV4MvjdrurDqBHqg',lang)
   ```



3. 批量获取用户信息**wechat.batchGetUserInfo()**

   ```javascript
     /**
      * 批量获取用户信息
      * @param   {Object} data
      * @returns {Promise}
      */
   wechat.batchGetUserInfo({
     "user_list": [
       {
         "openid": "o5vQ10tlcdbaKV4MvjdrurDqBHqg",
         "lang": "zh_CN"
       }
     ]
   })
   ```

   ​

4. 发送客服消息 **wechat.sendService()**  支持官方所有类型

   ```javascript
   wechat.sendService({    //配置项和官方相同
       "touser":"OPENID",
       "msgtype":"text",
       "text":
       {
            "content":"Hello World"
       }
   })
   ```

5. 发送模板消息 **wechat.sendTemplateMessage()** 支持官方所有类型

   ```
    wechat.sendTemplateMessage({    //配置项和官方相同
     "touser": "OPENID",
     "template_id": "ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
     "url": "http://weixin.qq.com/download",
     "miniprogram": {
       "appid": "xiaochengxuappid12345",
       "pagepath": "index?foo=bar"
     },
     "data": {
       "first": {
         "value": "恭喜你购买成功！",
         "color": "#173177"
       },
       "keynote1": {
         "value": "巧克力",
         "color": "#173177"
       },
       "keynote2": {
         "value": "39.8元",
         "color": "#173177"
       },
       "keynote3": {
         "value": "2014年9月22日",
         "color": "#173177"
       },
       "remark": {
         "value": "欢迎再次购买！",
         "color": "#173177"
       }
     }
   })


   ```

   ​

