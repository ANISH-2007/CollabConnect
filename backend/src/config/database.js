import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root@12345',  // ← Use the password you set during mysql_secure_installation
  database: 'collabconnect',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;