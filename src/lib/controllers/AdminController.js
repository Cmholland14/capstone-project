import { AdminDao } from '@/lib/dao/AdminDao';
import bcrypt from 'bcryptjs';

export class AdminController {
    constructor(adminDao = new AdminDao()) {
        this.adminDao = adminDao;
        console.log('[AdminController] AdminController initialized');
    }

    async getAllAdmins() {
        try {
            console.log('[AdminController] getAllAdmins: Fetching all admins');
            const admins = await this.adminDao.getAllAdmins();
            console.log(`[AdminController] getAllAdmins: Found ${admins.length} admins`);
            
            // Remove password from response for security
            return admins.map(admin => {
                const { password, ...adminWithoutPassword } = admin.toObject();
                return adminWithoutPassword;
            });
        } catch (error) {
            console.error('[AdminController] getAllAdmins: Error occurred', error);
            throw new Error(`Failed to get all admins: ${error.message}`);
        }
    }

    async getAdminById(id) {
        try {
            console.log(`[AdminController] getAdminById: Fetching admin with ID: ${id}`);
            const admin = await this.adminDao.getAdminById(id);
            if (!admin) {
                console.log(`[AdminController] getAdminById: Admin not found with ID: ${id}`);
                return null;
            }
            console.log(`[AdminController] getAdminById: Admin found with ID: ${id}`);
            // Remove password from response for security
            const { password, ...adminWithoutPassword } = admin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] getAdminById: Error occurred for ID: ${id}`, error);
            throw new Error(`Failed to get admin by ID: ${error.message}`);
        }
    }

    async getAdminByEmail(email) {
        try {
            console.log(`[AdminController] getAdminByEmail: Fetching admin with email: ${email}`);
            const admin = await this.adminDao.getAdminByEmail(email);
            if (!admin) {
                console.log(`[AdminController] getAdminByEmail: Admin not found with email: ${email}`);
                return null;
            }
            console.log(`[AdminController] getAdminByEmail: Admin found with email: ${email}`);
            // Remove password from response for security
            const { password, ...adminWithoutPassword } = admin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] getAdminByEmail: Error occurred for email: ${email}`, error);
            throw new Error(`Failed to get admin by email: ${error.message}`);
        }
    }

    async getAdminsByRole(role) {
        try {
            console.log(`[AdminController] getAdminsByRole: Fetching admins with role: ${role}`);
            const admins = await this.adminDao.getAdminsByRole(role);
            console.log(`[AdminController] getAdminsByRole: Found ${admins.length} admins with role: ${role}`);
            
            // Remove password from response for security
            return admins.map(admin => {
                const { password, ...adminWithoutPassword } = admin.toObject();
                return adminWithoutPassword;
            });
        } catch (error) {
            console.error(`[AdminController] getAdminsByRole: Error occurred for role: ${role}`, error);
            throw new Error(`Failed to get admins by role: ${error.message}`);
        }
    }

    async authenticateAdmin(email, password) {
        try {
            console.log(`[AdminController] authenticateAdmin: Attempting authentication for email: ${email}`);
            const admin = await this.adminDao.getAdminByEmail(email);
            if (!admin) {
                console.log(`[AdminController] authenticateAdmin: Admin not found for email: ${email}`);
                return null;
            }

            // Use bcrypt to compare encrypted passwords
            const isValidPassword = await bcrypt.compare(password, admin.password);
            
            if (!isValidPassword) {
                console.log(`[AdminController] authenticateAdmin: Invalid password for email: ${email}`);
                return null;
            }

            console.log(`[AdminController] authenticateAdmin: Authentication successful for email: ${email}`);
            // Remove password from response
            const { password: _, ...adminWithoutPassword } = admin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] authenticateAdmin: Authentication error for email: ${email}`, error);
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    async createAdmin(adminData) {
        try {
            console.log(`[AdminController] createAdmin: Creating admin with email: ${adminData.email}`);
            
            // Validate required fields
            if (!adminData.name || !adminData.email || !adminData.password) {
                console.error('[AdminController] createAdmin: Missing required fields - name, email, and password are required');
                throw new Error('Name, email, and password are required');
            }

            // Validate role
            const validRoles = ['Admin', 'Manager', 'Staff'];
            if (adminData.role && !validRoles.includes(adminData.role)) {
                console.error('[AdminController] createAdmin: Invalid role provided');
                throw new Error('Role must be Admin, Manager, or Staff');
            }

            // Check if admin already exists
            const existingAdmin = await this.adminDao.getAdminByEmail(adminData.email);
            if (existingAdmin) {
                console.log(`[AdminController] createAdmin: Admin already exists with email: ${adminData.email}`);
                throw new Error('Admin with this email already exists');
            }

            // Hash password before storing
            console.log(`[AdminController] createAdmin: Hashing password for admin: ${adminData.email}`);
            adminData.password = await bcrypt.hash(adminData.password, 10);
            
            const newAdmin = await this.adminDao.createAdmin(adminData);
            console.log(`[AdminController] createAdmin: Admin created successfully with ID: ${newAdmin._id}, email: ${adminData.email}`);
            
            // Remove password from response
            const { password, ...adminWithoutPassword } = newAdmin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] createAdmin: Error creating admin with email: ${adminData.email}`, error);
            throw new Error(`Failed to create admin: ${error.message}`);
        }
    }

    async updateAdmin(id, updatedData) {
        try {
            console.log(`[AdminController] updateAdmin: Updating admin with ID: ${id}`);
            
            // Check if admin exists
            const existingAdmin = await this.adminDao.getAdminById(id);
            if (!existingAdmin) {
                console.log(`[AdminController] updateAdmin: Admin not found with ID: ${id}`);
                return null;
            }

            // If email is being updated, check for duplicates
            if (updatedData.email && updatedData.email !== existingAdmin.email) {
                console.log(`[AdminController] updateAdmin: Checking email availability for: ${updatedData.email}`);
                const emailExists = await this.adminDao.getAdminByEmail(updatedData.email);
                if (emailExists) {
                    console.log(`[AdminController] updateAdmin: Email already exists: ${updatedData.email}`);
                    throw new Error('Email already exists');
                }
            }

            // Validate role if being updated
            if (updatedData.role) {
                const validRoles = ['Admin', 'Manager', 'Staff'];
                if (!validRoles.includes(updatedData.role)) {
                    console.error('[AdminController] updateAdmin: Invalid role provided');
                    throw new Error('Role must be Admin, Manager, or Staff');
                }
            }

            // Hash password if it's being updated
            if (updatedData.password) {
                console.log(`[AdminController] updateAdmin: Hashing new password for admin ID: ${id}`);
                updatedData.password = await bcrypt.hash(updatedData.password, 10);
            }

            const updatedAdmin = await this.adminDao.updateAdmin(id, updatedData);
            console.log(`[AdminController] updateAdmin: Admin updated successfully with ID: ${id}`);
            
            // Remove password from response
            const { password, ...adminWithoutPassword } = updatedAdmin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] updateAdmin: Error updating admin with ID: ${id}`, error);
            throw new Error(`Failed to update admin: ${error.message}`);
        }
    }

    async updateAdminRole(id, newRole) {
        try {
            console.log(`[AdminController] updateAdminRole: Updating role for admin ID: ${id} to: ${newRole}`);
            
            const validRoles = ['Admin', 'Manager', 'Staff'];
            if (!validRoles.includes(newRole)) {
                console.error(`[AdminController] updateAdminRole: Invalid role provided: ${newRole}`);
                throw new Error('Role must be Admin, Manager, or Staff');
            }

            const updatedAdmin = await this.adminDao.updateAdminRole(id, newRole);
            if (!updatedAdmin) {
                console.log(`[AdminController] updateAdminRole: Admin not found with ID: ${id}`);
                return null;
            }

            console.log(`[AdminController] updateAdminRole: Role updated successfully for admin ID: ${id} to: ${newRole}`);
            // Remove password from response
            const { password, ...adminWithoutPassword } = updatedAdmin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] updateAdminRole: Error updating role for admin ID: ${id}`, error);
            throw new Error(`Failed to update admin role: ${error.message}`);
        }
    }

    async deleteAdmin(id) {
        try {
            console.log(`[AdminController] deleteAdmin: Deleting admin with ID: ${id}`);
            const deletedAdmin = await this.adminDao.deleteAdmin(id);
            if (!deletedAdmin) {
                console.log(`[AdminController] deleteAdmin: Admin not found with ID: ${id}`);
                return null;
            }
            
            console.log(`[AdminController] deleteAdmin: Admin deleted successfully with ID: ${id}`);
            // Remove password from response
            const { password, ...adminWithoutPassword } = deletedAdmin.toObject();
            return adminWithoutPassword;
        } catch (error) {
            console.error(`[AdminController] deleteAdmin: Error deleting admin with ID: ${id}`, error);
            throw new Error(`Failed to delete admin: ${error.message}`);
        }
    }

    async searchAdmins(searchTerm) {
        try {
            console.log(`[AdminController] searchAdmins: Searching for admins with term: ${searchTerm}`);
            const admins = await this.adminDao.searchAdminsByName(searchTerm);
            console.log(`[AdminController] searchAdmins: Found ${admins.length} admins matching: ${searchTerm}`);
            
            // Remove password from response for security
            return admins.map(admin => {
                const { password, ...adminWithoutPassword } = admin.toObject();
                return adminWithoutPassword;
            });
        } catch (error) {
            console.error(`[AdminController] searchAdmins: Error occurred for search term: ${searchTerm}`, error);
            throw new Error(`Failed to search admins: ${error.message}`);
        }
    }

    async getAdminsPaginated(page = 1, limit = 10) {
        try {
            console.log(`[AdminController] getAdminsPaginated: Fetching page ${page} with limit ${limit}`);
            const result = await this.adminDao.getAdminsPaginated(page, limit);
            
            // Remove password from response for security
            const adminsWithoutPassword = result.admins.map(admin => {
                const { password, ...adminWithoutPassword } = admin.toObject();
                return adminWithoutPassword;
            });

            console.log(`[AdminController] getAdminsPaginated: Found ${adminsWithoutPassword.length} admins on page ${page}`);
            return {
                admins: adminsWithoutPassword,
                pagination: result.pagination
            };
        } catch (error) {
            console.error(`[AdminController] getAdminsPaginated: Error occurred for page ${page}`, error);
            throw new Error(`Failed to get paginated admins: ${error.message}`);
        }
    }
}