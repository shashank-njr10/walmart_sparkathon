import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import AIChatbot from "./components/AIChatbot";
import SignOutButton from "./components/SignOutButton";
import axios from "axios";

function App() {
  const [customer, setCustomer] = useState(() => {
    const stored = sessionStorage.getItem("customer");
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState(
    () => sessionStorage.getItem("page") || "products"
  );
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product_id) => {
    axios
      .post(`http://localhost:4000/cart/${customer.id}`, {
        product_id,
        quantity: 1,
      })
      .then(() => alert("Added to cart!"))
      .catch((err) => alert("Failed to add to cart"));
  };

  const handleCheckout = (cart) => {
    setCart(cart);
    setPage("checkout");
  };

  const fetchCart = () => {
    return axios
      .get(`http://localhost:4000/cart/${customer.id}`)
      .then((res) => res.data);
  };

  useEffect(() => {
    if (customer) {
      sessionStorage.setItem("customer", JSON.stringify(customer));
    }
  }, [customer]);

  useEffect(() => {
    sessionStorage.setItem("page", page);
  }, [page]);

  if (!customer) {
    return (
      <LoginPage
        onLogin={(c) => {
          setCustomer(c);
          setPage("products");
        }}
      />
    );
  }

  const handleSignOut = () => {
    sessionStorage.clear();
    setCustomer(null);
    setPage("products");
  };

  if (page === "cart") {
    return (
      <>
        <SignOutButton onSignOut={handleSignOut} />
        <CartPage
          customer={customer}
          onBack={() => setPage("products")}
          onCheckout={handleCheckout}
        />
        <AIChatbot onAddToCart={handleAddToCart} />
      </>
    );
  }

  if (page === "orders") {
    return (
      <>
        <SignOutButton onSignOut={handleSignOut} />
        <OrderHistoryPage
          customer={customer}
          onBack={() => setPage("products")}
        />
        <AIChatbot onAddToCart={handleAddToCart} />
      </>
    );
  }

  if (page === "checkout") {
    if (cart.length === 0) {
      fetchCart().then((fetchedCart) => setCart(fetchedCart));
      return <div>Loading...</div>;
    }
    return (
      <>
        <SignOutButton onSignOut={handleSignOut} />
        <CheckoutPage
          customer={customer}
          cart={cart}
          onBack={() => setPage("cart")}
          setPage={setPage}
        />
        <AIChatbot onAddToCart={handleAddToCart} />
      </>
    );
  }

  return (
    <>
      <SignOutButton onSignOut={handleSignOut} />
      <ProductList
        customer={customer}
        onAddToCart={handleAddToCart}
        onViewCart={() => setPage("cart")}
        onViewOrders={() => setPage("orders")}
      />
      <AIChatbot onAddToCart={handleAddToCart} />
    </>
  );
}

export default App;
