import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import FadeIn from '../components/FadeIn';
import EventModal from '../components/EventModal';
import EventForm from '../components/EventForm';

const EventsPage = () => {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState('');

  const categories = ['all', 'Market', 'Festival', 'Concert', 'Workshop', 'Community', 'Volunteer', 'Education', 'Other'];
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  const loadEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`${BACKEND_URL}/api/events?${params.toString()}`);
      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [searchTerm, selectedCategory]);

  const handleCreateEvent = async (eventData) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          ...eventData
        })
      });
      
      if (response.ok) {
        const newEvent = await response.json();
        setEvents(prev => [newEvent, ...prev]);
        setShowForm(false);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event');
    }
  };

  const openEventDetails = async (eventId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/events/${eventId}`);
      if (response.ok) {
        const eventData = await response.json();
        setSelectedEvent(eventData);
      }
    } catch (error) {
      console.error('Error loading event details:', error);
    }
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Upcoming Community Events</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover local gatherings, workshops, volunteer opportunities, and more.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-lg"
            >
              Submit an Event
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-500">Loading events...</div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No events found</div>
          <p className="text-gray-600">Try adjusting your search or check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map(event => (
            <FadeIn key={event._id} delay={0}>
              <div 
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow cursor-pointer"
                onClick={() => openEventDetails(event._id)}
              >
                <div className="h-40 overflow-hidden">
                  {event.image ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.classList.add('bg-gray-200')}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {event.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {event.time}
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  
                  <p className="text-gray-700 text-sm line-clamp-2">{event.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={closeEventDetails} 
        />
      )}

      {showForm && (
        <EventForm 
          onSubmit={handleCreateEvent}
          onCancel={closeForm}
          error={error}
        />
      )}
    </div>
  );
};

export default EventsPage;