require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Line Notify
const clientId = process.env.LINE_NOTIFY_CLIENT_ID;
const clientSecret = process.env.LINE_NOTIFY_CLIENT_SECRET;
const redirectUri = `${process.env.ROOT_PATH}/callback`;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get('/', function(req, res, next) {
  const code = req.query.code;
  res.render('callback', {
    url: URL
  })
  console.log('code', code)
});

module.exports = router;
