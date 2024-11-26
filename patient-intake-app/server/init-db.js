const bcrypt = require('bcrypt');
const db = require('./database');

async function initializeDatabase() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.run(`
      INSERT INTO users (username, password, role)
      VALUES (?, ?, ?)
    `, ['admin', hashedPassword, 'admin']);

    // Create sample doctors
    const doctors = [
      ['Dr. John Smith', 'General Medicine', 'john.smith@example.com', '555-0101'],
      ['Dr. Sarah Johnson', 'Cardiology', 'sarah.johnson@example.com', '555-0102'],
      ['Dr. Michael Brown', 'Pediatrics', 'michael.brown@example.com', '555-0103']
    ];

    doctors.forEach(doctor => {
      db.run(`
        INSERT INTO doctors (name, specialization, email, phone)
        VALUES (?, ?, ?, ?)
      `, doctor);
    });

    console.log('Database initialized successfully with sample data!');
    console.log('Admin login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
