/* backend/tools/uploadLogo.js */
require("dotenv").config();
const { cloudinary } = require("../utils/cloudinary");
const path = require("path");

(async () => {
  try {
    /* absolute path to logo.png */
    const file = path
      .join(__dirname, "..", "..", "frontend", "public", "images", "logo.png")
      .replace(/\\/g, "/");                    // use forward-slashes

    const publicId = "natraj-book-depot/logo";

    const { secure_url } = await cloudinary.uploader.upload(file, {
      public_id: publicId,
      overwrite: true,
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    console.log(`logo.png  ➜  ${secure_url}`);
  } catch (err) {
    console.error("Logo upload failed:", err.message || err);
  }
})();
