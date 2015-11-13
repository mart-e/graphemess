
var Notes = function(options) {
  if (!options) {
    options = {}
  }
  this.path = options.path || 'files'
  this.hash = options.hash || 'sha256'
  this.store = options.store
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

  var title = request.body.name
  var content = request.body.notearea

  this.store.set(token, title, content, function (err, result) {
    if (err) console.error(err)
    else response.json({id: token, name: title})
  })
}

Notes.prototype.handleGet = function (request, response) {
  var token = request.params.id

  this.store.get(token, function(err, result) {

    if (err) {
      console.error(err)
      response.render('index', { title : 'oups', content : 'not found!' })
    } else {
      response.render('index', {title: result.name, notename: result.name, content: result.content, notetoken: token})
    }

  })

}

module.exports = Notes
