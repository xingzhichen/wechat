const
    {
      requestGet,
      verifySendMessageRules,
      requestPost,
      Token,
    } = require('./utils');

const {
  SERVICE_URL, //发送客服消息url
  TEMPLATE_URL, //发送模板消息url
  PATCH_USERINFO_URL, //批量获取用户信息url
  USERINFO_URL //获得用户信息url
} = require('./constant')
class WeChat extends Token {
  constructor(config) {
    super(config);
  }

  //发送客服消息
  async sendService(data) {
    return await this.sendMessage(SERVICE_URL, data)
  }

  //发送模板消息
  async sendTemplateMessage(data) {
   return  await this.sendMessage(TEMPLATE_URL, data);
  }

  async sendMessage(url, data) {
    verifySendMessageRules.forEach(item => {
      item.action(data) && item.match(data);
    })
    const token = await this.getAccessToken();
    url = `${url}?access_token=${token}`;
    return await requestPost(url, data);
  }

  //获取用户信息

  /**
   * 获取用户基本信息
   * @param   {String} openid
   * @param   {String} lang
   * @returns {Promise}
   */
  async getuserInfo(openid, lang = 'zh_CN') {
    const token = await this.getAccessToken();
    const url = `${USERINFO_URL}?access_token=${token}&openid=${openid}&lang=${lang}`;
    const result = await requestGet(url);
    return result
  }

  /**
   * 批量获取用户信息
   * @param   {Object} data
   * @returns {Promise}
   */
  async batchGetUserInfo(data) {
    const token = await this.getAccessToken();
    const url = `${PATCH_USERINFO_URL}?access_token=${token}`;
    const result = await requestPost(url, data);
    return result
  }
}

module.exports = {
  WeChat
}

