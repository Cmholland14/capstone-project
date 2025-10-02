import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // in real apps, hash with bcrypt
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Staff"],
      default: "Admin",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
