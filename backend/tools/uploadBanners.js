// backend/tools/uploadBanners.js
require("dotenv").config();
const { cloudinary } = require("../utils/cloudinary");
const glob  = require("glob");
const path  = require("path");

(async () => {
  /* 1. Find all banner assets (images + mp4) */
  const dir     = path.join(__dirname, "..", "Uploads");
  const pattern = dir.replace(/\\/g, "/") + "/*.{png,jpg,jpeg,webp,gif,mp4}";
  const files   = glob.sync(pattern, { nocase: true });

  if (!files.length) {
    console.error("No banner assets found.");
    return;
  }

  /* 2. Upload each file */
  for (const file of files) {
    try {
      const ext       = path.extname(file).toLowerCase();
      const isVideo   = ext === ".mp4";                 // ← detect videos
      const publicId  = "natraj-book-depot/banners/" +
                        path.basename(file, ext);

      const { secure_url } = await cloudinary.uploader.upload(file, {
        public_id:     publicId,
        overwrite:     true,
        resource_type: isVideo ? "video" : "image",     // ← key line
      });

      console.log(`${file} ➜ ${secure_url}`);
    } catch (err) {
      console.error(`Failed for ${file}:`, err.message || err);
    }
  }
})();
