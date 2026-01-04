const fs = require('fs');
const products = JSON.parse(fs.readFileSync('sample_products.json', 'utf8'));

const header = "Title,Slug,Description,Category,Subcategory,Brand,Price,StockCount,InStock,Featured,BestSeller";
const rows = products.map(p => {
    return `"${p.Title}","${p.Slug}","${p.Description}","${p.Category}","${p.Subcategory}","${p.Brand}",${p.Price},${p.StockCount},${p.InStock},${p.Featured},${p.BestSeller}`;
});

fs.writeFileSync('sample_products.csv', [header, ...rows].join('\n'));
console.log("CSV generated.");
