import { useState } from 'react'
import FadeIn from '../components/FadeIn';

const mockEvents = [
  {
    id: 1,
    title: "McKinney Farmers Market",
    date: "2026-01-25",
    time: "8:00 AM - 1:00 PM",
    location: "Historic Downtown Square",
    description: "Fresh local produce, artisan goods, and live music every Saturday.",
    category: "Market",
    image: "/src/assets/event1.jpg"
  },
  {
    id: 2,
    title: "Community Clean-Up Day",
    date: "2026-02-01",
    time: "9:00 AM - 12:00 PM",
    location: "Erwin Park",
    description: "Join neighbors in beautifying our parks and green spaces. Gloves and bags provided!",
    category: "Volunteer",
    image: "/src/assets/event2.jpg"
  },
  {
    id: 3,
    title: "Youth Coding Workshop",
    date: "2026-02-08",
    time: "2:00 PM - 4:00 PM",
    location: "McKinney Public Library",
    description: "Free intro to programming for teens ages 13-18. Laptops provided.",
    category: "Education",
    image: "/src/assets/event3.jpg"
  }
]

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(mockEvents.map(e => e.category))]

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory;
  })

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
            <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 rounded-lg">
              Submit an Event
            </button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No events found</div>
          <p className="text-gray-600">Try adjusting your search or check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <FadeIn key={event.id} delay={0}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow">
                <div className="h-40 overflow-hidden">
                  <div 
                    className="w-full h-full bg-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image})` }}
                    onError={(e) => e.target.classList.add('bg-gray-200')}
                  />
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
                  
                  <p className="text-gray-700 text-sm">{event.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsPage;