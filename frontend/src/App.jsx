import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* Abhi pages yahan mount karo, simple Home dikhana hai toh */}
      {/* <Home /> */}
      {/* Ya baad mein <Routes> dalna hai toh yahan */}
    </AuthProvider>
  );
}

export default App;
