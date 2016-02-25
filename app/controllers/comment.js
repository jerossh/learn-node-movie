var mongoose = require('mongoose')
var Comment = mongoose.model('Comment')

exports.save = function(req, res){
  var _comment = req.body.comment
  var movieId = _comment.movie
  var comment = new Comment(_comment)

  comment.save(function(err, comment){
    if (err) {
      console.log(err)
    }
    return res.redirect('/movie/' + movieId)
  })
}
