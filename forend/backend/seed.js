/**
 * Seed script — creates default admin user and sample articles
 * Run: node seed.js
 */
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Article = require('./models/Article')

const sampleArticles = [
    {
        title: 'Breaking: Major Climate Summit Reaches Historic Agreement',
        excerpt: 'World leaders gathered in Geneva have signed a landmark climate agreement pledging to cut emissions by 50% before 2035.',
        content: `<p>World leaders from over 190 countries gathered in Geneva have signed a landmark climate agreement pledging to cut carbon emissions by 50% before 2035.</p><p>The agreement, dubbed the "Geneva Accord," represents the most ambitious climate commitment in history. Key provisions include a rapid phase-out of coal power plants, massive investments in renewable energy, and financial support for developing nations.</p><p>"This is a turning point for our planet," said the UN Secretary-General at the signing ceremony.</p>`,
        category: 'World',
        imageUrl: '',
        author: 'Ahmed Hassan',
        featured: true,
        breaking: true,
        tags: ['climate', 'environment', 'world']
    },
    {
        title: 'Tech Giants Announce AI Partnership for Medical Research',
        excerpt: 'Leading technology companies have formed a consortium to accelerate AI-driven medical discoveries.',
        content: `<p>Several of the world's largest technology companies announced today the formation of a new consortium dedicated to applying artificial intelligence to medical research challenges.</p><p>The initiative will fund over $2 billion in AI research over the next five years, focusing on drug discovery, disease diagnosis, and personalized medicine.</p>`,
        category: 'Technology',
        imageUrl: '',
        author: 'Sarah Johnson',
        featured: true,
        breaking: false,
        tags: ['AI', 'technology', 'health', 'medicine']
    },
    {
        title: 'Global Markets Rally as Inflation Shows Signs of Easing',
        excerpt: 'Stock markets around the world surged following new data suggesting inflation is beginning to moderate.',
        content: `<p>Stock markets around the world surged on Thursday following the release of new economic data suggesting that inflation in major economies is beginning to moderate.</p><p>The S&P 500 gained 2.3%, the European STOXX 600 rose 1.8%, and Asian markets saw similar gains. Analysts say the data gives central banks more room to ease monetary policy.</p>`,
        category: 'Business',
        imageUrl: '',
        author: 'Michael Chen',
        featured: false,
        breaking: false,
        tags: ['economy', 'markets', 'inflation']
    },
    {
        title: 'Scientists Discover New Species in Amazon Rainforest',
        excerpt: 'A research expedition has uncovered three previously unknown species of amphibians deep in the Amazon.',
        content: `<p>A team of international scientists conducting a biodiversity survey deep in the Amazon rainforest has discovered three previously unknown species of amphibians.</p><p>The discovery highlights the importance of protecting the Amazon ecosystem, which scientists estimate still holds thousands of undiscovered species.</p>`,
        category: 'Science',
        imageUrl: '',
        author: 'Elena Rodriguez',
        featured: false,
        breaking: false,
        tags: ['science', 'nature', 'amazon', 'discovery']
    },
    {
        title: 'Championship Finals Set After Dramatic Semifinals',
        excerpt: 'After two thrilling matches, the finalists for this year\'s championship have been determined.',
        content: `<p>After two days of thrilling semifinal action, the stage is set for what promises to be an unforgettable championship final.</p><p>Fans from around the world will be tuning in to watch what experts are calling the most competitive final in years.</p>`,
        category: 'Sports',
        imageUrl: '',
        author: 'James Wilson',
        featured: false,
        breaking: false,
        tags: ['sports', 'championship', 'finals']
    }
]

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ Connected to MongoDB')

        // Create admin user
        const existingAdmin = await User.findOne({ username: 'admin' })
        if (!existingAdmin) {
            await User.create({
                username: 'admin',
                email: 'admin@aamnews.com',
                password: 'admin123',
                role: 'admin'
            })
            console.log('✅ Admin user created (username: admin, password: admin123)')
        } else {
            console.log('ℹ️  Admin user already exists')
        }

        // Create sample articles
        const count = await Article.countDocuments()
        if (count === 0) {
            for (const data of sampleArticles) {
                const article = new Article(data)
                await article.save()
            }
            console.log(`✅ ${sampleArticles.length} sample articles created`)
        } else {
            console.log(`ℹ️  ${count} articles already exist, skipping`)
        }

        console.log('\n🎉 Seed completed!')
        console.log('   Login with: admin / admin123')
        process.exit(0)
    } catch (err) {
        console.error('❌ Seed error:', err.message)
        process.exit(1)
    }
}

seed()
