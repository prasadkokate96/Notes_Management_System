const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true, // Enables createdAt and updatedAt
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to validate password
User.prototype.validatePassword = async function(password) {
  try {
    console.log('Comparing passwords:');
    console.log('- Provided password length:', password ? password.length : 'undefined');
    console.log('- Stored hash length:', this.password ? this.password.length : 'undefined');
    
    // Add an explicit check for empty passwords
    if (!password || !this.password) {
      console.log('One of the passwords is empty or undefined');
      return false;
    }
    
    // Make sure we're working with strings
    const passwordString = String(password);
    
    // Use bcrypt.compare with explicit parameters
    const isValid = await bcrypt.compare(passwordString, this.password);
    console.log('Password validation result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
};

module.exports = User;