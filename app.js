var express = require('express')
var path =require('path')
var mongoose =require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')

var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json())
app.use(serveStatic(__dirname +'/bower_components'))
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
app.get('/admin/admin/update/:id', function(req, res){
  var id = req.params.id
  if(id){
    movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc 后台更新',
        movie: movie
      })
    })
  }
})

//amdin post movie
app.post('/admin/moviw/new', function(req, res){
  var id = req.body.move._id
  var movieObj = req.body.movie           //这个movie怎么得到的？
  var _movie

  if(id !=='undefined'){
    Movie.fectch(function(err, movie){
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
