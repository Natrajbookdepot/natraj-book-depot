const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Category = require('./models/category');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const cats = await Category.find({}, 'name subcategories.name');
    fs.writeFileSync('cats_data.json', JSON.stringify(cats, null, 2));
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
