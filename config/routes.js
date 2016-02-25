var Index = require('../app/controllers/index')
var Movie = require('../app/controllers/Movie')
var User = require('../app/controllers/user')
var Comment = require('../app/controllers/comment')


module.exports = function(app){           // 这个应该是nodejs基础
  // pre handle user
  app.use(function(req, res, next){       //为什么要传一个next
    var _user = req.session.user
      app.locals.user = _user
      next()               //为什么加 return
  })

  // index
  app.get('/', Index.index)

  //user
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signin', User.showSignin)
  app.get('/signup', User.showSignup)
  app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.list)
  app.get('/logout', User.logout)


  // movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save)
  app.get('/admin/movie/update/:id',User.signinRequired, User.adminRequired, Movie.update)
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)

  // comment
  app.post('/user/comment', User.signinRequired, Comment.save)
}
