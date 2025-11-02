/* backend/tools/uploadProducts.js
   Upload all product images (jpg | png | webp) from
   backend/Uploads/products/images to Cloudinary
*/
require("dotenv").config();
const { cloudinary } = require("../utils/cloudinary");
const glob = require("glob");
const path = require("path");

(async () => {
  /* 1️⃣  Locate files ------------------------------------------------------ */
  const dir = path.join(__dirname, "..", "Uploads", "products");
  const pattern = dir.replace(/\\/g, "/") + "/*.{png,jpg,jpeg,webp}";
  const files = glob.sync(pattern, { nocase: true });

  if (!files.length) {
    console.error("No product images found.");
    return;
  }

  /* 2️⃣  Upload each file -------------------------------------------------- */
  for (const file of files) {
    try {
      // products/notebooks/blue-spiral.jpg  →  natraj-book-depot/products/notebooks/blue-spiral
      const relative = path
        .relative(dir, file)
        .replace(/\\/g, "/")                 // Windows → URL style
        .replace(path.extname(file), "");    // drop extension

      const publicId = `natraj-book-depot/products/${relative}`;

      const { secure_url } = await cloudinary.uploader.upload(file, {
        public_id: publicId,
        overwrite: true,
      });

      console.log(`${file}  ➜  ${secure_url}`);
    } catch (err) {
      console.error(`Failed for ${file}:`, err.message || err);
    }
  }
})();
