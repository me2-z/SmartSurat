const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const complaintsPath = path.join(__dirname, '../data/complaints.json');

// Read complaints
function getComplaints() {
  return JSON.parse(fs.readFileSync(complaintsPath, 'utf8'));
}

// Save complaints
function saveComplaints(data) {
  fs.writeFileSync(complaintsPath, JSON.stringify(data, null, 2));
}

// ✅ GET all complaints
router.get('/complaints', (req, res) => {
  const complaints = getComplaints();
  res.json(complaints);
});

// ✅ PUT update status
router.put('/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ error: 'Complaint not found' });

  complaints[index].status = status;
  saveComplaints(complaints);
  res.json({ success: true, message: 'Status updated' });
});

// ✅ DELETE complaint
router.delete('/complaints/:id', (req, res) => {
  const { id } = req.params;
  let complaints = getComplaints();
  complaints = complaints.filter(c => c.id != id);
  saveComplaints(complaints);
  res.json({ success: true, message: 'Complaint deleted' });
});

module.exports = router;
