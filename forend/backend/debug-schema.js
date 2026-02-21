const mongoose = require('mongoose');
const Article = require('./models/Article');
console.log('Excerpt paths validator:', Article.schema.path('excerpt').validators);
process.exit(0);
