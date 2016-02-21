var express = require('express')
var path =require('path')
var mongoose =require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var Movie = require('./models/user')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var port =  process.env.PORT ||4000
var app = express()

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(serveStatic(__dirname +'/public'))
app.locals.moment =require('moment')
app.listen(port)

console.log('imooc started on port: ' + port)

// index
app.get('/', function (req, res) {
  Movie.fetch(function(err,movies){    //这个第二个参数
    if(err){
      console.log(err)
    }
    res.render('index',{
      title:'imooc 首页',
      movies: movies              //这个movies怎么来的，上面那条注释的参数里来的
    })
  })
})

//signup
app.post('/user/signup', function(req, res){
  var _user = req.body.user
  var user = new User(_user)

  user.save(function(err, user){
    if (err) {
      console.log(err)
    }
    console.log(user)
  })

})

// detail
app.get('/movie/:id', function (req, res) {
  var id = req.params.id
  Movie.findById(id, function(err,movie){
  res.render('detail',{
    title:'imooc ' + movie.title,
    movie:movie
  })
})
})

// admin page
app.get('/admin/movie', function (req, res) {
  res.render('admin',{
    title:'imooc 后台录入页',
    movie:{
      title:'',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      language: '',
      flash: '',
      summary:''
    }
  })
})

// admin update movie
app.get('/admin/update/:id', function(req, res){
  var id = req.params.id
  if(id){
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc 后台更新',
        movie: movie
      })
    })
  }
})

//amdin post movie
app.post('/admin/movie/new', function(req, res){
  var id = req.body.movie._id
  var movieObj = req.body.movie           //这个movie怎么得到的？
  var _movie

  if(id !=='undefined'){
    Movie.findById(function(err, movie){
      if(err) {
        console.log(err)
      }

      _movie =  _.extend(movie, movieObj)       // 用到.extend里替换数据的方法
      _movie.save(function(err, movie){
        if(err){
          console.log(err)
        }
        res.redicrect('/movie/' + movie._id)
      })
      })
    }
    else {
      _movie = new Movie({
        doctor: movieObj.doctor,
        title: movieObj.title,
        country: movieObj.country,
        language: movieObj.language,
        year: movieObj.year,
        poster: movieObj.poster,
        summary: movieObj.summary,
        flash: movieObj.flash
      })
      _movie.save(function(err, movie) {
        if (err) {
          console.log(err)
        }
        res.redicrect('/movie/' + movie._id)
      })
    }
})
// list page
app.get('/admin/list', function (req, res) {
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('list',{
      title:'imooc 列表页',
      movies: movies              //这个movie怎么来的
    })
  })
})

app.delete('/admin/list', function(err, movie) {
  var id = req.query.id

  if(id) {
    Movie.remove({_id: id}, function(err,movie) {
      if (err) {
        console.log(err)
      }
      else {
        res.json({success: 1})
      }
    })
  }
})
