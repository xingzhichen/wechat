const SERVICE_URL = 'https://api.weixin.qq.com/cgi-bin/message/custom/send';
const TEMPLATE_URL = 'https://api.weixin.qq.com/cgi-bin/message/template/send';
const USERINFO_URL = 'https://api.weixin.qq.com/cgi-bin/user/info';
const PATCH_USERINFO_URL = "https://api.weixin.qq.com/cgi-bin/user/info/batchget";
const WECHAT_DOMAIN = "https://api.weixin.qq.com/";
const ACCESS_TOKEN  = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&"

module.exports = {
  SERVICE_URL, //发送客服消息url
  TEMPLATE_URL, //发送模板消息url
  PATCH_USERINFO_URL, //批量获取用户信息url
  USERINFO_URL ,//获得用户信息url
  WECHAT_DOMAIN, //微信主domain url
  ACCESS_TOKEN  //请求access_token url
}
