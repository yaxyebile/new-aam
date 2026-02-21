const express = require('express')
const router = express.Router()
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const { protect } = require('./auth')

// GET /api/articles — Get all articles
router.get('/', async (req, res) => {
    try {
        const { category, search, featured, breaking, limit = 20, page = 1 } = req.query
        const query = { published: true }

        if (category && category !== 'All') query.category = category
        if (featured === 'true') query.featured = true
        if (breaking === 'true') query.breaking = true

        if (search) {
            query.$text = { $search: search }
        }

        const total = await Article.countDocuments(query)
        const articles = await Article.find(query)
            .sort({ publishedAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .select('-content')

        res.json({
            articles,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET /api/articles/featured — Get featured articles
router.get('/featured', async (req, res) => {
    try {
        const articles = await Article.find({ featured: true, published: true })
            .sort({ publishedAt: -1 })
            .limit(10)
            .select('-content')
        res.json(articles)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET /api/articles/breaking — Get breaking news
router.get('/breaking', async (req, res) => {
    try {
        const articles = await Article.find({ breaking: true, published: true })
            .sort({ publishedAt: -1 })
            .limit(10)
            .select('title slug category publishedAt')
        res.json(articles)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET /api/articles/stats — Admin statistics (no auth needed, read-only)
router.get('/stats', async (req, res) => {
    try {
        const total = await Article.countDocuments()
        const published = await Article.countDocuments({ published: true })
        const featured = await Article.countDocuments({ featured: true })
        const breaking = await Article.countDocuments({ breaking: true })
        const totalViews = await Article.aggregate([
            { $group: { _id: null, total: { $sum: '$viewCount' } } }
        ])
        const byCategory = await Article.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
        res.json({
            total, published, featured, breaking,
            totalViews: totalViews[0]?.total || 0,
            byCategory
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET /api/articles/:id — Get single article by ID or slug
router.get('/:id', async (req, res) => {
    try {
        const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/)
        let article

        if (isObjectId) {
            article = await Article.findById(req.params.id)
        } else {
            article = await Article.findOne({ slug: req.params.id })
        }

        if (!article) return res.status(404).json({ message: 'Article not found' })

        // Increment view count
        article.viewCount = (article.viewCount || 0) + 1
        await article.save()

        // Get comments count
        const commentsCount = await Comment.countDocuments({ article: article._id, approved: true })

        res.json({ ...article.toObject(), commentsCount })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST /api/articles — Create article (admin/editor)
router.post('/', protect, async (req, res) => {
    try {
        const article = new Article(req.body)
        const saved = await article.save()
        res.status(201).json(saved)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// PUT /api/articles/:id — Update article (admin/editor)
router.put('/:id', protect, async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!article) return res.status(404).json({ message: 'Article not found' })
        res.json(article)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// DELETE /api/articles/:id — Delete article (admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        if (!article) return res.status(404).json({ message: 'Article not found' })
        // Also delete related comments
        await Comment.deleteMany({ article: req.params.id })
        res.json({ message: 'Article deleted successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
