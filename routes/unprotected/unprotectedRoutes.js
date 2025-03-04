const express = require('express');
const router = express.Router();
const Product = require('../../database/models/product');

router.get('/', async (req, res) => {
    try {
        // Fetch featured menu items from the database
        const menuItems = await Product.find().limit(6);

        // Define reviews data
        const reviews = [
            {
                initials: 'SJ',
                name: 'Sarah J.',
                text: 'The atmosphere is so welcoming, and their cappuccino is simply perfect. I start every morning here!'
            },
            {
                initials: 'MC',
                name: 'Michael C.',
                text: 'Their seasonal specials never disappoint. The pumpkin spice latte is a must-try!'
            },
            {
                initials: 'ET',
                name: 'Emma T.',
                text: 'The pastries are freshly baked and absolutely delicious. Perfect with their signature blend coffee!'
            },
            {
                initials: 'JL',
                name: 'John L.',
                text: 'I love the minimalist approach to the menu. It makes my choice so much easier!'
            }
        ];

        res.render('index', {
            title: 'Home',
            menuItems: menuItems || [],
            reviews: reviews // Pass reviews to the template
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.render('index', {
            title: 'Home',
            menuItems: [],
            reviews: [] // Provide empty array as fallback
        });
    }
});

module.exports = router;