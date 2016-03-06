var crypto = require('crypto')
var bcrypt = require('bcrypt-nodejs')

function getRandomString(len) {
  if (!) len = 16

  return crypto.radomBytes(Math.ceil(len / 2).toString('hex'))

}

var should = require('should')
var app = require('../../app');
var mongoose = require('mongoose')
var User = require('../../app/models/user')

var user
// test
descripe('<Unit Test', function() {
  descripe('Model User', function() {
    before(function(done) {
      user = {
        name: getRandomString(),
        password: 'password'        //password dosn't matter?
      }
      done()
    })
    
    descripe('Before Method save', function() {
      it('should begin without test user', function(done) {   // NOTE: one test
        User.find({name: user.mame}, function(err, users) {
          users.shoud.have.length(0)

          done()
        })
      })
    })

    descripe('User save', function() {
      it('Shoud save without problem', function(done) {   // NOTE: one test
        var _user = new User(user)

        _user.save(function(err) {
          should.not.exist(err)
          _user.remove(function(err) {
            should.not.exist(err)
          })
        })
        })

      it('Shoud save without problem', function(done) {   // NOTE: one test
        var _user = new User(user)

        _user.save(function(err) {
          should.not.exist(err)
          _user.remove(function(err) {
            should.not.exist(err)
          })
        })
        })
      })
    })
  })
})
