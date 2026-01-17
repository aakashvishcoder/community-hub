import FadeIn from '../components/FadeIn'

const mockPlaces = [
  {
    id: 1,
    name: "Erwin Park",
    type: "Park",
    address: "1601 W University Dr, McKinney, TX",
    description: "230-acre park with trails, fishing, picnic areas, and playgrounds.",
    hours: "5:00 AM - 11:00 PM",
    website: "https://www.mckinneytexas.org/erwinpark",
    image: "/src/assets/place1.jpg"
  },
  {
    id: 2,
    name: "McKinney Public Library",
    type: "Library",
    address: "215 N Tennessee St, McKinney, TX",
    description: "Modern library offering books, computers, study rooms, and community programs.",
    hours: "Mon-Thu: 9AM-8PM, Fri-Sat: 9AM-6PM, Sun: 1PM-5PM",
    website: "https://www.mckinneytexas.org/library",
    image: "/src/assets/place2.jpg"
  },
  {
    id: 3,
    name: "Heard Natural Science Museum",
    type: "Museum",
    address: "1 Nature Pl, McKinney, TX",
    description: "Natural history museum with wildlife dioramas, butterfly house, and nature trails.",
    hours: "Tue-Sat: 9AM-5PM, Sun: 1PM-5PM",
    website: "https://heardmuseum.org",
    image: "/src/assets/place3.jpg"
  }
]

const PlacesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Places in Our Community</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore parks, libraries, museums, and other essential community spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockPlaces.map(place => (
          <FadeIn key={place.id} delay={0}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow">
              <div className="h-48 overflow-hidden">
                <div 
                  className="w-full h-full bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${place.image})` }}
                  onError={(e) => e.target.classList.add('bg-gray-200')}
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{place.name}</h3>
                  <span className="inline-block bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded-full">
                    {place.type}
                  </span>
                </div>
                
                <div className="flex items-start text-gray-600 text-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{place.address}</span>
                </div>
                
                <div className="flex items-start text-gray-600 text-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{place.hours}</span>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{place.description}</p>
                
                {place.website && (
                  <a 
                    href={place.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Visit Website
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      
      <div className="text-center mt-10">
        <button className="bg-accent-500 hover:bg-accent-600 text-white font-medium py-2.5 px-6 rounded-lg">
          Suggest a New Place
        </button>
      </div>
    </div>
  )
}

export default PlacesPage;