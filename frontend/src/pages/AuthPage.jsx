import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { saveUser } = useUser();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (activeTab === 'signup') {
        response = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });
      } else {
        response = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      const profileResponse = await fetch(`${BACKEND_URL}/api/auth/profile/${data.user._id}`);
      let fullProfile = data.user;
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        fullProfile = { ...data.user, ...profileData };
      }

      saveUser({
        id: fullProfile._id,
        email: fullProfile.email,
        name: fullProfile.name,
        username: fullProfile.username || fullProfile.email.split('@')[0],
        displayName: fullProfile.displayName || fullProfile.name,
        bio: fullProfile.bio || '',
        profilePicture: fullProfile.profilePicture || '',
        socials: fullProfile.socials || {}
      });

      navigate(activeTab === 'signup' ? '/profile' : '/');
    } catch (err) {
      setError(err.message);
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {activeTab === 'login' ? 'Welcome Back' : 'Join Our Community'}
        </h1>
        <p className="text-gray-600">
          {activeTab === 'login' 
            ? 'Sign in to access your community resources' 
            : 'Create an account to get started'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'login'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Sign In
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'signup'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {activeTab === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
              required={activeTab === 'signup'}
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="••••••••"
            minLength="6"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : (activeTab === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {activeTab === 'login' ? (
          <>
            Don't have an account?{' '}
            <button 
              onClick={() => setActiveTab('signup')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button 
              onClick={() => setActiveTab('login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;