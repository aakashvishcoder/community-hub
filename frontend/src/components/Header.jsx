import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/src/assets/react.svg"
                            alt="Community Hub Logo"
                            className="h-10 w-auto object-contain"
                            onError={(e) => {
                                e.target.style.display='none'
                                e.target.nextSibling.style.display="block"
                            }}
                        />
                        <span className="ml-2 text-xl font-bold text-gray-800 hidden">Community Hub</span>
                    </Link>

                    {!isAuthPage && (
                        <Link
                            to="/auth"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;