const mongoose = require('mongoose');
const User = require('./database/models/user');

require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.DB_CONN, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const testUser = new User({
      username: 'testuser',
      password: 'Testing1234!',
      firstName: 'Test',
      userType: 'employee'
    });

    await testUser.save();
    console.log('Test user created:', testUser);

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error creating test user:', err);
  }
}

createTestUser();