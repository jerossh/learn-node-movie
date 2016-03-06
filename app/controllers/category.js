var Category = require('../models/category')
var _ = require('underscore')



// admin new page
exports.new = function (req, res) {
  res.render('category_admin',{
    title:'imooc 分类后台录入页',
    category: {}                      //需要给jade属性一个
  })
}


//amdin post category
exports.save = function(req, res){
  var _category = req.body.category
  var category = new Category(_category)

    category.save(function(err, category) {
      if (err) {
        console.log(err)
      }

      res.redirect('/admin/category/list')
    })
  }

  // list page
  exports.list = function (req, res) {
    Category.fetch(function(err, categories){
      if(err){
        console.log(err)
      }
      res.render('categorylist',{
        title:'imooc 列表页',
        categories: categories              //这个movie怎么来的
      })
    })
  }
