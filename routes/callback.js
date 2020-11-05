require('dotenv').config();
const express = require('express');
const router = express.Router();
const lineNotify = require('../src/lineNotify');

// Line Notify
const clientId = process.env.LINE_NOTIFY_CLIENT_ID;
const clientSecret = process.env.LINE_NOTIFY_CLIENT_SECRET;
const redirectUri = `${process.env.ROOT_PATH}/callback`;
const subscriptions = [];

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', async function(req, res) {
  // const formData = {
  //   grant_type: 'authorization_code',
  //   code: req.query.code,
  //   redirect_uri: redirectUri,
  //   client_id: clientId,
  //   client_secret: clientSecret,
  // }
  // const headers = {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // };

  // axios.post('https://notify-bot.line.me/oauth/token', querystring.encode(formData), {headers})
  // .then(res => {
  //   subscriptions.push(res.data.access_token)
  //   return subscriptions
  // })
  // .catch(error => {
  //   console.log(error)
  // })
  // console.log('subscriptions', subscriptions)

  const code = req.query.code;
  const response = await lineNotify.getToken(code, redirectUri, clientId, clientSecret);
  const token = response.data.access_token;
  subscriptions.push(token);
  await lineNotify.sendNotify(token, "恭喜完成訂閱！");
  console.log('token', token)
  console.log('subscriptions', subscriptions)
  res.render('callback');

  // res.render('callback', {
  //   token: subscriptions
  // })
});

module.exports = router;
