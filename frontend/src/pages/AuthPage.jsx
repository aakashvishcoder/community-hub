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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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
    <div className="min-h-screen bg-[#f7f8f5] flex items-center justify-center px-4 py-16 font-inter">
  <div className="relative w-full max-w-md">

    
    <div className="absolute -inset-6 bg-[#e4ede2] rounded-3xl blur-2xl opacity-70" />

  
    <div className="relative bg-white rounded-3xl shadow-lg px-8 py-10">

   
      <div className="text-center mb-10">
        <h1 className="font-libre text-3xl text-slate-900 mb-3">
          {activeTab === 'login' ? 'Welcome Back' : 'Join Our Community'}
        </h1>
        <p className="text-slate-600 leading-relaxed">
          {activeTab === 'login'
            ? 'Sign in to access your community resources'
            : 'Create an account to get started'}
        </p>
      </div>

 
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-8 mb-10 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('login')}
          className={`pb-2 text-sm font-medium transition ${
            activeTab === 'login'
              ? 'text-[#5f7c65] border-b-2 border-[#5f7c65]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={`pb-2 text-sm font-medium transition ${
            activeTab === 'signup'
              ? 'text-[#5f7c65] border-b-2 border-[#5f7c65]'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Create Account
        </button>
      </div>

  
      <form onSubmit={handleSubmit} className="space-y-6">

        {activeTab === 'signup' && (
          <div>
            <label className="block text-sm text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#a8c1af]"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#a8c1af]"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#a8c1af]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#5f7c65] hover:bg-[#4f6a55] text-white font-medium py-3 rounded-full shadow-md transition disabled:opacity-50"
        >
          {loading
            ? 'Processing...'
            : activeTab === 'login'
              ? 'Sign In'
              : 'Create Account'}
        </button>
      </form>

    
      <div className="mt-8 text-center text-sm text-slate-600">
        {activeTab === 'login' ? (
          <>
            New here?{' '}
            <button
              onClick={() => setActiveTab('signup')}
              className="text-[#5f7c65] font-medium hover:underline"
            >
              Create an account
            </button>
          </>
        ) : (
          <>
            Already a member?{' '}
            <button
              onClick={() => setActiveTab('login')}
              className="text-[#5f7c65] font-medium hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </div>

    </div>
  </div>
</div>

  );
};

export default AuthPage;