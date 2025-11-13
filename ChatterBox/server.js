
const dotenv=require('dotenv');

dotenv.config();

const dbconfig=require('./config/db.config.js');

const server=require('./app');

const PORT = process.env.PORT || 5001; 

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); 
});

