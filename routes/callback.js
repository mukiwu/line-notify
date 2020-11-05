require('dotenv').config();
const express = require('express');
const router = express.Router();
const lineNotify = require('../src/lineNotify');

const clientId = process.env.LINE_NOTIFY_CLIENT_ID;
const clientSecret = process.env.LINE_NOTIFY_CLIENT_SECRET;
const redirectUri = `${process.env.ROOT_PATH}/callback`;

router.get('/', async function(req, res) {
  const code = req.query.code;
  const response = await lineNotify.getToken(code, redirectUri, clientId, clientSecret);
  const token = response.data.access_token;
  await lineNotify.sendNotify(token, "恭喜完成訂閱！");
  console.log('token', token)
  res.render('callback', {
    token: token
  })
});

module.exports = router;
