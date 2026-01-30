const SourcesPage = () => {
  const sources = {
    weather: [
      {
        name: 'OpenWeatherMap API',
        url: 'https://openweathermap.org/api',
        description: 'Current weather data for McKinney, TX'
      }
    ],
    places: [
      {
        name: 'City of McKinney Official Website',
        url: 'https://www.mckinneytexas.org',
        description: 'Official information about parks, libraries, and community centers'
      },
      {
        name: 'Heard Natural Science Museum',
        url: 'https://heardmuseum.org',
        description: 'Museum information and visitor details'
      }
    ],
    events: [
      {
        name: 'McKinney Community Calendar',
        url: 'https://www.mckinneytexas.org/calendar',
        description: 'Local community events and activities'
      }
    ],
    funFacts: [
      {
        name: 'McKinney Texas History',
        url: 'https://www.mckinneytexas.org/history',
        description: 'Historical information about McKinney'
      },
      {
        name: 'U.S. Census Bureau',
        url: 'https://www.census.gov',
        description: 'Population and growth statistics'
      }
    ],
    resources: [
      {
        name: 'Tailwind CSS',
        url: 'https://tailwindcss.com/',
        description: 'A utility-first CSS framework for rapid UI development.'
      },
      {
        name: 'City of McKinney Website',
        url: 'https://www.mckinneytexas.org',
        description: 'Official city website for McKinney, Texas.'
      },
      {
        name: 'React',
        url: 'https://react.dev/',
        description: 'A JavaScript library for building user interfaces.'
      },
      {
        name: 'Node.js',
        url: 'https://nodejs.org/',
        description: 'JavaScript runtime for backend development.'
      },
      {
        name: 'MongoDB Atlas',
        url: 'https://www.mongodb.com/atlas',
        description: 'Cloud database service for MongoDB.'
      },
      {
        name: 'TSA (Technology Student Association)',
        url: 'https://tsaweb.org/',
        description: 'National organization for students engaged in STEM.'
      },
      {
        name: 'WeatherAPI',
        url: 'https://www.weatherapi.com/',
        description: 'Weather data API used for weather features.'
      },
      {
        name: 'NewsAPI',
        url: 'https://newsapi.org/',
        description: 'API for news headlines and articles.'
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">References & Sources</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Information and data sources used throughout the Community Resource Hub.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8">
        {Object.entries(sources).map(([category, items]) => (
          <div key={category} className="mb-10">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 tracking-tight">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {items.map((source, index) => (
                <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-lg mb-1">{source.name}</h3>
                    <p className="text-gray-700 text-sm mb-2">{source.description}</p>
                  </div>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mt-2"
                  >
                    Visit Source →
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SourcesPage;