const express = require('express');
const db = require('../database/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all subscription boxes with filters
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            minRating,
            search,
            sortBy = 'name',
            sortOrder = 'ASC',
            page = 1,
            limit = 20
        } = req.query;

        let query = `
            SELECT 
                sb.*,
                c.name as category_name,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as review_count
            FROM subscription_boxes sb
            LEFT JOIN categories c ON sb.category_id = c.id
            LEFT JOIN reviews r ON sb.id = r.box_id
            WHERE 1=1
        `;
        
        const params = [];

        // Apply filters
        if (category && category !== 'All') {
            query += ' AND c.name = ?';
            params.push(category);
        }

        if (minPrice) {
            query += ' AND sb.price >= ?';
            params.push(parseFloat(minPrice));
        }

        if (maxPrice) {
            query += ' AND sb.price <= ?';
            params.push(parseFloat(maxPrice));
        }

        if (search) {
            query += ' AND (sb.name LIKE ? OR sb.description LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' GROUP BY sb.id';

        if (minRating) {
            query += ' HAVING average_rating >= ?';
            params.push(parseFloat(minRating));
        }

        // Apply sorting
        const validSortFields = ['name', 'price', 'average_rating', 'created_at'];
        const validSortOrders = ['ASC', 'DESC'];
        
        if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toUpperCase())) {
            if (sortBy === 'average_rating') {
                query += ` ORDER BY average_rating ${sortOrder.toUpperCase()}`;
            } else {
                query += ` ORDER BY sb.${sortBy} ${sortOrder.toUpperCase()}`;
            }
        }

        // Apply pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const boxes = await db.all(query, params);

        // Parse features JSON for each box
        const processedBoxes = boxes.map(box => ({
            ...box,
            features: JSON.parse(box.features || '[]'),
            category: box.category_name,
            averageRating: parseFloat(box.average_rating),
            reviewCount: parseInt(box.review_count)
        }));

        // Get total count for pagination
        let countQuery = `
            SELECT COUNT(DISTINCT sb.id) as total
            FROM subscription_boxes sb
            LEFT JOIN categories c ON sb.category_id = c.id
            LEFT JOIN reviews r ON sb.id = r.box_id
            WHERE 1=1
        `;
        
        const countParams = [];
        let paramIndex = 0;

        if (category && category !== 'All') {
            countQuery += ' AND c.name = ?';
            countParams.push(params[paramIndex++]);
        }

        if (minPrice) {
            countQuery += ' AND sb.price >= ?';
            countParams.push(params[paramIndex++]);
        }

        if (maxPrice) {
            countQuery += ' AND sb.price <= ?';
            countParams.push(params[paramIndex++]);
        }

        if (search) {
            countQuery += ' AND (sb.name LIKE ? OR sb.description LIKE ?)';
            countParams.push(params[paramIndex++], params[paramIndex++]);
        }

        const countResult = await db.get(countQuery, countParams);
        const total = countResult.total;

        res.json({
            boxes: processedBoxes,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get boxes error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single subscription box
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const box = await db.get(`
            SELECT 
                sb.*,
                c.name as category_name,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as review_count
            FROM subscription_boxes sb
            LEFT JOIN categories c ON sb.category_id = c.id
            LEFT JOIN reviews r ON sb.id = r.box_id
            WHERE sb.id = ?
            GROUP BY sb.id
        `, [id]);

        if (!box) {
            return res.status(404).json({ error: 'Subscription box not found' });
        }

        // Parse features JSON
        const processedBox = {
            ...box,
            features: JSON.parse(box.features || '[]'),
            category: box.category_name,
            averageRating: parseFloat(box.average_rating),
            reviewCount: parseInt(box.review_count)
        };

        res.json({ box: processedBox });
    } catch (error) {
        console.error('Get box error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get categories
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await db.all('SELECT * FROM categories ORDER BY name');
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;