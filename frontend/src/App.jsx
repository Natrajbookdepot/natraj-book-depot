import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          {/* Yahan pages ya <Routes> ya <Home /> aayega */}
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}
export default App;
