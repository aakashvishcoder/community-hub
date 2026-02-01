import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import FadeIn from '../components/FadeIn';
import EventModal from '../components/EventModal';
import EventForm from '../components/EventForm';

const officialEvents = [
  {
    _id: 'official-1',
    title: "McKinney Farmers Market",
    category: "Market",
    date: "2026-04-13",
    time: "8:00 AM – 12:00 PM",
    location: "Chestnut Square Historic Village",
    description:
      "Shop fresh produce, baked goods, and artisan products from local North Texas farmers and makers.",
    image:
      "https://img.ctykit.com/cdn/tx-houston/images/tr:w-1800/dsc03257-1.jpg",
    official: true
  },
  {
    _id: 'official-2',
    title: "Arts in Bloom Festival",
    category: "Festival",
    date: "2026-04-26",
    time: "10:00 AM – 6:00 PM",
    location: "Historic Downtown McKinney",
    description:
      "A signature McKinney event celebrating art, music, food, and local culture in the downtown square.",
    image:
      "https://www.eventbrite.com/e/_next/image?url=https%3A%2F%2Fimg.evbuc.com%2Fhttps%253A%252F%252Fcdn.evbuc.com%252Fimages%252F713418079%252F98296233601%252F1%252Foriginal.20240306-223727%3Fw%3D600%26auto%3Dformat%252Ccompress%26q%3D75%26sharp%3D10%26rect%3D0%252C14%252C1200%252C600%26s%3D2aa59bae321790851672ce422a9f2cc2&w=940&q=75",
    official: true
  },
  {
    _id: 'official-3',
    title: "Music in the Park",
    category: "Concert",
    date: "2026-05-10",
    time: "7:00 PM – 9:00 PM",
    location: "Towne Lake Park",
    description:
      "Bring a blanket and enjoy live music under the stars as part of McKinney’s outdoor concert series.",
    image:
      "https://da7jxvkvc73ty.cloudfront.net/wp-content/uploads/sites/283/2024/05/McKinney_Hub_121_Live-music-scaled.jpg",
    official: true
  }
];

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

      const res = await fetch(`${BACKEND_URL}/api/events?${params.toString()}`);
      let userEvents = [];

      if (res.ok) {
        userEvents = await res.json();
      }

      const filteredOfficial = officialEvents.filter(e =>
        (selectedCategory === 'all' || e.category === selectedCategory) &&
        (!searchTerm || e.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setEvents([...filteredOfficial, ...userEvents]);
    } catch {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, [searchTerm, selectedCategory]);

  const handleCreateEvent = async (eventData) => {
    setError("");
    try {
      if (!user || !user._id) {
        setError("You must be signed in to add an event.");
        return;
      }
      const eventWithUser = { ...eventData, userId: user._id };
      const res = await fetch(`${BACKEND_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventWithUser)
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents(prev => [...prev, newEvent]);
        setShowForm(false);
      } else {
        const err = await res.json();
        setError(err.message || "Failed to add event");
      }
    } catch (e) {
      setError("Failed to add event");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f6f1]">
      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            McKinney Community Events 
          </h1>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Explore official city events and community-submitted gatherings happening around McKinney.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-md p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Search events…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
            >
              Submit an Event
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-emerald-700 animate-pulse">
            Loading events…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {events.map(event => (
              <FadeIn key={event._id}>
                <div
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
                >
                  <div className="h-44 relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    {event.official && (
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full">
                        Official City Event
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-slate-900">
                        {event.title}
                      </h3>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-2">
                      📅 {new Date(event.date).toLocaleDateString()} · ⏰ {event.time}
                    </p>

                    <p className="text-sm text-slate-600 mb-3">
                      📍 {event.location}
                    </p>

                    <p className="text-sm text-slate-700 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        {showForm && <EventForm onSubmit={handleCreateEvent} onCancel={() => setShowForm(false)} error={error} />}
      </div>
    </div>
  );
};

export default EventsPage;
