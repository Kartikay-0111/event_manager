const db = require('../models/db');

exports.createRsvp = (req, res) => {
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
};

exports.getRsvpsByEventId = (req, res) => {
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
};

exports.getRsvpCountByEventId = (req, res) => {
  const sql = 'SELECT COUNT(*) as count FROM rsvps WHERE event_id = ?';
  
  db.query(sql, [req.params.eventId], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ count: results[0].count });
  });
};
