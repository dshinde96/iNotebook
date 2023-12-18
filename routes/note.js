
const express = require("express");  //importing stt
const router = express.Router();
const Notes = require('../models/Note');
const fetchuser = require('../Middleware/fetchuser');
const { body, validator, validationResult } = require("express-validator");

//Router1: fetch all notes of the particular user: GET "/api/note/fetchnotes" :Login required  
//simple get request as we are accessing simple data
router.get('/fetchnotes', fetchuser, async (req, res) => {   //use fetchuser to fetch the data of loggedin user
  try {
    var notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }

})

//Router2: add new notes of particular user: POST "/api/note/addnote" :Login required  
router.post('/addnote', fetchuser, [
  body('title', 'Title must have a minimum of 5 characters').isLength({ min: 3 }),
  body('description', 'Description must have a minimum of 5 characters').isLength({ min: 5 })
], async (req, res) => {   //use fetchuser to fetch the data of loggedin user

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });   //return if the data contains errors
  }

  try {
    const { title, description, tags } = req.body;
    const note = new Notes({
      title, description, tags, data: Date.now(), user: req.user.id
    })
    const savenote = await note.save();
    // console.log(req.user);    as fetchuser returning id of the logged in user only
    res.send({ note: note, message: "Note Saved Successfully " });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }

})

//Router3: update existing note with given id: PUT "/api/note/updatenote/:id" :Login required (we can also use post request but generally to update data we use put request) 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    var note = await Notes.findById(req.params.id)
    if (!note) { return req.status(404).send("Not Found") };   //if note with the particular id is not present on the db
    const newNote = {};
    const { title, description, tags } = req.body;
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tags) { newNote.tags = tags };

    // console.log(note.user);
    if (note.user != req.user.id) {
      return res.status(401).send("access denied");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote });
    return res.send({ note: newNote, message: "Note updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }

})

//Router4: delete existing note with given id: POST "/api/note/deletenote/:id" :Login required 
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    var note = await Notes.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") };
    //check if the authorized user is deleting the note
    if (note.user != req.user.id) {
      return res.status(401).send("Access denied");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    return res.send({ note: note, message: "Note deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }
})

//Router5: delete all notes of the particular user: GET "/api/note/fetchnotes" :Login required  
//simple get request as we are accessing simple data
router.delete('/deleteAllNotes', fetchuser, async (req, res) => {   //use fetchuser to fetch the data of loggedin user
  try {
    var notes = await Notes.find({ user: req.user.id });
    // if(!note){return res.send("Deleted All notes Successfully")}
    for (let index = 0; index < notes.length; index++) {
      // console.log(note[index].user);
      var note = await Notes.findByIdAndDelete(notes[index].id);
      // console.log(note);
    }
    return res.send("Deleted All notes Successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server Error");
  }

})

module.exports = router;
