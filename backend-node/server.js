import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database(join(__dirname, 'patients.db'), (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create patients table
        db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Patients table ready');
            }
        });
    }
});

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'AAVAAZ MedStream API is running' });
});

// Create patient
app.post('/api/patients', (req, res) => {
    const { name, date_of_birth, phone, address, diagnosis } = req.body;

    // Validation
    if (!name || !date_of_birth || !phone || !address || !diagnosis) {
        return res.status(400).json({
            error: 'All fields are required: name, date_of_birth, phone, address, diagnosis'
        });
    }

    const sql = `
    INSERT INTO patients (name, date_of_birth, phone, address, diagnosis)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(sql, [name, date_of_birth, phone, address, diagnosis], function (err) {
        if (err) {
            console.error('Error inserting patient:', err.message);
            return res.status(500).json({ error: 'Failed to create patient' });
        }

        // Fetch the created patient
        db.get('SELECT * FROM patients WHERE id = ?', [this.lastID], (err, row) => {
            if (err) {
                console.error('Error fetching patient:', err.message);
                return res.status(500).json({ error: 'Patient created but failed to retrieve' });
            }
            res.status(201).json(row);
        });
    });
});

// Search patients by name
app.get('/api/patients/search', (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Name query parameter is required' });
    }

    const sql = `SELECT * FROM patients WHERE name LIKE ? COLLATE NOCASE`;

    db.all(sql, [`%${name}%`], (err, rows) => {
        if (err) {
            console.error('Error searching patients:', err.message);
            return res.status(500).json({ error: 'Failed to search patients' });
        }
        res.json(rows);
    });
});

// Get all patients
app.get('/api/patients', (req, res) => {
    const sql = `SELECT * FROM patients ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching patients:', err.message);
            return res.status(500).json({ error: 'Failed to fetch patients' });
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`AAVAAZ MedStream API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
