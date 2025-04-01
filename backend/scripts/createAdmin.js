import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";

dotenv.config();

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.log("❌ Usage: node createAdmin.js <username> <password>");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("❌ Admin already exists");
      process.exit();
    }

    const user = new User({ username, password, isAdmin: true });
    await user.save();
    console.log(`✅ Admin "${username}" created with admin privileges`);
    process.exit();
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
    process.exit(1);
  }
});

// node scripts/createAdmin.js username password