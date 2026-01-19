import { useState } from 'react';

const NewsModal = ({ article, onClose }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          {article.image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              Published by {article.displayName}
            </span>
          </div>
          
          <div className="flex items-center text-gray-700 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(article.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className={`text-gray-700 ${showFullContent ? '' : 'line-clamp-4'}`}>
              {article.content}
            </p>
            {article.content.length > 200 && (
              <button 
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-3"
              >
                {showFullContent ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 mt-6">
            {article.profilePicture ? (
              <img 
                src={article.profilePicture} 
                alt={article.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                {article.displayName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{article.displayName}</p>
              <p className="text-gray-600 text-sm">@{article.username}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;