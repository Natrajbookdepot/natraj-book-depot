import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Categories from './pages/Categories'; // <-- New: Import Categories page

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Home page */}
              <Route path="/" element={<Home />} />

              {/* All Categories grid page */}
              <Route path="/categories" element={<Categories />} />

              {/* TODO: Add more pages below as you build */}
              {/* <Route path="/about" element={<About />} /> */}
              {/* <Route path="/category/:slug" element={<CategoryDetail />} /> */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
