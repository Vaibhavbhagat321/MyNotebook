const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// Route 1: Fetch all notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "Internal server error." });
  }
});

//Route 2: Adding notes to mongo db
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title min 3 char").isLength({ min: 3 }),
    body("description", "Enter a valid description min 5 char").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        user: req.user.id,
        title,
        description,
        tag,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ error: "Internal server error." });
    }
  }
);

// Route 3: update notes to mongo db
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  // create new note to update existing note
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  try {
    //checking if note is present
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //check if notes is belong to login user or not
    if (req.user.id !== note.user.toString()) {
      return res.status(401).send("Not allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "Internal server error." });
  }
});

//Route 4 : Deleting notes from mongo db
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //check if note exists in mongo db
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    if (req.user.id !== note.user.toString()) {
      return res.status(404).send("Not allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Notes has been deleted.", note });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "Internal server error." });
  }
});

module.exports = router;
