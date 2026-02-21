const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Middleware: protect route
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Not authorized' })
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch {
        res.status(401).json({ message: 'Invalid token' })
    }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password)
            return res.status(400).json({ message: 'All fields are required' })

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser)
            return res.status(409).json({ message: 'Username or email already exists' })

        const user = await User.create({ username, email, password })
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.status(201).json({ token, user })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password)
            return res.status(400).json({ message: 'Username and password are required' })

        // Check DB user first
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        }).select('+password')

        if (user) {
            const isMatch = await user.comparePassword(password)
            if (!isMatch)
                return res.status(401).json({ message: 'Invalid credentials' })

            const token = jwt.sign(
                { id: user._id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
            return res.json({ token, user })
        }

        // Fallback: legacy admin credentials from .env
        const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin'
        const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123'
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            const token = jwt.sign(
                { username, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            )
            return res.json({ token, user: { username, role: 'admin' } })
        }

        res.status(401).json({ message: 'Invalid credentials' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// GET /api/auth/me — Get current user
router.get('/me', protect, async (req, res) => {
    try {
        if (req.user.id) {
            const user = await User.findById(req.user.id)
            return res.json(user)
        }
        res.json({ username: req.user.username, role: req.user.role })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST /api/auth/verify — Verify token validity
router.post('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ valid: false })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json({ valid: true, user: decoded })
    } catch {
        res.status(401).json({ valid: false })
    }
})

module.exports = router
module.exports.protect = protect
