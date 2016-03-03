var Movie = require('../models/movie')
var Category = require('../models/category')

// index page
exports.index = function(req, res){
  Category
    .find({})
    .populate({
      path: 'movies',       //path这个又是什么意思呢
      select: 'title poster',   //What is it?
      options: {limit: 5}
    })
    .exec(function(err, categories){
      if (err){
        console.log(err)
      }
    })

    res.render('index',{
      title:'imooc 首页',
      //这个movies怎么来的，上面那条注释的参数里来的  所以category为什么不显示
      categories: categories
    })
  }

  //search function
  exports.search = function(req, res){
    var catId = req.query.cat     //  怎么不需要取出来呢？
    var page = req.query.p
    var idnex = page*2    //没页查询数量


    Category
      .find({_id: catId})
      .populate({
        path: 'movies',       //path这个又是什么意思呢
        select: 'title poster',   //What is it?
        options: {limit: 2， skip: index}
      })
      .exec(function(err, categories){
        if (err){
          console.log(err)
        }
      })
      var category = categories[0] || {}      //
      res.render('results',{
        title:'imooc 结果列表页面',
        //这个movies怎么来的，上面那条注释的参数里来的  所以category为什么不显示
        keyword: category.name,
        category: category
      })
    }
