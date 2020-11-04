require('dotenv').config();
var express = require('express');
var router = express.Router();

// Line Notify
const clientId = process.env.LINE_NOTIFY_CLIENT_ID;
const clientSecret = process.env.LINE_NOTIFY_CLIENT_SECRET;
const redirectUri = `${process.env.ROOT_PATH}/callback`;

let URL = 'https://notify-bot.line.me/oauth/authorize?';
    URL += 'response_type=code';
    URL += '&client_id='+clientId;
    URL += '&redirect_uri='+redirectUri;
    URL += '&scope=notify';
    URL += '&state=astro';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    url: URL
  })
});

module.exports = router;