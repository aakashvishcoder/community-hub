import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import FadeIn from '../components/FadeIn';
import FunFactForm from '../components/FunFactForm';

const FunFactsPage = () => {
  const { user } = useUser();
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const exampleFacts = [
    {
      _id: '1',
      title: "Historic Downtown Square",
      content: "McKinney's historic downtown square is one of the most well-preserved in Texas, featuring original brick streets and buildings dating back to the 1800s.",
      category: "History"
    },
    {
      _id: '2',
      title: "Erwin Park",
      content: "At over 230 acres, Erwin Park is McKinney's largest park and features fishing lakes, hiking trails, picnic areas, and a disc golf course.",
      category: "Parks"
    },
    {
      _id: '3',
      title: "Fastest Growing City",
      content: "McKinney was named the fastest-growing city in the United States by the U.S. Census Bureau multiple times in the 2010s.",
      category: "Growth"
    },
    {
      _id: '4',
      title: "Heard Natural Science Museum",
      content: "The Heard Natural Science Museum & Wildlife Sanctuary is one of the oldest private museums in Texas, established in 1967.",
      category: "Culture"
    },
    {
      _id: '5',
      title: "Farmers Market",
      content: "McKinney hosts one of North Texas's largest farmers markets, operating every Saturday year-round at the historic downtown square.",
      category: "Community"
    },
    {
      _id: '6',
      title: "Collin County Courthouse",
      content: "The Collin County Courthouse on the downtown square is considered one of the most beautiful courthouses in Texas and is listed on the National Register of Historic Places.",
      category: "History"
    },
    {
      _id: '7',
      title: "Water Tower",
      content: "McKinney's iconic water tower stands 150 feet tall and has become a symbol of the city, often lit up for special occasions and holidays.",
      category: "Landmarks"
    },
    {
      _id: '8',
      title: "Community Garden",
      content: "McKinney operates a community garden program that provides residents with plots to grow their own fresh produce while promoting sustainable practices.",
      category: "Sustainability"
    }
  ];

  const loadFacts = async () => {
    try {
      const response = await fetch('/api/funfacts');
      if (response.ok) {
        const factsData = await response.json();
        if (Array.isArray(factsData) && factsData.length > 0) {
          setFacts(factsData);
          setCurrentFactIndex(0);
        } else {
          setFacts(exampleFacts);
        }
      } else {
        setFacts(exampleFacts);
      }
    } catch (error) {
      console.error('Error loading facts:', error);
      setFacts(exampleFacts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacts();
  }, []);

  const handleCreateFact = async (factData) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/funfacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          ...factData
        })
      });
      
      if (response.ok) {
        const newFact = await response.json();
        setFacts(prev => [newFact, ...prev]);
        setShowForm(false);
        setError('');
        setCurrentFactIndex(0);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create fact');
      }
    } catch (error) {
      console.error('Error creating fact:', error);
      setError('Failed to create fact');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setError('');
  };

  const nextFact = () => {
    if (facts.length > 0) {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }
  };

  const prevFact = () => {
    if (facts.length > 0) {
      setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Fun Facts About McKinney</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover interesting facts about our vibrant community, from historic landmarks to modern achievements.
        </p>
      </div>

      {user && (
        <div className="flex justify-center mb-8">
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
          >
            Share Your Own Fact
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-500">Loading facts...</div>
        </div>
      ) : (
        <>
          <FadeIn>
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {facts[currentFactIndex].category}
                </span>
                <div className="text-sm text-gray-500">
                  {currentFactIndex + 1} of {facts.length}
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">{facts[currentFactIndex].title}</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{facts[currentFactIndex].content}</p>
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevFact}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <button
                  onClick={nextFact}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facts.map((fact, index) => (
              <FadeIn key={fact._id} delay={index * 0.1}>
                <div 
                  className={`bg-white rounded-xl p-5 border cursor-pointer transition-all ${
                    index === currentFactIndex 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentFactIndex(index)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{fact.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {fact.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{fact.content}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <FunFactForm 
          onSubmit={handleCreateFact}
          onCancel={closeForm}
          error={error}
        />
      )}
    </div>
  );
};

export default FunFactsPage;