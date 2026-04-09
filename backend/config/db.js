const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n[ERROR] MongoDB Connection Failed: ${error.message}`);
    console.error(`[TIP] Make sure MongoDB is running on your system (port 27017).`);
    console.error(`      If you are using a cloud URI, check your .env file.`);
    process.exit(1);
  }
};

module.exports = connectDB;
