const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')
const { protect } = require('./auth')

// GET /api/comments — Get all comments (admin only)
router.get('/', protect, async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('article', 'title')
            .sort({ createdAt: -1 })
        res.json(comments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET /api/comments/:articleId — Get comments for article
router.get('/:articleId', async (req, res) => {
    try {
        const comments = await Comment.find({
            article: req.params.articleId,
            approved: true
        }).sort({ createdAt: -1 })
        res.json(comments)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST /api/comments/:articleId — Add comment
router.post('/:articleId', async (req, res) => {
    try {
        const { author, email, content } = req.body
        if (!author || !content)
            return res.status(400).json({ message: 'Author and content are required' })

        const comment = await Comment.create({
            article: req.params.articleId,
            author,
            email,
            content
        })
        res.status(201).json(comment)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// DELETE /api/comments/:id — Delete comment (admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id)
        if (!comment) return res.status(404).json({ message: 'Comment not found' })
        res.json({ message: 'Comment deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// PATCH /api/comments/:id/approve — Toggle approval (admin only)
router.patch('/:id/approve', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment) return res.status(404).json({ message: 'Comment not found' })
        comment.approved = !comment.approved
        await comment.save()
        res.json(comment)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router
