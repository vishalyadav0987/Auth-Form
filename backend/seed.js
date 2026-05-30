const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// We use the MONGO_URI environment variable that the Orchestrator injects!
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🌱 Connected to MongoDB for seeding...');

        // 1. Define a quick User Schema (adjust this if yours is different)
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true },
            password: { type: String, required: true },
            name: String
        });
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        // 2. Clear out any existing users in this ephemeral database
        await User.deleteMany({});
        
        // 3. Create a dummy test user
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword
        });

        console.log('✅ Database successfully seeded with test user: test@example.com / password123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();