// backend/src/models/User.js
import pool from '../config/database.js';

// Create users table
export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      niche VARCHAR(100),
      follower_range VARCHAR(50),
      bio TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
  console.log('✅ Users table ready');
};

// Create new user
export const createUser = async (name, email, hashedPassword) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.query(query, [name, email, hashedPassword]);
  
  return {
    id: result.insertId,
    name,
    email
  };
};

// Find user by email
export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await pool.query(query, [email]);
  return rows[0];
};

// Find user by id
export const findUserById = async (id) => {
  const query = `SELECT id, name, email, niche, follower_range, bio FROM users WHERE id = ?`;
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

// Update user profile
export const updateUserProfile = async (id, niche, follower_range, bio) => {
  const query = `
    UPDATE users 
    SET niche = ?, follower_range = ?, bio = ?
    WHERE id = ?
  `;
  await pool.query(query, [niche, follower_range, bio, id]);
};