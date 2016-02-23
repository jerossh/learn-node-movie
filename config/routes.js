var Movie = require('../models/movie')
var User = require('../models/user')
var _ = require('underscore')

module.exports = function(app){           // 这个应该是nodejs基础
  // pre handle user
  app.use(function(req, res, next){       //为什么要传一个next
    var _user = req.session.user

    if (_user) {
      app.locals.user = _user
    }
      return next()               //为什么加 return
  })
  // index
  app.get('/', function (req, res) {
    console.log('user in session: ')
    console.log(req.session.user)



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

    User.findOne({name: _user.name}, function(err, user){
      if (err){
        console.log(err)
      }
      if(user){
        console.log('The user exist!');
      }
    })
    var user = new User(_user)
    user.save(function(err, user){
      if (err) {
        console.log(err)
      }
      console.log(user);
    })

  })

  // userlist page
  app.get('/admin/userlist', function (req, res) {
    User.fetch(function(err,users){
      if(err){
        console.log(err)
      }
      res.render('userlist',{
        title:'imooc 用户列表页',
        users: users
      })
    })
  })

  // signin
  app.post('/user/signin', function(req, res){
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name: name}, function(err, user) {
      if (err) {
        console.log(err)
      }

      if (!user) {
        console.log('The user does not exist!');
      }

      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          console.log(err)
        }

        if (isMatch) {
          req.session.user = user
          console.log('Password is matched');
          return res.redirect('/')
        }
        else {
          console.log('Password is not matched');
        }
      })
    })
  })

  // logout
  app.get('/logout', function(req, res){
    delete req.session.user
    delete app.locals.user
    res.redirect('/')
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


  //删除电影
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
}
