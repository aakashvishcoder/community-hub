import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const isAuthPage = location.pathname === '/auth';

  const [isPlacesOpen, setIsPlacesOpen] = useState(false);
  const placesRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Community', path: '/community' },
    { name: 'Events', path: '/events' },
    { name: 'News', path: '/news' },
    { name: 'Weather', path: '/weather' },
    { name: 'Fun Facts', path: '/funfacts' },
  ];

  const placesCategories = [
    { name: 'All Places', path: '/places' },
    { name: 'Education', path: '/places?category=Education' },
    { name: 'Health', path: '/places?category=Health' },
    { name: 'Food', path: '/places?category=Food' },
    { name: 'Parks', path: '/places?category=Park' },
    { name: 'Libraries', path: '/places?category=Library' },
    { name: 'Museums', path: '/places?category=Museum' },
    { name: 'Community Centers', path: '/places?category=Community Center' },
  ];

  // Outside click closes dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (placesRef.current && !placesRef.current.contains(e.target)) {
        setIsPlacesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsPlacesOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsPlacesOpen(false);
    }, 180); // 👈 delay (tweak 150–250ms)
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fafaf7]/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="font-libre text-xl font-semibold text-slate-900">
            McKinney Commons
          </Link>

          {!isAuthPage && (
            <>
              <nav className="flex flex-wrap items-center gap-6 text-sm text-slate-600">

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

                {/* ✅ PLACES */}
                <div
                  ref={placesRef}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => navigate('/places')}
                    className={`flex items-center gap-1 transition ${
                      location.pathname.startsWith('/places')
                        ? 'text-slate-900 font-medium'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Places
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>

                  {isPlacesOpen && (
                    <div className="absolute left-0 top-full mt-3 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                      {placesCategories.map((cat) => (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                          onClick={() => setIsPlacesOpen(false)}
                        >
                          {cat.name}
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
                    className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition"
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
