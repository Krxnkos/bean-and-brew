const mongoose = require('mongoose');
const User = require('../../database/models/user');
require('dotenv').config();

async function verifyTeamMembers() {
    try {
        await mongoose.connect(process.env.DB_CONN);
        
        // Get all managers
        const managers = await User.find({
            userType: { $in: ['manager', 'admin'] }
        }).select('_id firstName lastName');

        for (const manager of managers) {
            // Find team members for each manager
            const teamMembers = await User.find({
                lineManager: manager._id
            }).select('firstName lastName userType');

            console.log(`\nManager: ${manager.firstName} ${manager.lastName}`);
            console.log('Team members:', teamMembers.length);
            teamMembers.forEach(member => {
                console.log(`- ${member.firstName} ${member.lastName} (${member.userType})`);
            });
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Verification error:', error);
    }
}

verifyTeamMembers();