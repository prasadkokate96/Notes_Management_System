const { Note, User } = require('../models');
const { Op } = require('sequelize');

// Get all notes for the current user
exports.getAllNotes = async (req, res) => {
  try {
    // Query parameters for filtering
    const { category, search, sort = 'updatedAt', order = 'DESC' } = req.query;
    
    // Base where condition - only return user's own notes
    const whereCondition = { userId: req.user.id };
    
    // Add category filter if provided
    if (category) {
      whereCondition.category = category;
    }
    
    // Add search functionality
    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Build order array
    const orderArray = [[sort, order]];
    
    const notes = await Note.findAll({
      where: whereCondition,
      order: orderArray,
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });
    
    res.status(200).json({
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error retrieving notes', error: error.message });
  }
};

// Get a single note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.status(200).json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error retrieving note', error: error.message });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const note = await Note.create({
      title,
      content,
      category: category || 'General',
      userId: req.user.id
    });
    
    // Fetch the created note with user information
    const noteWithUser = await Note.findByPk(note.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });
    
    res.status(201).json({
      message: 'Note created successfully',
      note: noteWithUser
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error creating note', error: error.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    
    const note = await Note.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Validate that at least one field is being updated
    if (!title && !content && !category) {
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }
    
    await note.update({
      title: title || note.title,
      content: content || note.content,
      category: category || note.category
    });
    
    // Fetch the updated note with user information
    const updatedNote = await Note.findByPk(note.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });
    
    res.status(200).json({
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error updating note', error: error.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    // Validate noteId
    const noteId = req.params.id;
    if (!noteId) {
      return res.status(400).json({ message: 'Note ID is required' });
    }
    
    const note = await Note.findOne({
      where: { 
        id: noteId,
        userId: req.user.id 
      }
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    await note.destroy();
    
    res.status(200).json({ 
      message: 'Note deleted successfully', 
      id: noteId 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error deleting note', error: error.message });
  }
};

// Get notes by category
exports.getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({ message: 'Category parameter is required' });
    }
    
    const notes = await Note.findAll({
      where: { 
        userId: req.user.id,
        category
      },
      order: [['updatedAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });
    
    res.status(200).json({
      category,
      count: notes.length,
      notes
    });
  } catch (error) {
    console.error('Get notes by category error:', error);
    res.status(500).json({ message: 'Server error retrieving notes by category', error: error.message });
  }
};