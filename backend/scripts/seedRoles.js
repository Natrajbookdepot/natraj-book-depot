require("dotenv").config();
const mongoose = require("mongoose");
const Role = require("../models/roleModel");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const basePerms = [
      { key: "canViewProducts", label: "View products" },
      { key: "canEditProducts", label: "Create / edit products" },
      { key: "canViewOrders", label: "View orders" },
      { key: "canUpdateOrderStatus", label: "Update order status" },
      { key: "canViewDiscounts", label: "View discounts" },
      { key: "canEditDiscounts", label: "Create / edit discounts" },
    ];

    await Role.deleteMany({});
    await Role.create([
      { name: "super-admin", permissions: basePerms },
      { name: "staff", permissions: basePerms.filter(p => p.key !== "canEditDiscounts") },
    ]);

    console.log("✅ Roles seeded");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
