import React, { useState } from 'react';

const RSVPForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const eventId = Number(window.location.pathname.split('/').pop());
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/rsvps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event_id: eventId, name, email }),
        });
        if (response.ok) {
            alert('RSVP submitted successfully!');
            setName('');
            setEmail('');
        } else {
            alert('Failed to submit RSVP.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">RSVP for Event</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Submit
            </button>
        </form>
    );
};

export default RSVPForm;
