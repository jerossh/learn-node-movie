var Movie = require('../models/movie')
var _ = require('underscore')

// detail
exports.detail = function (req, res) {
  var id = req.params.id
  Movie.findById(id, function(err,movie){
  res.render('detail',{
    title:'imooc ' + movie.title,
    movie:movie
  })
})
}

// admin new page
exports.new = function (req, res) {
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
}

// admin update movie
exports.update = function(req, res){
  var id = req.params.id
  if(id){
    Movie.findById(id, function(err, movie) {
      res.render('admin', {
        title: 'imooc 后台更新',
        movie: movie
      })
    })
  }
}

//amdin post movie
exports.save = function(req, res){
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
        res.redirect('/movie/' + movie._id)
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
        res.redirect('/movie/' + movie._id)
      })
    }
}

// list page
exports.list = function (req, res) {
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('list',{
      title:'imooc 列表页',
      movies: movies              //这个movie怎么来的
    })
  })
}

//删除电影
exports.del = function(err, movie) {
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
}
