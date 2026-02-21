const mongoose = require('mongoose')

// Generate slug from title
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
}

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    excerpt: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['World', 'Politics', 'Business', 'Technology', 'Science', 'Sports', 'Entertainment', 'Health']
    },
    imageUrl: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', 'audio', 'youtube'],
        default: 'image'
    },
    mediaUrl: {
        type: String,
        default: ''
    },
    blocks: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    featured: {
        type: Boolean,
        default: false
    },
    breaking: {
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Auto-generate slug before save
articleSchema.pre('save', function (next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = slugify(this.title) + '-' + Date.now()
    }
    next()
})

// Text search index
articleSchema.index({ title: 'text', excerpt: 'text', content: 'text', author: 'text', tags: 'text' })

module.exports = mongoose.model('Article', articleSchema)
