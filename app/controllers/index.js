var Movie = require('../models/movie')
var Category = require('../models/category')

// index page
exports.index = function(req, res) {
  Category
    .find({})
    .populate({
      path: 'movies',
      select: 'title poster',
      options: { limit: 6 }
    })
    .exec(function(err, categories) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        title: 'imooc 首页',
        categories: categories
      })
    })
  }

  //search function
  exports.search = function(req, res){
    var catId = req.query.cat     //  怎么不需要取出来呢？
    var page = parseInt(req.query.p, 10) || 0
    var q = req.query.q
    var count = 2
    var index = page*count   //没页查询数量

    if (catId) {
      Category
        .find({_id: catId})
        .populate({
          path: 'movies',       //path这个又是什么意思呢
          select: 'title poster'  //What is it?
        })
        .exec(function(err, categories){
          if (err){
            console.log(err)
          }
          var category = categories[0] || {}      //
          var movies = category.movies || []
          var results = movies.slice(index, index + count)

          res.render('results',{
            title:'imooc 结果列表页面',
            //这个movies怎么来的，上面那条注释的参数里来的  所以category为什么不显示
            keyword: category.name,
            currentPage: (page +1),
            query: 'cat=' + catId,
            totalPage: Math.ceil(movies.length / count),
            movies: results
          })
        })
      }
      else{
        Movie
        .find({title: new RegExp(q + '*')})       //看来有要重新学正则表达式了
        .exec(function(err, movies) {
          if (err) {
            console.log(err)
          }
          var results = movies.slice(index, index + count)

          res.render('results',{
            title:'imooc 结果列表页面',
            //这个movies怎么来的，上面那条注释的参数里来的  所以category为什么不显示
            keyword: q,
            currentPage: (page +1),
            query: 'q=' + q,
            totalPage: Math.ceil(movies.length / count),
            movies: results

          })
        })
      }
    }
