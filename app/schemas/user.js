var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: {
    type: String
  },

  meta: {
    creatAt:{
      type:Date,
      default: Date.now()
    },
    updateAt:{
      type:Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save',function(next) {
  var user = this
  if (this.isNew) {
    this.meta.creatAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
  if (err) return nexet(err)

    bcrypt.hash(user.password, null, null, function(err, hash){
      if(err) return next(err)

      user.password = hash
      next()
    })
})

})

UserSchema.methods = {
  comparePassword: function(_password, cb) {               //cb 提交的方法  _password怎么来的？
    bcrypt.compare(_password, this.password, function(err, isMatch){
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
  fetch: function(cb){   //取出目前数据库所有的数据
    return this
      .find({})
      .sort('meta.updateAt')             //排序
      .exec(cb)
  },
  findById: function(id, cb) {   //用来查询单条数据
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = UserSchema
