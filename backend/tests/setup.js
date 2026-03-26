const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key_for_jwt';

const TEST_DB_URI = 'mongodb://localhost:27017/portfolio_tracker_test';

// Connect to test database before all tests
beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

// Clear all collections between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Drop test database and close connection after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
