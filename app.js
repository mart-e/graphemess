/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , bodyParser = require('body-parser')

var app = express()

var Notes = require('./lib/notes')
var note = new Notes({
  path: 'storage'
})

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()) // for parsing application/json

app.use(stylus.middleware(__dirname + '/public'))
app.use(express.static(__dirname + '/public'))


app.get('/', function (req, res) {
  res.render('index', { title : 'Home' })
})

app.post('/push', function (req, res) {
  return note.handlePost(req, res)
})

app.get('/:id', function (req, res) {
  var note_data = note.handleGet(req, res)
})


app.listen(3000)
