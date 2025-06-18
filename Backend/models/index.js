const User = require('./user.model');
const Note = require('./note.model');
const sequelize = require('../config/database');

// Define model relationships
User.hasMany(Note, { 
  foreignKey: 'userId',
  as: 'notes',
  onDelete: 'CASCADE' // When a user is deleted, all their notes will be deleted too
});

Note.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user' 
});

// Sync all models with the database
async function syncDatabase() {
  try {
    
    await sequelize.sync({ alter: true });
    console.log('Database & tables synchronized!');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

module.exports = {
  syncDatabase,
  User,
  Note,
  sequelize // Export sequelize instance for use elsewhere
};