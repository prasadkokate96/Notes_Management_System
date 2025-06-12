const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All notes routes require authentication
router.use(authMiddleware);

// CRUD operations for notes
router.get('/', notesController.getAllNotes);
router.get('/category/:category', notesController.getNotesByCategory);
router.get('/:id', notesController.getNoteById);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;