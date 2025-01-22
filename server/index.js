const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Create Event (unchanged)
app.post('/api/events', (req, res) => {
  const { title, description, date, time, location } = req.body;
  const sql = 'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, date, time, location], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
});

// Enhanced Get All Events with filtering and sorting
app.get('/api/events', (req, res) => {
  const {
    searchQuery,
    startDate,
    endDate,
    location,
    status,
    sortBy = 'date',
    sortOrder = 'asc'
  } = req.query;

  let sql = 'SELECT * FROM events WHERE 1=1';
  const params = [];

  // Add search filter
  if (searchQuery) {
    sql += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${searchQuery}%`, `%${searchQuery}%`);
  }

  // Add date filter
  if (startDate && endDate) {
    sql += ' AND date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  // Add location filter
  if (location) {
    sql += ' AND location = ?';
    params.push(location);
  }

  // Add status filter
  if (status) {
    if (status === 'upcoming') {
      sql += ' AND date >= CURDATE()';
    } else if (status === 'past') {
      sql += ' AND date < CURDATE()';
    }
  }

  // Add sorting
  const validSortColumns = ['date', 'title', 'location'];
  const validSortOrders = ['asc', 'desc'];
  
  const finalSortBy = validSortColumns.includes(sortBy) ? sortBy : 'date';
  const finalSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? 
    sortOrder.toLowerCase() : 'asc';

  sql += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

  // Add secondary sort by time for date sorting
  if (finalSortBy === 'date') {
    sql += `, time ${finalSortOrder}`;
  }

  // Execute the query
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get Unique Locations for filter dropdown
app.get('/api/locations', (req, res) => {
  const sql = 'SELECT DISTINCT location FROM events ORDER BY location';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results.map(result => result.location));
  });
});

// Get Event Statistics
app.get('/api/events/stats', (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as totalEvents,
      COUNT(CASE WHEN date >= CURDATE() THEN 1 END) as upcomingEvents,
      COUNT(CASE WHEN date < CURDATE() THEN 1 END) as pastEvents,
      COUNT(DISTINCT location) as uniqueLocations
    FROM events
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Get Single Event (unchanged)
app.get('/api/events/:id', (req, res) => {
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
});

// Update Event (unchanged)
app.put('/api/events/:id', (req, res) => {
  const { title, description, date, time, location } = req.body;
  const sql = 'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ? WHERE id = ?';
  db.query(sql, [title, description, date, time, location, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Event updated successfully' });
  });
});

// Delete Event (unchanged)
app.delete('/api/events/:id', (req, res) => {
  const sql = 'DELETE FROM events WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

// Handle RSVP form submissions (unchanged)
app.post('/api/rsvps', (req, res) => {
  const { event_id, name, email } = req.body;
  const sql = 'INSERT INTO rsvps (event_id, name, email) VALUES (?, ?, ?)';
  db.query(sql, [event_id, name, email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
    } else {
      res.status(200).send('RSVP submitted');
    }
  });
});

// Get RSVPs for a specific event
app.get('/api/events/:eventId/rsvps', (req, res) => {
  const sql = `
    SELECT id, name, email, created_at 
    FROM rsvps 
    WHERE event_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.query(sql, [req.params.eventId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Get RSVP count for an event
app.get('/api/events/:eventId/rsvp-count', (req, res) => {
  const sql = 'SELECT COUNT(*) as count FROM rsvps WHERE event_id = ?';
  
  db.query(sql, [req.params.eventId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ count: results[0].count });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});