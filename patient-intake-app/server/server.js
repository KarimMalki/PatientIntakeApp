const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
// Auth routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ token, role: user.role });
  });
});

// Doctor routes
app.get('/api/doctors', authenticateToken, (req, res) => {
  db.all('SELECT * FROM doctors', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/doctors', authenticateToken, (req, res) => {
  const { name, specialization, email, phone } = req.body;
  
  db.run(
    'INSERT INTO doctors (name, specialization, email, phone) VALUES (?, ?, ?, ?)',
    [name, specialization, email, phone],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Patient routes
app.get('/api/patients', authenticateToken, (req, res) => {
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/patients', authenticateToken, (req, res) => {
  const { name, email, phone, date_of_birth, address, medical_history } = req.body;
  
  db.run(
    'INSERT INTO patients (name, email, phone, date_of_birth, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, phone, date_of_birth, address, medical_history],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Appointment routes
app.get('/api/appointments', authenticateToken, (req, res) => {
  db.all(`
    SELECT 
      a.*,
      p.name as patient_name,
      d.name as doctor_name
    FROM appointments a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON a.doctor_id = d.id
  `, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const { patient_id, doctor_id, date, time, description } = req.body;
  
  db.run(
    'INSERT INTO appointments (patient_id, doctor_id, date, time, description) VALUES (?, ?, ?, ?, ?)',
    [patient_id, doctor_id, date, time, description],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
