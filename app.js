var express = require('express')
var path =require('path')
var mongoose =require('mongoose')
var mongoStore = require('connect-mongodb')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var morgan = require('morgan');

//for the offline storage
var session = require('express-session')
var cookieParser = require('cookie-parser')

var port =  process.env.PORT ||4000
var app = express()
var dburl = 'mongodb://localhost/imoocj'

mongoose.connect(dburl)

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser())         //session 依赖的中间件  存储sessionid
app.use(session({               //用来本地存储信息 store 对象
  secret: 'imoocj',
  resave:false,
  saveUninitialized:true,
  store: new mongoStore({
    url: dburl,
    collection: 'sessions'      // 这条不懂，为什么是sessions是
  })
}))

//提示
if ('development' === app.get('env')){ //如果是开发环境
  app.set('showStackErr', true)     //打印错误信息
  app.use(morgan(':method:url:status')) //请求相关信息
  app.locals.pretty = true          //不压缩源码
  mongoose.set('debug', true)       //数据库请求信息
}

require('./config/routes')(app)    //传入当前app是什么意思，  嗯应该是nodejs基础

app.use(serveStatic(__dirname +'/public'))
app.locals.moment =require('moment')
app.listen(port)

console.log('imooc started on port: ' + port)
