const querystring = require('querystring');
const axios = require('axios');
const FormData = require('form-data');

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

async function sendNotify(token, data) {
  const url = 'https://notify-api.line.me/api/notify';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${token}`,
  };
  const formData = data;
  console.log('formdata', formData)
  return await axios.post(url, querystring.encode(formData), { headers }).catch(error=>{});
}

//test
async function testSendNotify(token, data) {
  const form = new FormData();
  const url = 'https://notify-api.line.me/api/notify';
  // const headers = {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  //   Authorization: `Bearer ${token}`,
  // };
  const request_config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      ...form.getHeaders()
    }
  };
  // const formData = data;
  
  form.append('message', data.message);
  form.append('imageFile', data.imageFile);
  console.log('formdata', form)
  return axios.post(
    url, 
    querystring.encode(form), 
    request_config).catch(error=>{});
}

module.exports = {
  getToken,
  sendNotify,
  testSendNotify
};