import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import FadeIn from '../components/FadeIn';
import NewsModal from '../components/NewsModal';
import NewsForm from '../components/NewsForm';

const NewsPage = () => {
  const { user } = useUser();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const categories = ['all', 'Community', 'Resources', 'Education', 'Events', 'Announcements', 'Other'];

  const loadNews = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`${BACKEND_URL}/api/news?${params.toString()}`);
      
      if (response.ok) {
        const newsData = await response.json();
        if (Array.isArray(newsData)) {
          setNews(newsData);
        } else {
          setNews([]);
        }
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error('Error loading news:', error);
      setError('Failed to load news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [searchTerm, selectedCategory]);

  const handleCreateNews = async (newsData) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          ...newsData
        })
      });
      
      if (response.ok) {
        const newNews = await response.json();
        setNews(prev => [newNews, ...prev]);
        setShowForm(false);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create news article');
      }
    } catch (error) {
      console.error('Error creating news:', error);
      setError('Failed to create news article');
    }
  };

  const openNewsDetails = async (newsId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/news/${newsId}`);
      if (response.ok) {
        const newsData = await response.json();
        setSelectedArticle(newsData);
      }
    } catch (error) {
      console.error('Error loading news details:', error);
    }
  };

  const closeNewsDetails = () => {
    setSelectedArticle(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setError('');
  };

  const featuredArticle = news.find(article => article.featured);
  const regularArticles = news.filter(article => !article.featured);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Community News</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed about the latest updates, events, and initiatives in our community.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button 
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
            >
              Submit News
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-500">Loading news...</div>
        </div>
      ) : (
        <>
          {featuredArticle && (
            <FadeIn className="mb-16">
              <div 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openNewsDetails(featuredArticle._id)}
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    {featuredArticle.image ? (
                      <img 
                        src={featuredArticle.image} 
                        alt={featuredArticle.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                      {featuredArticle.category}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{featuredArticle.title}</h2>
                    <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {regularArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No news articles found</div>
              <p className="text-gray-600">Try adjusting your search or check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map(article => (
                <FadeIn key={article._id} delay={0}>
                  <div 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                    onClick={() => openNewsDetails(article._id)}
                  >
                    <div className="h-48 overflow-hidden">
                      {article.image ? (
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm">{article.excerpt}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </>
      )}

      {selectedArticle && (
        <NewsModal 
          article={selectedArticle} 
          onClose={closeNewsDetails} 
        />
      )}

      {showForm && (
        <NewsForm 
          onSubmit={handleCreateNews}
          onCancel={closeForm}
          error={error}
        />
      )}
    </div>
  );
};

export default NewsPage;