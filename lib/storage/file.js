var async = require('async')
var fs = require('fs')
var path = require('path')

var Security = require('../security')
var secu = new Security()

var Files = function(options) {
  if (!options) {
    options = {}
  }
  this.path = options.path || 'storage'
  this.hash = options.hash || 'sha256'
}


Files.prototype.get = function (token, callback) {
  var shasum = secu.hash(token, this.hash)
  var fname = path.join(this.path, shasum)

  async.parallel({
    // read note content
    content: function (aCallback) {
      fs.readFile(fname+'.content', function (err, content) {
        if (err) aCallback(err)
        else aCallback(null, content)
      })
    },

    // read note title
    name: function (aCallback) {
      fs.readFile(fname+'.name', function (err, name) {
        if (err) aCallback(err)
        else aCallback(null, name)
      })
    }

  }, callback)
}

Files.prototype.set = function (token, title, content, callback) {
  var shasum = secu.hash(token, this.hash)

  var storagepath = this.path
  var fname = path.join(storagepath, shasum)

  fs.mkdir(storagepath, function(err) {
    if (err) {
      // better ask forgiveness, folder already exists
      if (err.code === 'EEXIST') createFile(fname, token, title, content, callback)
      else console.error(err)
    } else {
      createFile(fname, token, callback)
    }
  })

}


function createFile(fname, token, title, content, callback) {
  async.parallel({
    // write note content
    content: function (aCallback) {
      fs.writeFile(fname+'.content', content, function(err, data) {
        console.log("written ", token, " to", fname)
        if (err) return aCallback(err)
        else return aCallback()
      })     
    },

    // write note name
    name: function (aCallback) {
      fs.writeFile(fname+'.name', title, function(err, data) {
        if (err) return aCallback(err)
        else return aCallback()
      })
    }   
  }, callback)
    
}


module.exports = Files
