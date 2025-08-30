
const dotenv=require('dotenv');

dotenv.config();

const dbconfig=require('./config/db.config.js');

const app=require('./app');

const PORT = process.env.PORT || 5001; // No semicolons here either
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Template string, no semicolon inside
});
