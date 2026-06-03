import mysql from 'mysql2/promise';

// Check if we're in production (Render) or local development
const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root@123',
  database: process.env.DB_NAME || 'collabconnect',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  // For production (Render MySQL), add SSL if needed
  ...(isProduction && process.env.DB_SSL === 'true' && {
    ssl: { rejectUnauthorized: false }
  })
});

export default pool;