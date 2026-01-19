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

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.keys(sources).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sources
        </h2>
        <div className="space-y-4">
          {sources[activeTab].map((source, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">{source.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{source.description}</p>
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
              >
                Visit Source →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>This project was created for Texas TSA (Technology Student Association).</p>
        <p className="mt-2">All information is sourced from official and public resources.</p>
      </div>
    </div>
  );
};

export default SourcesPage;