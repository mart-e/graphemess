"use strict"

function show(element) {
  // display an hidden element giving its id
  var e = document.getElementById(element)
  e.display = 'block'
}

function hide(element) {
  // hide an element giving its id
  var s = document.getElementById(element).style
  s.display = 'none'
}

function tag(name, attrs) {
  // Helper function to create a html tqg with given attributes
  var el = document.createElement(name.toString());

  !!attrs && Object.keys(attrs).forEach(function(key) {
    el.setAttribute(key, attrs[key]);
  });

  return el;
}

function autoResizeArea (elementId) {
    // autoresize a given textarea to match the size of the text

    var text = document.getElementById(elementId)
    function observe (element, event, handler) {
        element.addEventListener(event, handler, false)
    }
    function resize () {
        text.style.height = 'auto'
        text.style.height = text.scrollHeight+'px'
    }
    /* 0-timeout to get the already changed text */
    function delayedResize () {
        window.setTimeout(resize, 0)
    }
    observe(text, 'change',  resize)
    observe(text, 'cut',     delayedResize)
    observe(text, 'paste',   delayedResize)
    observe(text, 'drop',    delayedResize)
    observe(text, 'keydown', delayedResize)

    text.focus()
    text.select()
    resize()
}

function processSubmitNote(submitted, response) {
  if (response.error) {
    show("error_area")
    hide("success_area")
    document.getElementById("error_area").innerHTML = response.error
  } else {
    show("success_area")
    hide("error_area")
    document.getElementById("success_area").innerHTML = response.id + " saved!"

    updateNoteList({token: response.id, name: response.name})
  }
}

function updateNoteList(newNote) {
  var storage = localStorage.getItem('NotesList')
  var notesList = {}
  if (storage) notesList = JSON.parse(storage)

  if (newNote) notesList[newNote.token] = newNote.name

  localStorage.setItem('NotesList', JSON.stringify(notesList))

  document.getElementById("notelist").innerHTML = ""
  for (var key in notesList) {
    var li = tag('li', {'id': key})
    var a = tag('a', {'href': '/'+key})
    a.textContent = notesList[key]
    li.appendChild(a)
    document.getElementById("notelist").appendChild(li)
  }
}

document.getElementById("sendnote").addEventListener("click", function(e) {
  // send the note in AJAX

	e.preventDefault()

  var r = new XMLHttpRequest()
  r.open("POST", "/push", true)
  r.setRequestHeader("Content-type", "application/json")

  var name = document.getElementById("notename").value
  var content = document.getElementById("notearea").value
  var token = document.getElementById("notetoken").value
  var noteData = {'name': name, 'notearea': content, 'token': token}
  r.onreadystatechange = function () {
    if (r.readyState !== 4 || r.status !== 200)
      return
    // store it or handle error
    var responseData = JSON.parse(r.responseText)
    processSubmitNote(noteData, responseData)
  }

  r.send(JSON.stringify(noteData))

})

autoResizeArea('notearea')
updateNoteList()
