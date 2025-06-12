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
    // Use { force: true } to drop tables and recreate them (CAUTION: all data will be lost)
    // Use { alter: true } for incremental changes that preserve data when possible
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