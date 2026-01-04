const fs = require('fs');

const cats = JSON.parse(fs.readFileSync('cats_data.json', 'utf8'));

const products = [];

cats.forEach(cat => {
    cat.subcategories.forEach(sub => {
        for (let i = 1; i <= 10; i++) {
            const title = `${sub.name} Professional Series - ${i}`;
            const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 5);
            products.push({
                Title: title,
                Slug: slug,
                Description: `High-quality ${sub.name} product from the Natraj Professional series. Perfect for ${cat.name} requirements.`,
                Category: cat.name,
                Subcategory: sub.name,
                Brand: "Natraj Elite",
                Price: Math.floor(Math.random() * (2000 - 100) + 100),
                StockCount: Math.floor(Math.random() * 100) + 10,
                InStock: "TRUE",
                Featured: i % 3 === 0 ? "TRUE" : "FALSE",
                BestSeller: i % 2 === 0 ? "TRUE" : "FALSE"
            });
        }
    });
});

fs.writeFileSync('sample_products.json', JSON.stringify(products, null, 2));
console.log(`Generated ${products.length} products.`);
