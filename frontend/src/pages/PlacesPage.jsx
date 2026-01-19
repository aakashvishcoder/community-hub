import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FadeIn from '../components/FadeIn';
import PlaceForm from '../components/PlaceForm';

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null); 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const mockPlaces = [
    {
      _id: '1',
      name: "Erwin Park",
      type: "Park",
      address: "1601 W University Dr, McKinney, TX",
      description: "230-acre park with trails, fishing, picnic areas, and playgrounds.",
      hours: "5:00 AM - 11:00 PM",
      website: "https://www.mckinneytexas.org/erwinpark",
      image: ""
    },
    {
      _id: '2',
      name: "McKinney Public Library",
      type: "Library",
      address: "215 N Tennessee St, McKinney, TX",
      description: "Modern library offering books, computers, study rooms, and community programs.",
      hours: "Mon-Thu: 9AM-8PM, Fri-Sat: 9AM-6PM, Sun: 1PM-5PM",
      website: "https://www.mckinneytexas.org/library",
      image: ""
    },
    {
      _id: '3',
      name: "Heard Natural Science Museum",
      type: "Museum",
      address: "1 Nature Pl, McKinney, TX",
      description: "Natural history museum with wildlife dioramas, butterfly house, and nature trails.",
      hours: "Tue-Sat: 9AM-5PM, Sun: 1PM-5PM",
      website: "https://heardmuseum.org",
      image: ""
    },
    {
      _id: '4',
      name: "McKinney Community Center",
      type: "Community Center",
      address: "101 E Hunt St, McKinney, TX",
      description: "Community center offering classes, events, and meeting spaces for residents.",
      hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM",
      website: "https://www.mckinneytexas.org/communitycenter",
      image: ""
    }
  ];

  const getActiveCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get('category') || 'all';
  };

  const loadPlaces = async () => {
    try {
      const category = getActiveCategory();
      const params = category !== 'all' ? `?category=${category}` : '';
      
      const response = await fetch(`${BACKEND_URL}/api/places${params}`);
      
      if (response.ok) {
        const placesData = await response.json();
        if (Array.isArray(placesData) && placesData.length > 0) {
          setPlaces(placesData);
        } else {
          filterMockPlaces(category);
        }
      } else {
        filterMockPlaces(category);
      }
    } catch (error) {
      console.error('Error loading places:', error);
      setError('Failed to load places');
      filterMockPlaces(getActiveCategory());
    } finally {
      setLoading(false);
    }
  };

  const filterMockPlaces = (category) => {
    if (category === 'all') {
      setPlaces(mockPlaces);
    } else {
      const categoryMap = {
        'Education': 'Library',
        'Health': 'Community Center', 
        'Food': 'Restaurant',
        'Park': 'Park',
        'Library': 'Library',
        'Museum': 'Museum',
        'Community Center': 'Community Center'
      };
      
      const mockType = categoryMap[category] || category;
      const filtered = mockPlaces.filter(place => place.type === mockType);
      setPlaces(filtered);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [location.search]);

  const handleCreatePlace = async (placeData) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(placeData)
      });
      
      if (response.ok) {
        const newPlace = await response.json();
        setPlaces(prev => [newPlace, ...prev]);
        setShowForm(false);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create place');
      }
    } catch (error) {
      console.error('Error creating place:', error);
      setError('Failed to create place');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setError('');
  };

  const openPlaceDetails = (place) => {
    setSelectedPlace(place);
  };

  const closePlaceDetails = () => {
    setSelectedPlace(null);
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      'Education': 'Education',
      'Health': 'Health',
      'Food': 'Food',
      'Park': 'Parks',
      'Library': 'Libraries',
      'Museum': 'Museums',
      'Community Center': 'Community Centers',
      'all': 'All Places'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Places in Our Community</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore parks, libraries, museums, and other essential community spaces.
        </p>
        <div className="mt-4">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Viewing: {getCategoryName(getActiveCategory())}
          </span>
        </div>
      </div>

      <div className="mb-8 text-center">
        <button 
          onClick={() => setShowForm(true)}
          className="bg-accent-500 hover:bg-accent-600 text-black font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Suggest a New Place
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-500">Loading places...</div>
        </div>
      ) : places.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">No places found</div>
          <p className="text-gray-600">Try selecting a different category or suggest a new place!</p>
          <div className="mt-6">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-accent-500 hover:bg-accent-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Suggest Your First Place
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {places.map(place => (
            <FadeIn key={place._id} delay={0}>
              <div 
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow cursor-pointer"
                onClick={() => openPlaceDetails(place)}
              >
                <div className="h-48 overflow-hidden">
                  {place.image ? (
                    <img 
                      src={place.image} 
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-lg">📍 {place.name}</span>
                    </div>
                  )}
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
                  
                  {place.hours && (
                    <div className="flex items-start text-gray-600 text-sm mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{place.hours}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{place.description}</p>
                  
                  {place.website && (
                    <a 
                      href={place.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
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
      )}

      {selectedPlace && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePlaceDetails}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPlace.name}</h2>
                <button 
                  onClick={closePlaceDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {selectedPlace.image ? (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={selectedPlace.image} 
                    alt={selectedPlace.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center mb-4">
                  <span className="text-gray-500 text-xl">📍 {selectedPlace.name}</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedPlace.type}
                </span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{selectedPlace.address}</span>
                </div>
                
                {selectedPlace.hours && (
                  <div className="flex items-start text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedPlace.hours}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{selectedPlace.description}</p>
              </div>
              
              {selectedPlace.website && (
                <div className="mb-6">
                  <a 
                    href={selectedPlace.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Visit Website
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={closePlaceDetails}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <PlaceForm 
          onSubmit={handleCreatePlace}
          onCancel={closeForm}
          error={error}
        />
      )}
    </div>
  );
};

export default PlacesPage;