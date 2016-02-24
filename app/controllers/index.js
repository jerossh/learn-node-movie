var Movie = require('../models/movie')

// index
exports.index = function(req, res){

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
}
