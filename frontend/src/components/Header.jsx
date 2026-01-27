import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const { user } = useUser();
  const isAuthPage = location.pathname === '/auth';
  const [isPlacesOpen, setIsPlacesOpen] = useState(false);
  const placesDropdownRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Community', path: '/community' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/news' },
    { name: 'Weather', path: '/weather' },
    { name: 'Fun Facts', path: '/funfacts' }
  ];

  const placesCategories = [
    { name: 'All Places', path: '/places' },
    { name: 'Education', path: '/places?category=Education' },
    { name: 'Health', path: '/places?category=Health' },
    { name: 'Food', path: '/places?category=Food' },
    { name: 'Parks', path: '/places?category=Park' },
    { name: 'Libraries', path: '/places?category=Library' },
    { name: 'Museums', path: '/places?category=Museum' },
    { name: 'Community Centers', path: '/places?category=Community Center' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (placesDropdownRef.current && !placesDropdownRef.current.contains(event.target)) {
        setIsPlacesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf7]/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link to="/" className="font-libre text-xl text-slate-900 font-semibold tracking-tight">
            McKinney Commons
          </Link>

          {!isAuthPage && (
            <>
              <nav className="flex flex-wrap items-center gap-6 text-sm text-slate-600 relative">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition ${
                      location.pathname === item.path
                        ? 'text-slate-900 font-medium'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {/* Places Dropdown */}
                <div
                  className="relative"
                  ref={placesDropdownRef}
                >
                  <button
                    type="button"
                    className={`transition flex items-center gap-1 ${
                      location.pathname.startsWith('/places')
                        ? 'text-slate-900 font-medium'
                        : 'hover:text-slate-900'
                    }`}
                    onClick={() => setIsPlacesOpen((open) => !open)}
                  >
                    Places
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isPlacesOpen && (
                    <div
                      className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50"
                    >
                      {placesCategories.map((category) => (
                        <Link
                          key={category.path}
                          to={category.path}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                          onClick={() => setIsPlacesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              <div>
                {user ? (
                  <Link
                    to="/profile"
                    className="px-5 py-2 text-sm font-medium bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="px-5 py-2 text-sm font-medium bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
