import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; 

const Header = () => {
  const location = useLocation();
  const { user } = useUser(); 
  const isAuthPage = location.pathname === '/auth';

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Community', path: '/community' },
    { name: 'Events', path: '/events' },
    { name: 'Places', path: '/places' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">CR</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">Community Hub</span>
            </Link>
          </div>

          {!isAuthPage && (
            <>
              <nav className="w-full md:w-auto">
                <ul className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          location.pathname === item.path
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div>
                {user ? ( 
                  <Link
                    to="/profile"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                  >
                    Profile
                  </Link>
                ) : ( 
                  <Link
                    to="/auth"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
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