const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { protect } = require('./auth')

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const name = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, name + ext)
    }
})

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Only images are allowed (jpeg, png, webp, gif)'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

// POST /api/upload/image — Upload image (admin/editor only)
router.post('/image', protect, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const imageUrl = `/uploads/${req.file.filename}`
    res.json({ imageUrl, message: 'Image uploaded successfully' })
})

// Error handler for multer
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message) {
        return res.status(400).json({ message: err.message })
    }
    next(err)
})

module.exports = router
