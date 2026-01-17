import { useState } from 'react';
import FadeIn from '../components/FadeIn';

const mockNews = [
  {
    id: 1,
    title: "New Community Garden Opens in Downtown McKinney",
    date: "2026-01-15",
    category: "Community",
    excerpt: "The city celebrated the opening of a new community garden this weekend, providing fresh produce and educational opportunities for residents.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "/src/assets/news1.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Local Food Bank Receives Major Grant",
    date: "2026-01-12",
    category: "Resources",
    excerpt: "McKinney Food Bank has been awarded a $50,000 grant to expand their services to more families in need.",
    content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/src/assets/news2.jpg"
  },
  {
    id: 3,
    title: "Youth Coding Program Launches This Spring",
    date: "2026-01-10",
    category: "Education",
    excerpt: "A new free coding program for teens will launch at the McKinney Public Library starting February 1st.",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: "/src/assets/news3.jpg"
  },
  {
    id: 4,
    title: "Community Clean-Up Day Scheduled for February",
    date: "2026-01-08",
    category: "Events",
    excerpt: "Join neighbors on February 5th for our annual community clean-up day across all McKinney parks.",
    content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: "/src/assets/news4.jpg"
  }
];

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(mockNews.map(news => news.category))];

  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = mockNews.find(article => article.featured);
  const regularArticles = filteredNews.filter(article => !article.featured);

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
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg">
              Submit News
            </button>
          </div>
        </div>
      </div>

      {featuredArticle && (
        <FadeIn className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div 
                  className="h-64 md:h-full bg-gray-200 bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredArticle.image})` }}
                  onError={(e) => e.target.classList.add('bg-gray-200')}
                />
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
            <FadeIn key={article.id} delay={0}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="h-48 overflow-hidden">
                  <div 
                    className="w-full h-full bg-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.image})` }}
                    onError={(e) => e.target.classList.add('bg-gray-200')}
                  />
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
    </div>
  );
};

export default NewsPage;