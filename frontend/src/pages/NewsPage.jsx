import { useState, useEffect, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import FadeIn from '../components/FadeIn';
import NewsModal from '../components/NewsModal';
import NewsForm from '../components/NewsForm';

const NewsPage = () => {
  const { user } = useUser();


  const [news, setNews] = useState([]);
  const [externalNews, setExternalNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState('');


  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const categories = [
    'all',
    'Community',
    'Resources',
    'Education',
    'Events',
    'Announcements',
    'Other'
  ];

 
  const getCategoryColor = (cat) => {
    const colors = {
      Community: 'bg-green-100 text-green-700',
      Resources: 'bg-green-200 text-green-800',
      Education: 'bg-lime-100 text-lime-700',
      Events: 'bg-emerald-100 text-emerald-700',
      Announcements: 'bg-teal-100 text-teal-700',
      default: 'bg-gray-100 text-gray-700'
    };
    return colors[cat] || colors.default;
  };

 
  const mapCategory = (title, excerpt) => {
    const text = `${title} ${excerpt}`.toLowerCase();
    if (text.includes('school') || text.includes('education') || text.includes('student')) return 'Education';
    if (text.includes('event') || text.includes('festival') || text.includes('concert')) return 'Events';
    if (text.includes('resource') || text.includes('help') || text.includes('utility')) return 'Resources';
    if (text.includes('alert') || text.includes('update') || text.includes('official')) return 'Announcements';
    return 'Community'; 
  };

  const loadNews = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);

      const res = await fetch(`${BACKEND_URL}/api/news?${params.toString()}`);
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Failed to load local news');
    }
  };

  const loadExternalNews = async () => {
    if (!NEWS_API_KEY) return;
    try {
      const query = searchTerm.trim() 
        ? `("Dallas" OR "Dallas TX") AND (${searchTerm})` 
        : `("Dallas" OR "Dallas TX")`;

      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}` +
        `&language=en&sortBy=publishedAt&pageSize=30&apiKey=${NEWS_API_KEY}`
      );

      const data = await res.json();
      if (data.status !== 'ok') return;

      const formatted = data.articles.map(a => ({
        _id: a.url,
        title: a.title,
        excerpt: a.description || 'Click to read more',
        content: a.content,
        image: a.urlToImage,
        category: mapCategory(a.title, a.description || ''),
        date: a.publishedAt,
        source: a.source.name,
        url: a.url,
        external: true
      }));

    
      if (selectedCategory !== 'all') {
        setExternalNews(formatted.filter(art => art.category === selectedCategory));
      } else {
        setExternalNews(formatted);
      }
    } catch (err) {
      console.error('External news error:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      Promise.all([loadNews(), loadExternalNews()]).finally(() => setLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);


  const displayedNews = useMemo(() => {
    return [...externalNews, ...news]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [news, externalNews]);

  
  const handleCreateNews = async (newsData) => {
    if (!user) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...newsData })
      });
      if (res.ok) {
        const newArticle = await res.json();
        setNews(prev => [newArticle, ...prev]);
        setShowForm(false);
      }
    } catch {
      setError('Failed to create article');
    }
  };

  return (
    
    <div className="min-h-screen bg-green-50 py-12 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
      
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-green-900 mb-4 tracking-tight">Dallas City News</h1>
          <p className="text-lg text-green-700 max-w-2xl mx-auto">
            The latest updates and community stories from across the city.
          </p>
        </div>

      
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search news..."
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>

            {user && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md shadow-green-100"
              >
                Submit News
              </button>
            )}
          </div>
        </div>

       
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedNews.map((article, i) => (
              <FadeIn key={article._id || i} delay={i * 0.05}>
                <div
                  onClick={() => article.external ? window.open(article.url, '_blank') : setSelectedArticle(article)}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={article.image || 'https://via.placeholder.com/400x250?text=News'} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span className="font-medium text-green-600">{article.external ? article.source : 'Community Post'}</span>
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600">{article.title}</h3>
                    <p className="text-sm text-green-700 line-clamp-3">{article.excerpt}</p>
                    <div className="mt-auto pt-4 flex items-center text-green-600 font-bold text-xs uppercase tracking-widest">
                      Read More
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {!loading && displayedNews.length === 0 && (
          <div className="text-center py-20 text-gray-500 italic">No stories found.</div>
        )}
      </div>

      {selectedArticle && <NewsModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
      {showForm && <NewsForm onSubmit={handleCreateNews} onCancel={() => setShowForm(false)} error={error} />}
    </div>
  );
};

export default NewsPage;