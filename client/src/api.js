import config from './config';

export const fetchEvents = async () => {
  try {
    const response = await fetch(`${config.baseURL}/events`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEvent = async (id) => {
  try {
    const response = await fetch(`${config.baseURL}/events/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const submitEvent = async (formData) => {
  const method = formData.id ? 'PUT' : 'POST';
  const url = formData.id
    ? `${config.baseURL}/events/${formData.id}`
    : `${config.baseURL}/events`;

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error submitting event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${config.baseURL}/events/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const fetchTop5Events = async () => {
  try {
    const response = await fetch(`${config.baseURL}/events/top5`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching top 5 events:', error);
    throw error;
  }
};

export const fetchEventRegistrationStats = async () => {
  try {
    const response = await fetch(`${config.baseURL}/events/registration-stats`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    throw error;
  }
};

export const fetchRegistrationCountByVenue = async () => {
  try {
    const response = await fetch(`${config.baseURL}/events/registrations-by-venue`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching registration count by venue:', error);
    throw error;
  }
};

