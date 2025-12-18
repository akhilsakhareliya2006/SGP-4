const express = require('express');
const db = require('../database/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', optionalAuth, async (req, res) => {
    try {
        // Get total boxes
        const totalBoxesResult = await db.get('SELECT COUNT(*) as count FROM subscription_boxes');
        const totalBoxes = totalBoxesResult.count;

        // Get average price
        const avgPriceResult = await db.get('SELECT AVG(price) as avg FROM subscription_boxes');
        const averagePrice = parseFloat(avgPriceResult.avg || 0);

        // Get total reviews
        const totalReviewsResult = await db.get('SELECT COUNT(*) as count FROM reviews');
        const totalReviews = totalReviewsResult.count;

        // Get average rating
        const avgRatingResult = await db.get('SELECT AVG(rating) as avg FROM reviews');
        const averageRating = parseFloat(avgRatingResult.avg || 0);

        // Get top rated boxes
        const topRatedBoxes = await db.all(`
            SELECT 
                sb.*,
                c.name as category_name,
                COALESCE(AVG(r.rating), 0) as average_rating,
                COUNT(r.id) as review_count
            FROM subscription_boxes sb
            LEFT JOIN categories c ON sb.category_id = c.id
            LEFT JOIN reviews r ON sb.id = r.box_id
            GROUP BY sb.id
            ORDER BY average_rating DESC, review_count DESC
            LIMIT 5
        `);

        // Get category distribution
        const categoryDistribution = await db.all(`
            SELECT 
                c.name as category,
                COUNT(sb.id) as count
            FROM categories c
            LEFT JOIN subscription_boxes sb ON c.id = sb.category_id
            GROUP BY c.id, c.name
            ORDER BY count DESC
        `);

        // Get recent reviews
        const recentReviews = await db.all(`
            SELECT 
                r.*,
                u.name as user_name,
                u.avatar_url as user_avatar,
                sb.name as box_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN subscription_boxes sb ON r.box_id = sb.id
            ORDER BY r.created_at DESC
            LIMIT 5
        `);

        // Process data
        const processedTopRated = topRatedBoxes.map(box => ({
            ...box,
            features: JSON.parse(box.features || '[]'),
            category: box.category_name,
            averageRating: parseFloat(box.average_rating),
            reviewCount: parseInt(box.review_count)
        }));

        const processedRecentReviews = recentReviews.map(review => ({
            id: review.id,
            userId: review.user_id,
            boxId: review.box_id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.created_at,
            user: {
                name: review.user_name,
                avatar: review.user_avatar
            },
            boxName: review.box_name
        }));

        res.json({
            stats: {
                totalBoxes,
                averagePrice,
                totalReviews,
                averageRating
            },
            topRatedBoxes: processedTopRated,
            categoryDistribution,
            recentReviews: processedRecentReviews
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;