require('dotenv/config');
const mongoose = require('mongoose');

console.log("DATABASE_URL =", process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB ERROR:", err);
    process.exit(1);
  });
