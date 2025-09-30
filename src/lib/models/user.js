import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    emailId: { type: String, trim: true, required: true, unique: true },
    password: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;