const User = require('../models/user');
const Shift = require('../models/Shift');
const Product = require('../models/Product');

class EmployeeController {
    constructor() {
        this.getManagerInfo = this.getManagerInfo.bind(this);
        this.getPopularItems = this.getPopularItems.bind(this);
        this.getUpcomingShifts = this.getUpcomingShifts.bind(this);
        this.getTeamMembers = this.getTeamMembers.bind(this);
    }

    async getManagerInfo(userId) {
        try {
            const user = await User.findById(userId)
                .populate('lineManager', 'firstName lastName email profilePicture jobTitle')
                .lean();
            
            if (!user) {
                throw new Error('User not found');
            }

            // Return null if no line manager (for top-level managers/admins)
            return user.lineManager || null;
        } catch (error) {
            console.error('Get manager info error:', error);
            return null;
        }
    }

    async getPopularItems() {
        try {
            const popularItems = await Product.find({ isActive: true })
                .limit(5)
                .select('name price category')
                .lean();

            console.log(`Found ${popularItems.length} popular items`);
            return popularItems;
        } catch (error) {
            console.error('Get popular items error:', error);
            return [];
        }
    }

    async getTeamMembers(managerId) {
        try {
            console.log('Starting getTeamMembers with managerId:', managerId);

            if (!managerId) {
                console.error('No manager ID provided');
                return [];
            }

            // Convert string ID to ObjectId if needed
            const mongoose = require('mongoose');
            const managerObjectId = typeof managerId === 'string' ? 
                new mongoose.Types.ObjectId(managerId) : managerId;

            console.log('Looking for team members with lineManager:', managerObjectId);

            const teamMembers = await User.find({
                lineManager: managerObjectId
            })
            .select('firstName lastName email profilePicture jobTitle location')
            .lean();

            console.log('Raw team members result:', JSON.stringify(teamMembers, null, 2));

            return teamMembers || [];

        } catch (error) {
            console.error('Get team members error:', error);
            return [];
        }
    }

    async getUpcomingShifts(employeeId) {
        try {
            const today = new Date();
            const shifts = await Shift.find({
                employee: employeeId,
                date: { $gte: today }
            })
            .sort({ date: 1, startTime: 1 })
            .populate('assignedBy', 'firstName lastName')
            .lean();

            return shifts || []; // Return empty array if no shifts found
        } catch (error) {
            console.error('Get upcoming shifts error:', error);
            return []; // Return empty array on error
        }
    }
}

module.exports = EmployeeController;