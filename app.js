require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const lineNotify = require('./src/lineNotify');
const multer = require("multer");
const fs = require('fs'); 

const app = express();

const clientId = process.env.LINE_NOTIFY_CLIENT_ID;
const clientSecret = process.env.LINE_NOTIFY_CLIENT_SECRET;
const redirectUri = `${process.env.ROOT_PATH}/callback`;

//set Storage Engine
const storage = multer.diskStorage({
  destination: path.join(__dirname,'./public/storage/') ,
  filename: function(req, file, cb){
      cb(null, file.originalname);
  }
})
const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1000000
  },
}).single('imageFile');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

let URL = 'https://notify-bot.line.me/oauth/authorize?';
    URL += 'response_type=code';
    URL += '&client_id='+clientId;
    URL += '&redirect_uri='+redirectUri;
    URL += '&scope=notify';
    URL += '&state=astro';

app.get('/', (req, res) => {
  res.render('index', {
    url: URL
  })
});

app.get('/callback', async function(req, res) {
  const code = req.query.code;
  const response = await lineNotify.getToken(code, redirectUri, clientId, clientSecret);
  const token = response.data.access_token;
  await lineNotify.sendNotify(token, "恭喜完成訂閱！");
  fs.writeFile('./src/token.txt', token, function (err) {
    if (err)
      console.log(err);
    else
      console.log('成功寫入');
  });
  res.render('callback')
});

app.get('/message', async function(req, res) {
  const token = fs.readFileSync('./src/token.txt', 'utf8');
  res.render('message')
});

app.post('/sendMessage', async function(req, res){
  const sendMessage = req.body;
  const token = fs.readFileSync('./src/token.txt', 'utf8');
  lineNotify.sendNotify(token, sendMessage);
});

// test for upload
app.get('/t_message', async function(req, res) {
  const token = fs.readFileSync('./src/token.txt', 'utf8');
  res.render('t_message')
});
app.post('/t_sendMessage', async function(req, res){
  upload(req, res, function(err){
    if(err) {
      console.log(err)
      return
    }
    // console.log('message', req.body.message)
    // console.log('file', req.file.path)
    // res.send({msg:'上傳成功',img:req.file.path});
    const token = fs.readFileSync('./src/token.txt', 'utf8');
    const formData = {
      message: req.body.message,
      imageFile: req.file
    }
    lineNotify.testSendNotify(token, formData);
    res.send({msg:'上傳成功',img:req.file.path});
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
