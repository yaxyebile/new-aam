const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Database ────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message)
        process.exit(1)
    })

// ── Routes ──────────────────────────────────────────────────
app.use('/api/articles', require('./routes/articles'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/upload', require('./routes/upload'))

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AAM News API is running!',
        time: new Date().toISOString(),
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    })
})

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    })
})

// ── Start ───────────────────────────────────────────────────
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 AAM News API running on http://localhost:${PORT}`)
        console.log(`📋 Endpoints:`)
        console.log(`   GET  /api/health`)
        console.log(`   GET  /api/articles`)
        console.log(`   POST /api/auth/login`)
        console.log(`   POST /api/auth/register`)
        console.log(`   GET  /api/comments/:articleId`)
        console.log(`   POST /api/upload/image`)
    })
}

module.exports = app
