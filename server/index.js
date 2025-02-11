const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});