import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductList({ customer, onAddToCart, onViewCart, onViewOrders }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // Fetch products immediately
    const fetchProducts = () => {
      axios
        .get("http://localhost:4000/products")
        .then((res) => setProducts(res.data));
    };
    fetchProducts();

    // Set up polling every 3 seconds
    const interval = setInterval(fetchProducts, 3000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: 32 }}>
      <div
        style={{
          maxWidth: "1200px",
          width: "65%",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            fontWeight: 700,
            fontSize: 32,
            marginBottom: 8,
          }}
        >
          Welcome, {customer.username}!
        </h2>
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <button
            onClick={onViewCart}
            style={{
              background: "#388e3c",
              color: "white",
              padding: "10px 24px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 8px #c8e6c9",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            View Cart
          </button>
          <button
            onClick={onViewOrders}
            style={{
              background: "#2e7d32",
              color: "white",
              padding: "10px 24px",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 2px 8px #c8e6c9",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            Order History
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginTop: 24,
          }}
        >
          {products.map((p) => (
            <div
              key={p.product_id}
              style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.15s, box-shadow 0.15s",
                minHeight: 270,
                position: "relative",
              }}
            >
              <img
                src={
                  p.image_url && !p.image_url.startsWith("http")
                    ? `http://localhost:4000${p.image_url}`
                    : p.image_url
                }
                alt={p.name}
                style={{
                  width: "100%",
                  height: 90,
                  objectFit: "contain",
                  background: "#f6f6f6",
                  borderTopLeftRadius: 14,
                  borderTopRightRadius: 14,
                  marginBottom: 0,
                  display: "block",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/180x90?text=No+Image";
                }}
              />
              <div
                style={{
                  padding: "12px 10px 10px 10px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.01rem",
                    fontWeight: 600,
                    margin: "0 0 7px 0",
                    color: "#222",
                  }}
                >
                  {p.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      color: "#388e3c",
                      fontWeight: 700,
                      fontSize: "1em",
                    }}
                  >
                    ₹{p.price}
                  </span>
                  <span
                    style={{
                      background: "#e8f5e9",
                      color: "#388e3c",
                      borderRadius: 8,
                      padding: "2px 7px",
                      fontSize: "0.93em",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    🌱 {p.recyclability_index || p.sustainability || "-"}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.93em",
                    color: "#888",
                    marginBottom: 8,
                  }}
                >
                  Stock: {p.stock}
                </div>
                <button
                  onClick={() => onAddToCart(p.product_id)}
                  style={{
                    background:
                      "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 0",
                    fontWeight: 600,
                    fontSize: "0.98em",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    marginTop: "auto",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "linear-gradient(90deg, #388e3c 60%, #43a047 100%)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)")
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ProductList;
