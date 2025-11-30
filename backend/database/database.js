// // ...existing code...
// const mongoose = require('mongoose');

// const connectDB = async () => {
//     const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager';
//     try {
//         // No useNewUrlParser / useUnifiedTopology here — mongoose handles defaults
//         await mongoose.connect(uri);
//         console.log('MongoDB connected');
//     } catch (err) {
//         console.error('Database connection error:', err);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;
// // ...existing code...