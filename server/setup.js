const mongoose = require('mongoose');
const User = require('./models/User');
const Portfolio = require('./models/Portfolio');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stock_pulse', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Create indexes
    await User.createIndexes();
    await Portfolio.createIndexes();
    console.log('✅ Database indexes created');

    // Create a sample admin user
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const adminUser = new User({
        username: 'admin',
        email: 'admin@stockpulse.com',
        fullName: 'Admin User',
        phoneNumber: '+1234567890',
        password: 'admin123', // Will be hashed automatically
        isStaff: true,
        areasOfInterest: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
      });

      await adminUser.save();
      console.log('✅ Admin user created (username: admin, password: admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create a sample regular user
    const existingUser = await User.findOne({ username: 'testuser' });
    if (!existingUser) {
      const testUser = new User({
        username: 'testuser',
        email: 'test@example.com',
        fullName: 'Test User',
        phoneNumber: '+1987654321',
        password: 'test123',
        areasOfInterest: ['AAPL', 'TSLA', 'NVDA']
      });

      await testUser.save();
      console.log('✅ Test user created (username: testuser, password: test123)');

      // Create a sample portfolio for the test user
      const samplePortfolio = new Portfolio({
        user: testUser._id,
        name: 'My Tech Portfolio',
        description: 'A diversified portfolio focused on technology stocks',
        items: [
          {
            symbol: 'AAPL',
            companyName: 'Apple Inc.',
            quantity: 10,
            purchasePrice: 150.00,
            purchaseDate: new Date('2023-01-15'),
            currentPrice: 180.00
          },
          {
            symbol: 'TSLA',
            companyName: 'Tesla Inc.',
            quantity: 5,
            purchasePrice: 200.00,
            purchaseDate: new Date('2023-02-01'),
            currentPrice: 250.00
          },
          {
            symbol: 'NVDA',
            companyName: 'NVIDIA Corporation',
            quantity: 8,
            purchasePrice: 300.00,
            purchaseDate: new Date('2023-03-01'),
            currentPrice: 450.00
          }
        ]
      });

      samplePortfolio.calculateTotals();
      await samplePortfolio.save();
      console.log('✅ Sample portfolio created for test user');
    } else {
      console.log('ℹ️  Test user already exists');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Login with admin credentials: username=admin, password=admin123');
    console.log('3. Or login with test user: username=testuser, password=test123');
    console.log('4. Access the API at http://localhost:8000');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Environment validation
const validateEnvironment = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('⚠️  Warning: Missing environment variables:', missing.join(', '));
    console.log('Please ensure you have a .env file with all required variables.');
    console.log('Check env.example for reference.');
  } else {
    console.log('✅ Environment variables validated');
  }
};

// Check if MongoDB is accessible
const checkMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stock_pulse', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Fail fast
    });
    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Please ensure MongoDB is running and accessible.');
    return false;
  }
};

const main = async () => {
  console.log('🚀 Starting Stock Pulse setup...\n');
  
  validateEnvironment();
  
  const mongoAccessible = await checkMongoDB();
  if (!mongoAccessible) {
    process.exit(1);
  }
  
  await setupDatabase();
};

// Run setup if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupDatabase, validateEnvironment, checkMongoDB }; 