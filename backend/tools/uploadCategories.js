// backend/tools/uploadCategories.js
require("dotenv").config();
const { cloudinary } = require("../utils/cloudinary");
const glob = require("glob");
const path = require("path");
(async () => {
  /* 1️⃣  Build absolute directory path with path.join (back-slashes are OK) */
  const dir = path.join(__dirname, "..", "..", "frontend", "public", "category");

  /* 2️⃣  Build glob expression with *forward* slashes   <-- key change */
  const pattern = dir.replace(/\\/g, "/") + "/*.{png,jpg,jpeg}";

  console.log("Glob pattern:", pattern);           // C:/.../category/*.{png,jpg,jpeg}

  /* 3️⃣  Find matching files */
  const files = glob.sync(pattern, { nocase: true });

  if (!files.length) {
    console.error("No images matched – check folder and extensions.");
    return;
  }

  /* 4️⃣  Upload each image */
  for (const file of files) {
    const publicId =
      "natraj-book-depot/category/" + path.basename(file, path.extname(file));

    const { secure_url } = await cloudinary.uploader.upload(file, {
      public_id: publicId,
      overwrite: true,
    });

    console.log(`${file}  ➜  ${secure_url}`);
  }
})();