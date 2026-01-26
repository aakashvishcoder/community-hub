import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import CommunityFeedPage from './pages/CommunityFeedPage'
import EventsPage from './pages/EventsPage'
import PlacesPage from './pages/PlacesPage'
import NewsPage from './pages/NewsPage'; 
import WeatherPage from './pages/WeatherPage';
import FunFactsPage from './pages/FunFactsPage';
import SourcesPage from './pages/SourcesPage'
import { UserProvider } from './contexts/UserContext'
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <UserProvider>
    
      <Router>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/community" element={<CommunityFeedPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/places" element={<PlacesPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/funfacts" element={<FunFactsPage />} />
              <Route path="/sources" element={<SourcesPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App;