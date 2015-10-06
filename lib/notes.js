var fs = require('fs')
var path = require('path')

var Notes = function(options) {
  if (!options) {
    options = {}
  }
  this.path = options.path || 'files'
  this.hash = options.hash || 'sha256'
}

var Security = require('./security')
var secu = new Security()


Notes.prototype.handlePost = function (request, response) {

  var token
  // token submitted to modify an existing or create chosen one
  if (request.body.token)
    token = request.body.token
  else
    token = secu.randomAsciiString(20)

  var shasum = secu.hash(token, this.hash)
  var storagepath = this.path
  var fname = path.join(storagepath, shasum)

  fs.mkdir(storagepath, function(err) {
    if (err) {
      // better ask forgiveness, folder already exists
      if (err.code == 'EEXIST') createFile(fname, token, request, response)
      else console.error(err)
    } else {
      createFile(fname, token, request, response)
    }
  })
}

function createFile(fname, token, request, response) {
  var success = 0
  fs.writeFile(fname+'.content', request.body.notearea, function(err, data) {
    console.log("written ", token, " to", fname)
    if (err) console.error(err)
    else response.json({id: token, name: request.body.name})
  })
  fs.writeFile(fname+'.name', request.body.name, function(err, data) {
    if (err) console.error(err)
  })
}

Notes.prototype.handleGet = function (request, response) {
  var noteId = request.params.id
  var shasum = secu.hash(noteId, this.hash)
  var fname = path.join(this.path, shasum)

  fs.readFile(fname+'.content', function (err, content) {
    if (err)
      response.render('index', { title : 'oups', content : 'not found!' })
    else
      fs.readFile(fname+'.name', function (err, name) {
        response.render('index', {title: name, notename: name, content: content, notetoken: noteId})
      })
  })
}

module.exports = Notes
