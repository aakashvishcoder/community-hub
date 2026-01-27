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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
  const categories = ['all', 'Community', 'Resources', 'Education', 'Events', 'Announcements', 'Other'];

  const loadNews = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const response = await fetch(`${BACKEND_URL}/api/news?${params.toString()}`);
      if (response.ok) {
        const newsData = await response.json();
        setNews(Array.isArray(newsData) ? newsData : []);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error('Error loading news:', err);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...newsData }),
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
    } catch (err) {
      console.error('Error creating news:', err);
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
    } catch (err) {
      console.error('Error loading news details:', err);
    }
  };

  const closeNewsDetails = () => setSelectedArticle(null);
  const closeForm = () => { setShowForm(false); setError(''); };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Community News</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed about updates, events, and initiatives in our community.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-card p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          {user && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
            >
              Submit News
            </button>
          )}
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
      ) : news.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p>No news articles found. Try adjusting your search or check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, idx) => (
            <FadeIn key={article._id} delay={idx * 0.05}>
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openNewsDetails(article._id)}
              >
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-gray-900 font-bold text-lg mb-1">{article.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {selectedArticle && (
        <NewsModal article={selectedArticle} onClose={closeNewsDetails} />
      )}

      {showForm && (
        <NewsForm onSubmit={handleCreateNews} onCancel={closeForm} error={error} />
      )}
    </div>
  );
};

export default NewsPage;
