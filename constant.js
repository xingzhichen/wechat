const serviceMessageUrl = 'https://api.weixin.qq.com/cgi-bin/message/custom/send';
const templateMessageUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send';
const getUserInfoUrl = 'https://api.weixin.qq.com/cgi-bin/user/info';
const patchGetUserInfoUrl = "https://api.weixin.qq.com/cgi-bin/user/info/batchget";

module.exports = {
  serviceMessageUrl,
  templateMessageUrl,
  getUserInfoUrl,
  patchGetUserInfoUrl
}