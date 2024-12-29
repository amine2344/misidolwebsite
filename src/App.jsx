import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/GlobalStyles"; // Si vous avez des styles globaux
import Header from "./components/Header";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Products from "./pages/Products/Products";
import ShoppingCartPage from "./pages/ShoppingCard";
import Product from "./pages/Products/Product";
import Collections from "./pages/Collections/Collections";
import { SectionFilterProvider } from "./hooks/SectionFilterContext";
import Payment from "./pages/Payement/Payment";
import PaymentStatus from "./pages/Payement/PaymentStatus";

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <SectionFilterProvider>
          <div className="app">
            <Header />
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:sectionId" element={<Products />} />
                <Route path="/products/:categoryId" element={<Products />} />
                <Route path="/product" element={<Product />} />
                <Route path="/products/:subCategoryId" element={<Products />} />
                <Route path="/ShoppingCard" element={<ShoppingCartPage />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/checkout" element={<Payment />} />
                <Route path="/checkout-status" element={<PaymentStatus />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </SectionFilterProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
