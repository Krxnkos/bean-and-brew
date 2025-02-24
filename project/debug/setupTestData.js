const mongoose = require('mongoose');
const User = require('../../database/models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function setupTestData() {
    try {
        await mongoose.connect(process.env.DB_CONN);
        console.log('Connected to database');

        // First create/get admin user (Operations Manager)
        const adminPassword = 'Admin123!';
        let admin = await User.findOneAndUpdate(
            { email: 'admin@beanandbrew.com' },
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@beanandbrew.com',
                password: await bcrypt.hash(adminPassword, 10),
                userType: 'admin',
                jobTitle: 'Operations Manager',
                location: 'Leeds'
            },
            { upsert: true, new: true }
        );
        console.log('Admin user created/updated');

        // Create/update manager reporting to admin
        const managerPassword = 'Manager123!';
        let manager = await User.findOneAndUpdate(
            { email: 'john.mustard@beanandbrew.com' },
            {
                firstName: 'John',
                lastName: 'Mustard',
                email: 'john.mustard@beanandbrew.com',
                password: await bcrypt.hash(managerPassword, 10),
                userType: 'manager',
                jobTitle: 'Site Manager',
                location: 'Leeds',
                lineManager: admin._id
            },
            { upsert: true, new: true }
        );
        console.log('Manager created/updated');

        // Create/update test employees
        const employeePassword = 'Employee123!';
        const employees = [
            {
                firstName: 'Sarah',
                lastName: 'Smith',
                email: 'sarah.smith@beanandbrew.com',
                password: await bcrypt.hash(employeePassword, 10),
                userType: 'employee',
                jobTitle: 'Senior Barista',
                location: 'Leeds',
                lineManager: manager._id
            },
            {
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike.johnson@beanandbrew.com',
                password: await bcrypt.hash(employeePassword, 10),
                userType: 'employee',
                jobTitle: 'Barista',
                location: 'Leeds',
                lineManager: manager._id
            }
        ];

        // Update or create employees
        for (const emp of employees) {
            await User.findOneAndUpdate(
                { email: emp.email },
                emp,
                { upsert: true, new: true }
            );
        }
        console.log('Employees created/updated');

        // Verify the setup
        console.log('\nTest Account Details:');
        console.log('===================');
        console.log('Admin Account:');
        console.log('Email: admin@beanandbrew.com');
        console.log('Password:', adminPassword);
        console.log('\nManager Account:');
        console.log('Email: john.mustard@beanandbrew.com');
        console.log('Password:', managerPassword);
        console.log('\nEmployee Accounts:');
        console.log('Email: sarah.smith@beanandbrew.com');
        console.log('Email: mike.johnson@beanandbrew.com');
        console.log('Password (for both):', employeePassword);

        // Verify relationships
        const managerTeam = await User.find({ lineManager: manager._id })
            .select('firstName lastName userType jobTitle');
        console.log('\nVerifying team structure:');
        console.log(`${manager.firstName} ${manager.lastName}'s team (${managerTeam.length} members):`);
        managerTeam.forEach(member => {
            console.log(`- ${member.firstName} ${member.lastName} (${member.jobTitle})`);
        });

        await mongoose.disconnect();
        console.log('\nSetup complete!');

    } catch (error) {
        console.error('Setup error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

setupTestData();