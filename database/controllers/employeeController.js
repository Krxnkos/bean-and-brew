const User = require('../models/User');
const Product = require('../models/Product');

class EmployeeController {
    constructor() {
        this.getManagerInfo = this.getManagerInfo.bind(this);
        this.getPopularItems = this.getPopularItems.bind(this);
        this.getUpcomingShifts = this.getUpcomingShifts.bind(this);
    }

    async getManagerInfo(employeeId) {
        try {
            // For demo purposes, returning mock manager data
            return {
                name: "John Smith",
                email: "john.smith@beanandbrew.com",
                imageUrl: "/images/manager.jpg",
                phone: "07700 900000"
            };
        } catch (error) {
            console.error('Get manager info error:', error);
            throw error;
        }
    }

    async getPopularItems() {
        try {
            // Get top 5 products (you can modify this logic based on your needs)
            const products = await Product.find().limit(5).lean();
            return products.map(product => ({
                name: product.name,
                soldCount: Math.floor(Math.random() * 100) // Mock data for demonstration
            }));
        } catch (error) {
            console.error('Get popular items error:', error);
            throw error;
        }
    }

    async getUpcomingShifts(employeeId) {
        try {
            // Mock data for demonstration
            const nextWeek = [...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return {
                    date: date.toLocaleDateString(),
                    startTime: '09:00',
                    endTime: '17:00',
                    location: ['Leeds', 'Harrogate', 'Knaresborough Castle'][Math.floor(Math.random() * 3)]
                };
            });
            return nextWeek;
        } catch (error) {
            console.error('Get upcoming shifts error:', error);
            throw error;
        }
    }
}

module.exports = EmployeeController;