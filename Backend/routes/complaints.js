const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const COMPLAINTS_FILE = path.join(__dirname, '../data/complaints.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Helper to read complaints
const readComplaints = () => {
  try {
    const data = fs.readFileSync(COMPLAINTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading complaints:', error);
    return [];
  }
};

// Helper to read users
const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
};

// Get all complaints (for admin)
router.get('/', (req, res) => {
  const complaints = readComplaints();
  const users = readUsers();
  
  const complaintsWithUser = complaints.map(complaint => {
    const user = users.find(u => u.id === complaint.userId);
    return {
      ...complaint,
      userName: user ? user.name : 'Unknown User',
      photoUrl: complaint.photoUrl || null
    };
  });
  
  res.json(complaintsWithUser);
});

// Get complaints for a specific user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const complaints = readComplaints().filter(c => c.userId == userId);
  const users = readUsers();
  
  const complaintsWithUser = complaints.map(complaint => {
    const user = users.find(u => u.id === complaint.userId);
    return {
      ...complaint,
      userName: user ? user.name : 'Unknown User',
      photoUrl: complaint.photoUrl || null
    };
  });
  
  res.json(complaintsWithUser);
});

// Create complaint
router.post('/', (req, res) => {
  const { title, description, userId, photoUrl } = req.body;
  
  if (!title || !description || !userId) {
    return res.status(400).json({ error: 'Title, description, and userId are required' });
  }
  
  const complaints = readComplaints();
  const newComplaint = {
    id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
    title,
    description,
    userId: parseInt(userId),
    status: 'pending',
    createdAt: new Date().toISOString(),
    photoUrl: photoUrl || null
  };
  
  complaints.push(newComplaint);
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
  
  res.status(201).json(newComplaint);
});

// Update complaint status
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  const complaints = readComplaints();
  const index = complaints.findIndex(c => c.id == id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  
  complaints[index].status = status;
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
  
  res.json(complaints[index]);
});

// Delete complaint
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  let complaints = readComplaints();
  const initialLength = complaints.length;
  complaints = complaints.filter(c => c.id != id);
  
  if (complaints.length === initialLength) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  
  fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
  
  res.json({ message: 'Complaint deleted successfully' });
});

module.exports = router;