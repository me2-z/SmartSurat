const express = require('express');
const router = express.Router();

// Hardcoded users (no file reading)
const USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User"
  },
  {
    id: 2,
    username: "meet",
    password: "meetzanzmera",
    role: "citizen",
    name: "Meet Zanzmera"
  }
];

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const user = USERS.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ 
    message: 'Login successful', 
    user: { id: user.id, username: user.username, name: user.name, role: user.role }
  });
});

// Register route (optional)
router.post('/register', (req, res) => {
  const { username, password, name } = req.body;
  
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const existingUser = USERS.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const newUser = {
    id: USERS.length + 1,
    username,
    password,
    name,
    role: 'citizen'
  };
  
  // In a real app, you'd save to file/database
  // For demo, we'll just send success
  res.status(201).json({ 
    message: 'User registered successfully', 
    user: { id: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role }
  });
});

module.exports = router;