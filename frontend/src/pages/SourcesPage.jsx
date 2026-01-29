import { useState } from 'react';

const SourcesPage = () => {
  const [activeTab, setActiveTab] = useState('weather');

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

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Object.keys(sources).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-5 py-2 rounded-full font-semibold shadow-sm border transition-all duration-150 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
              ${activeTab === category
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'}
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6 tracking-tight">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sources
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {sources[activeTab].map((source, index) => (
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

      <div className="mt-10 text-center text-gray-500 text-sm">
        <p>This project was created for Texas TSA (Technology Student Association).</p>
        <p className="mt-2">All information is sourced from official and public resources.</p>
      </div>
    </div>
  );
};

export default SourcesPage;