import Customer from '@/lib/models/Customer';

export class UserDao {
    async getAllUsers() {
        return await Customer.find();
    }

    async getUserById(id) {
        return await Customer.findById(id);
    }

    async getUserByEmail(email) {
        return await Customer.findOne({ email });
    }

    async createUser(userData) {
        const user = new Customer(userData);
        return await user.save();
    }

    async updateUser(id, updatedData) {
        return await Customer.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async deleteUser(id) {
        return await Customer.findByIdAndDelete(id);
    }
}