import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Categories from "./pages/categories"; 
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetailPage from "./pages/productDetailPage";
import WishlistPage from './pages/WishlistPage'; 
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:slug" element={<CategoryProducts />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
               <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
