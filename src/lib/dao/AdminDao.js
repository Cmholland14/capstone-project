import Admin from '../models/Admin.js';

export class AdminDao {
    async getAllAdmins() {
        return await Admin.find();
    }

    async getAdminById(id) {
        return await Admin.findById(id);
    }

    async getAdminByEmail(email) {
        return await Admin.findOne({ email });
    }

    async getAdminsByRole(role) {
        return await Admin.find({ role });
    }

    async createAdmin(adminData) {
        const admin = new Admin(adminData);
        return await admin.save();
    }

    async updateAdmin(id, updatedData) {
        return await Admin.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async updateAdminRole(id, newRole) {
        return await Admin.findByIdAndUpdate(
            id, 
            { role: newRole }, 
            { new: true }
        );
    }

    async deleteAdmin(id) {
        return await Admin.findByIdAndDelete(id);
    }

    async getAdminCount() {
        return await Admin.countDocuments();
    }

    async getAdminCountByRole() {
        return await Admin.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async searchAdminsByName(searchTerm) {
        return await Admin.find({
            name: { $regex: searchTerm, $options: 'i' }
        });
    }

    async getAdminsPaginated(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const admins = await Admin.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Admin.countDocuments();
        
        return {
            admins,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    async validateAdminLogin(email, password) {
        // Note: In production, use proper password hashing with bcrypt
        return await Admin.findOne({ email, password });
    }
}