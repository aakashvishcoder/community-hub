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
  image: "data:image/png;base64,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"
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
},
{
    id: '19',
    name: "Samaritan Inn",
    type: "Community Center",
    address: "1514 N McDonald St, McKinney, TX 75071",
    description: "The Samaritan Inn is a homeless shelter that helps the less fortunate get back on their feet! You can volunteer in their kitchens, computer support program, or pantry retocking!",
    website: "https://saminn.org/volunteer/",
    image: "data:image/jpeg;base64,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"
},
{
 id: 20,
    name: "Heard Craig Center",
    type: "Community Center",
    address: "205 W Hunt St, McKinney, TX 75069",
    description: "Help clean up the Verandah and Ground for the Heard Craig Center for the Arts! The Heard Craig Center for the Arts promotes fine arts through programs and interactive workshops!",
    website: "https://www.heardcraig.org/volunteer-benefits",
    image: "https://media.eventective.com/3932731_lg.jpg  "
},
{
   id: 21,
    name: "Big Taco and Seafood",
    type: "Food",
    address: "1620 N Hardin Blvd, McKinney, TX 75071",
    description: "This places has a lively aroma and great tacos.",
    website: "https://bigtacoandseafoodtx.com/",
    image: "https://www.motherthyme.com/wp-content/uploads/2019/08/BIG-MAC-TACOS-7.jpg"
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
          onSubmit={handleCreatePlace}
          onCancel={closeForm}
          error={error}
        />
      )}
    </div>
  );
};

export default PlacesPage;


