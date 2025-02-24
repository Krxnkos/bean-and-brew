const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['customer', 'employee', 'manager', 'admin'],
    default: 'customer'
  },
  jobTitle: {
    type: String,
    enum: ['Operations Manager', 'Site Manager', 'Junior Barista', 'Barista', 'Senior Barista'],
    required: function() { 
      return this.userType === 'employee' || this.userType === 'manager';
    }
  },
  location: {
    type: String,
    enum: ['Leeds', 'Harrogate', 'Knaresborough Castle'],
    required: function() {
      return this.userType === 'employee' || this.userType === 'manager';
    }
  },
  profilePicture: {
    type: String,
    default: function() {
      return '/images/DefUser.png';
    },
    validate: {
      validator: function(v) {
        return !v || v.startsWith('/images/');
      },
      message: 'Profile picture path must start with /images/'
    }
  },
  lineManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      // Operations Manager doesn't need a line manager
      if (this.jobTitle === 'Operations Manager') {
        return false;
      }
      // All other employees and managers need a line manager
      return true;
    },
    index: true
  }
});

// Add this after your schema definition
UserSchema.index({ lineManager: 1 });

// Log the indexes when the model is compiled
UserSchema.on('index', function(err) {
    if (err) {
        console.error('User model index error:', err);
    } else {
        console.log('User model indexed successfully');
    }
});

// Update password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Update password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export model, checking if it already exists
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);