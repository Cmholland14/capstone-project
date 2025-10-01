import User from '../models/customer.js';

export class UserDao {
    async getAllUsers() {
        return await User.find();
    }

    async getUserById(id) {
        return await User.findById(id);
    }

    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async updateUser(id, updatedData) {
        return await User.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
}