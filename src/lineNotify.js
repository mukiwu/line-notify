const querystring = require('querystring');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs'); 

async function getToken(code, redirectUri, clientId, clientSecret) {
  const url = 'https://notify-bot.line.me/oauth/token';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const formData = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  };
  return await axios.post(url, querystring.encode(formData), { headers }).catch(error=>{});
}

function sendNotify(token, req) {
  let formData = new FormData();
  formData.append('message', req.body.message)
  if(req.file) {
    formData.append('imageFile', fs.createReadStream(req.file.path))
  }
  console.log(formData)
  const url = 'https://notify-api.line.me/api/notify';
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...formData.getHeaders()
  }
  const request_config = {
    method: "post",
    data: formData
  };
  return axios.post(url, formData, { headers }).catch(error=>{console.log(error)});
}

module.exports = {
  getToken,
  sendNotify
};