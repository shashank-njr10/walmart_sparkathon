import React, { useEffect, useState } from "react";
import axios from "axios";

function CartPage({ customer, onBack, onCheckout }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/cart/${customer.id}`)
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setLoading(false);
      });
  }, [customer.id]);

  const removeFromCart = (product_id) => {
    axios
      .delete(`http://localhost:4000/cart/${customer.id}/${product_id}`)
      .then(() =>
        setCart(cart.filter((item) => item.product_id !== product_id))
      )
      .catch((error) => console.error("Error removing item:", error));
  };

  const updateQuantity = (product_id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product_id);
      return;
    }

    axios
      .put(`http://localhost:4000/cart/${customer.id}/${product_id}`, {
        quantity: newQuantity,
      })
      .then(() => {
        setCart(
          cart.map((item) =>
            item.product_id === product_id
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      })
      .catch((error) => console.error("Error updating quantity:", error));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#f5f7fa",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.2rem",
            color: "#388e3c",
            fontWeight: 600,
          }}
        >
          Loading your cart...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          width: "85%",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#2e7d32",
                fontWeight: 700,
                fontSize: "2.5rem",
                margin: 0,
                marginBottom: "4px",
              }}
            >
              Your Shopping Cart
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "1.1rem",
                margin: 0,
              }}
            >
              {cart.length === 0
                ? "Your cart is empty"
                : `${calculateItemsCount()} items in your cart`}
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              background: "#388e3c",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(56, 142, 60, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#2e7d32";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#388e3c";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ← Continue Shopping
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "60px 40px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px dashed #e0e0e0",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "24px",
                opacity: 0.5,
              }}
            >
              🛒
            </div>
            <h3
              style={{
                color: "#333",
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Your cart is empty
            </h3>
            <p
              style={{
                color: "#666",
                fontSize: "1.1rem",
                marginBottom: "32px",
              }}
            >
              Start shopping to add items to your cart
            </p>
            <button
              onClick={onBack}
              style={{
                background: "linear-gradient(135deg, #43a047 0%, #66bb6a 100%)",
                color: "white",
                padding: "14px 32px",
                border: "none",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(67, 160, 71, 0.4)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(67, 160, 71, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(67, 160, 71, 0.4)";
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* Cart Items */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 350px",
              gap: "32px",
              alignItems: "start",
            }}
          >
            {/* Cart Items List */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#2e7d32",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  marginBottom: "24px",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "12px",
                }}
              >
                Cart Items ({cart.length})
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    style={{
                      display: "flex",
                      gap: "20px",
                      padding: "20px",
                      borderRadius: "16px",
                      border: "1px solid #f0f0f0",
                      background: "#fafafa",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#f5f5f5";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={
                        item.image_url && !item.image_url.startsWith("http")
                          ? `http://localhost:4000${item.image_url}`
                          : item.image_url
                      }
                      alt={item.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        background: "white",
                        border: "1px solid #e0e0e0",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/80x80?text=No+Image";
                      }}
                    />

                    {/* Product Details */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#333",
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            color: "#388e3c",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          ₹{item.price}
                        </span>

                        {item.recyclability_index && (
                          <span
                            style={{
                              background: "#e8f5e9",
                              color: "#388e3c",
                              borderRadius: "8px",
                              padding: "4px 8px",
                              fontSize: "0.85rem",
                              fontWeight: 500,
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            🌱 {item.recyclability_index}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginTop: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.9rem",
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          Quantity:
                        </span>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity - 1)
                            }
                            style={{
                              background: "#f5f5f5",
                              border: "none",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              color: "#666",
                              transition: "background 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.background = "#e0e0e0")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.background = "#f5f5f5")
                            }
                          >
                            -
                          </button>

                          <span
                            style={{
                              padding: "8px 16px",
                              background: "white",
                              fontSize: "1rem",
                              fontWeight: 600,
                              color: "#333",
                              minWidth: "40px",
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            style={{
                              background: "#f5f5f5",
                              border: "none",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              color: "#666",
                              transition: "background 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.background = "#e0e0e0")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.background = "#f5f5f5")
                            }
                          >
                            +
                          </button>
                        </div>

                        <span
                          style={{
                            fontSize: "0.9rem",
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          Total: ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      style={{
                        background: "#ff5252",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "all 0.2s",
                        alignSelf: "flex-start",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#d32f2f";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#ff5252";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                position: "sticky",
                top: "32px",
              }}
            >
              <h3
                style={{
                  color: "#2e7d32",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  marginBottom: "24px",
                  borderBottom: "2px solid #f0f0f0",
                  paddingBottom: "12px",
                }}
              >
                Order Summary
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "1rem" }}>
                    Items ({calculateItemsCount()})
                  </span>
                  <span
                    style={{ color: "#333", fontWeight: 600, fontSize: "1rem" }}
                  >
                    ₹{calculateTotal()}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <span style={{ color: "#666", fontSize: "1rem" }}>
                    Shipping
                  </span>
                  <span
                    style={{
                      color: "#388e3c",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    Free
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    borderTop: "2px solid #f0f0f0",
                    borderBottom: "2px solid #f0f0f0",
                  }}
                >
                  <span
                    style={{
                      color: "#2e7d32",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    Total
                  </span>
                  <span
                    style={{
                      color: "#2e7d32",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                    }}
                  >
                    ₹{calculateTotal()}
                  </span>
                </div>

                <button
                  onClick={() => onCheckout(cart)}
                  style={{
                    background:
                      "linear-gradient(135deg, #43a047 0%, #66bb6a 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "16px 24px",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 16px rgba(67, 160, 71, 0.4)",
                    marginTop: "16px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(67, 160, 71, 0.5)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(67, 160, 71, 0.4)";
                  }}
                >
                  Proceed to Checkout
                </button>

                <div
                  style={{
                    background: "#f8f9fa",
                    borderRadius: "12px",
                    padding: "16px",
                    marginTop: "16px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>🌱</span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#388e3c",
                      }}
                    >
                      Sustainable Shopping
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      margin: 0,
                      lineHeight: "1.4",
                    }}
                  >
                    Your order supports eco-friendly products and sustainable
                    practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
