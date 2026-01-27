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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  const mockPlaces = [
    {
      _id: '1',
      name: "Erwin Park",
      type: "Park",
      address: "1601 W University Dr, McKinney, TX",
      description: "230-acre park with trails, fishing, picnic areas, and playgrounds.",
      hours: "5:00 AM - 11:00 PM",
      website: "https://www.mckinneytexas.org/erwinpark",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/33/99/77/erwin-park-hike-bike.jpg?w=1200&h=-1&s=1"
    },
    {
      _id: '2',
      name: "Roy & Helen McKinney Public Library",
      type: "Library",
      address: "101 E Hunt St, McKinney, TX 75069",
      description: "Modern library offering books, computers, study rooms, and community programs.",
      hours: "Mon-Thu: 9AM-8PM, Fri-Sat: 9AM-6PM, Sun: 1PM-5PM",
      website: "https://www.mckinneytexas.org/library",
      image: "https://www.rlginc.com/wp-content/uploads/2019/10/McKinney-Public-Library-1.jpg"
    },
    {
      _id: '3',
      name: "Heard Natural Science Museum",
      type: "Museum",
      address: "1 Nature Pl, McKinney, TX",
      description: "Natural history museum with wildlife dioramas, butterfly house, and nature trails.",
      hours: "Tue-Sat: 9AM-5PM, Sun: 1PM-5PM",
      website: "https://heardmuseum.org",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/8e/5a/8e/heard-natural-science.jpg?w=1200&h=-1&s=1"
    },
    {
      _id: '4',
      name: "McKinney Community Center",
      type: "Community Center",
      address: "1201 E Louisiana St, McKinney, TX",
      description: "Community center offering classes, events, and meeting spaces for residents.",
      hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-5PM",
      website: "https://www.mckinneytexas.org/communitycenter",
      image: "https://www.mckinneytexas.org/ImageRepository/Document?documentID=27812"
    },
    {
  _id: '5',
  name: "Collin County History Museum",
  type: "Museum",
  address: "300 E Virginia St, McKinney, TX 75069",
  description: "Museum in a historic 1911 post office highlighting Collin County history with rotating exhibits and archival materials.",
  hours: "Thu–Sat: 10AM–4PM (check seasonal schedule)",
  website: "https://www.visitmckinney.com/things-to-do/museums-and-history/collin-county-history-museum/",
  image: "https://texas-time-travel.imgix.net/images/A-Regional-Photos/Lakes/Lakes-McKinney-Collin-County-Historical-Museum.jpg?auto=compress%2Cformat&fit=max&h=1080&q=80&w=1920&s=e83caa09820f62aa393cd8bd49176515"
},
{
  _id: '6',
  name: "Chestnut Square Historic Village",
  type: "Historic Site",
  address: "315 S Chestnut St, McKinney, TX 75069",
  description: "Living history village with preserved 19th-century homes, schoolhouse, chapel, and general store that showcase pioneer life.",
  hours: "Varies by season and events",
  website: "https://www.visitmckinney.com/things-to-do/museums-and-history/chestnut-square-historic-village/",
  image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/17/94/39/1916-dulaney-house.jpg?w=1200&h=-1&s=1"
},
{
  _id: '7',
  name: "Gabe Nesbitt Community Park",
  type: "Park",
  address: "7001 Eldorado Pkwy, McKinney, TX",
  description: "Large park featuring sports fields, playgrounds, picnic areas, walking paths and community events.",
  hours: "5:00 AM – 11:00 PM",
  website: "https://www.mckinneytexas.org/parks",
  image: "https://parks.mckinneytexas.org/wp-content/uploads/2025/05/gabenesbittcommunitypark-54-1600.jpg"
},
{
  _id: '8',
  name: "John & Judy Gay Library",
  type: "Library",
  address: "6861 W Eldorado Pkwy, McKinney, TX 75070",
  description: "Full-service public library with books, programs, and community events in the heart of McKinney’s west side.",
  hours: "Varies (check site)",
  website: "https://www.mckinneytexas.org/library",
  image: "https://dmn-dallas-news-prod.cdn.arcpublishing.com/resizer/v2/C26JTRVH6QRRSSHN4D74G7RYWU.jpg?auth=5d67483838ca6828130fde64c441ae93198ad9f1c0e14cc577c223bf7e19371b&quality=80&height=553&width=830&smart=true"
},
{
  _id: '9',
  name: "McKinney Performing Arts Center",
  type: "Community Center",
  address: "111 N Tennessee St, McKinney, TX 75069",
  description: "Historic performing arts venue hosted in the old Collin County Courthouse offering theater, concerts, and community arts programs.",
  hours: "Varies by performance schedule",
  website: "https://www.mckinneyperformingarts.org",
  image: "https://assets.simpleviewinc.com/simpleview/image/upload/crm/mckinneytx/McKinney-Performing-Arts-Center_0505F329-5056-A36F-23FB2271C9142226-0505ea7e5056a36_0505f3c6-5056-a36f-23bbd05a75ed758f.jpg"
},
{
  _id: '13',
  name: "Community Food Pantry of McKinney",
  type: "Health",
  address: "307 Smith St, McKinney, TX 75069",
  description: "Nonprofit food pantry providing access to nutritious groceries and household essentials for families in need. Open to anyone in the McKinney area seeking support and food security services.", 
  hours: "Mon–Wed: 11AM–3:30PM, Thu: 11AM–6:30PM, Fri: 10AM–12:30PM",
  website: "https://www.mckinneyfoodpantry.org",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeR0ah_GPGF3KMJ8f-Nl26FpOpjiVvLoGFVQ&s"
},
{
  _id: '14',
  name: "HUGS Café",
  type: "Food",
  address: "224 E Virginia St, McKinney, TX 75069",
  description: "A local nonprofit café serving fresh, healthy soups, salads, and sandwiches while providing job training for adults with special needs. A community-centered restaurant with flavorful, wholesome menu options.",
  hours: "Tue–Sat: 11AM–3PM (check locally for weekend specials)",
  website: "https://www.hugscafe.org",
  image: "https://texashighways.com/wp-content/uploads/2021/12/plates-hugs-cafe-exterior.jpg"
},
{
  _id: '15',
  name: "Collin County Community Health Services",
  type: "Health",
  address: "825 N McDonald St, McKinney, TX 75071",
  description: "Public health clinic offering immunizations, wellness checkups, health education, and preventive services for residents of all ages.",
  hours: "Mon–Fri: 8AM–5PM (closed for lunch 12PM–1PM)",
  website: "https://www.collincountytx.gov/healthcare_services/",
  image: "https://www.texashealth.org/newsroom/-/media/Project/THR/shared/News-Release-Images/TX-Community-Hope-Glass-Door-Office.jpg"
},
{
  _id: '16',
  name: "Harvest Seasonal Kitchen",
  type: "Food",
  address: "215 N Kentucky St, McKinney, TX 75069",
  description: "Seasonally driven restaurant celebrating fresh, locally sourced ingredients with a menu that changes throughout the year. Great for community dining and farm-to-table experiences.",
  hours: "Tue–Sat: 11AM–9PM, Sun: 11AM–3PM (verify hours)",
  website: "https://www.harvesttx.com/",
  image: "https://lh3.googleusercontent.com/p/AF1QipNryLXW0BkEE3pPDcqWpd3G044plluF-g2oGKtp=w289-h312-n-k-no"
},
{
  _id: '17',
  name: "Collin College – Central Park Campus",
  type: "Education",
  address: "2200 W University Dr, McKinney, TX 75071",
  description: "Public community college campus offering associate degrees, workforce training, continuing education, and community programs.",
  hours: "Mon–Fri: 7AM–10PM, Sat: 8AM–5PM (varies by building)",
  website: "https://www.collin.edu/locations/mckinney.html",
  image: "https://images.squarespace-cdn.com/content/v1/5820b938d482e9a9a7034dea/1600444464357-MWHKQB80E8MRGPDVGYOB/project-137-8647.jpg?format=1000w"
},
{
  _id: '18',
  name: "McKinney ISD Administration Building",
  type: "Education",
  address: "1400 Wilson Creek Pkwy, McKinney, TX 75069",
  description: "Administrative headquarters for McKinney Independent School District, supporting local public schools, educational programs, and family services.",
  hours: "Mon–Fri: 8AM–5PM",
  website: "https://www.mckinneyisd.net",
  image: "https://cloudfront-us-east-1.images.arcpublishing.com/dmn/SVUX7OXPDRF6TFKBQ3ZPLLE5ME.jpg"
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
    return;
  }

  const filtered = mockPlaces.filter(
    place => place.type === category
  );

  setPlaces(filtered);
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
    <div className="min-h-screen bg-[#F4FFED] text-slate-800">

      
      <section className="relative pt-36 pb-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://t4.ftcdn.net/jpg/00/57/19/89/360_F_57198999_lk8KrcJ0aiJpN2oS0aGsXABoJR3u9nzk.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="absolute inset-0 bg-[#f7f8f5]/85" />


        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <FadeIn>
            <h1 className="font-libre text-4xl md:text-5xl text-slate-900 mb-6">
              Explore Community Places
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Parks, libraries, museums, cafés, and shared spaces that shape daily life in McKinney.
            </p>

            <div className="mt-10">
              <button
                onClick={() => setShowForm(true)}
                className="px-10 py-4 bg-[#5f7c65] text-white rounded-full hover:bg-[#4f6a55] transition shadow"
              >
                Suggest a New Place
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

     
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">

          {loading ? (
            <div className="text-center text-slate-500 py-20 animate-pulse">
              Loading places…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
              {places.map(place => (
                <FadeIn key={place._id}>
                  <div
                    onClick={() => setSelectedPlace(place)}
                    className="group cursor-pointer rounded-3xl overflow-hidden bg-[#EBFFDE] border border-[#d3dbd0] shadow-sm hover:shadow-xl transition-all"
                  >
                   
                    <div className="relative h-56 overflow-hidden">
                      {place.image && (
                        <>
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-black/10" />
                        </>
                      )}
                    </div>

                   
                    <div className="p-7">
                      <span className="inline-block mb-3 text-xs tracking-wide uppercase bg-[#5f7c65]/10 text-[#5f7c65] px-3 py-1 rounded-full">
                        {place.type}
                      </span>

                      <h3 className="font-libre text-xl text-slate-900 mb-2">
                        {place.name}
                      </h3>

                      <p className="text-slate-600 text-sm mb-4">
                        {place.address}
                      </p>

                      <p className="text-slate-600 leading-relaxed line-clamp-3">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      
      {selectedPlace && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-[#f7f8f5] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">

            {selectedPlace.image && (
              <div className="h-72">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-libre text-2xl text-slate-900">
                    {selectedPlace.name}
                  </h2>
                  <span className="inline-block mt-2 bg-[#5f7c65]/10 text-[#5f7c65] text-xs px-3 py-1 rounded-full">
                    {selectedPlace.type}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-slate-500 hover:text-slate-800 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-slate-700 mb-6">
                {selectedPlace.description}
              </p>

              <div className="space-y-2 text-sm text-slate-700">
                <p><strong>📍 Address:</strong> {selectedPlace.address}</p>
                {selectedPlace.hours && (
                  <p><strong>⏰ Hours:</strong> {selectedPlace.hours}</p>
                )}
              </div>

              {selectedPlace.website && (
                <div className="mt-8">
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-[#5f7c65] text-white rounded-full hover:bg-[#4f6a55] transition"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <PlaceForm
          onSubmit={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
          error={error}
        />
      )}
    </div>
  );
};

export default PlacesPage;


