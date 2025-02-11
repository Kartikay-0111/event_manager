const db = require('../models/db');

exports.createEvent = (req, res) => {
  const { title, description, date, time, location } = req.body;
  const sql = 'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, description, date, time, location], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, ...req.body });
  });
};

exports.getAllEvents = (req, res) => {
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
};

exports.getUniqueLocations = (req, res) => {
  const sql = 'SELECT DISTINCT location FROM events ORDER BY location';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results.map(result => result.location));
  });
};

exports.getEventStats = (req, res) => {
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
};

exports.getEventById = (req, res) => {
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
};

exports.updateEvent = (req, res) => {
  const { title, description, date, time, location } = req.body;
  const sql = 'UPDATE events SET title = ?, description = ?, date = ?, time = ?, location = ? WHERE id = ?';
  db.query(sql, [title, description, date, time, location, req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Event updated successfully' });
  });
};

exports.deleteEvent = (req, res) => {
  const sql = 'DELETE FROM events WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
};

exports.getTop5Events = (req, res) => {
  const sql = `
    SELECT events.id, events.title, COUNT(rsvps.id) as registrations
    FROM events
    LEFT JOIN rsvps ON events.id = rsvps.event_id
    GROUP BY events.id, events.title
    ORDER BY registrations DESC
    LIMIT 5
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};

exports.getEventRegistrationStats = (req, res) => {
  const sql = `
    SELECT 
      SUM(registrations) as totalRegistrations,
      MAX(registrations) as maxRegistrations,
      MIN(registrations) as minRegistrations
    FROM (
      SELECT COUNT(rsvps.id) as registrations
      FROM events
      LEFT JOIN rsvps ON events.id = rsvps.event_id
      GROUP BY events.id
    ) as registrationCounts
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results[0]);
  });
};

exports.getRegistrationCountByVenue = (req, res) => {
  const sql = `
    SELECT events.location, COUNT(rsvps.id) as registrations
    FROM events
    LEFT JOIN rsvps ON events.id = rsvps.event_id
    GROUP BY events.location
    ORDER BY registrations DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};
