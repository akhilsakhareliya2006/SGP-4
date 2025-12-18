const express = require('express');
const db = require('../database/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a specific box
router.get('/box/:boxId', optionalAuth, async (req, res) => {
    try {
        const { boxId } = req.params;
        const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

        const reviews = await db.all(`
            SELECT 
                r.*,
                u.name as user_name,
                u.avatar_url as user_avatar
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.box_id = ?
            ORDER BY r.${sortBy} ${sortOrder}
            LIMIT ? OFFSET ?
        `, [boxId, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);

        // Get total count
        const countResult = await db.get('SELECT COUNT(*) as total FROM reviews WHERE box_id = ?', [boxId]);
        const total = countResult.total;

        const processedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.user_id,
            boxId: review.box_id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.created_at,
            updatedAt: review.updated_at,
            user: {
                name: review.user_name,
                avatar: review.user_avatar
            }
        }));

        res.json({
            reviews: processedReviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a review
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { boxId, rating, comment } = req.body;
        const userId = req.user.id;

        // Validation
        if (!boxId || !rating) {
            return res.status(400).json({ error: 'Box ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if box exists
        const box = await db.get('SELECT id FROM subscription_boxes WHERE id = ?', [boxId]);
        if (!box) {
            return res.status(404).json({ error: 'Subscription box not found' });
        }

        // Check if user already reviewed this box
        const existingReview = await db.get('SELECT id FROM reviews WHERE user_id = ? AND box_id = ?', [userId, boxId]);
        if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this box' });
        }

        // Create review
        const result = await db.run(
            'INSERT INTO reviews (user_id, box_id, rating, comment) VALUES (?, ?, ?, ?)',
            [userId, boxId, rating, comment || null]
        );

        // Get the created review with user info
        const review = await db.get(`
            SELECT 
                r.*,
                u.name as user_name,
                u.avatar_url as user_avatar
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?
        `, [result.id]);

        const processedReview = {
            id: review.id,
            userId: review.user_id,
            boxId: review.box_id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.created_at,
            updatedAt: review.updated_at,
            user: {
                name: review.user_name,
                avatar: review.user_avatar
            }
        };

        res.status(201).json({
            message: 'Review created successfully',
            review: processedReview
        });
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a review
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Validation
        if (!rating) {
            return res.status(400).json({ error: 'Rating is required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if review exists and belongs to user
        const existingReview = await db.get('SELECT * FROM reviews WHERE id = ? AND user_id = ?', [id, userId]);
        if (!existingReview) {
            return res.status(404).json({ error: 'Review not found or you do not have permission to edit it' });
        }

        // Update review
        await db.run(
            'UPDATE reviews SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [rating, comment || null, id]
        );

        // Get updated review with user info
        const review = await db.get(`
            SELECT 
                r.*,
                u.name as user_name,
                u.avatar_url as user_avatar
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.id = ?
        `, [id]);

        const processedReview = {
            id: review.id,
            userId: review.user_id,
            boxId: review.box_id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.created_at,
            updatedAt: review.updated_at,
            user: {
                name: review.user_name,
                avatar: review.user_avatar
            }
        };

        res.json({
            message: 'Review updated successfully',
            review: processedReview
        });
    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a review
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if review exists and belongs to user
        const existingReview = await db.get('SELECT * FROM reviews WHERE id = ? AND user_id = ?', [id, userId]);
        if (!existingReview) {
            return res.status(404).json({ error: 'Review not found or you do not have permission to delete it' });
        }

        // Delete review
        await db.run('DELETE FROM reviews WHERE id = ?', [id]);

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's reviews
router.get('/user/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await db.all(`
            SELECT 
                r.*,
                sb.name as box_name,
                sb.image_url as box_image,
                sb.price as box_price,
                c.name as box_category
            FROM reviews r
            JOIN subscription_boxes sb ON r.box_id = sb.id
            JOIN categories c ON sb.category_id = c.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [userId, parseInt(limit), (parseInt(page) - 1) * parseInt(limit)]);

        // Get total count
        const countResult = await db.get('SELECT COUNT(*) as total FROM reviews WHERE user_id = ?', [userId]);
        const total = countResult.total;

        const processedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.user_id,
            boxId: review.box_id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.created_at,
            updatedAt: review.updated_at,
            box: {
                id: review.box_id,
                name: review.box_name,
                imageUrl: review.box_image,
                price: review.box_price,
                category: review.box_category
            }
        }));

        res.json({
            reviews: processedReviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get user reviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;