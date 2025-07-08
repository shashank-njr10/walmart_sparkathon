import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderHistoryPage({ customer, onBack }) {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:4000/orders/${customer.id}`)
      .then((res) => setOrders(res.data));
  }, [customer.id]);
  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: 32 }}>
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 4px 24px #e0f2f1",
          padding: 32,
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            fontWeight: 700,
            fontSize: 28,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Order History
        </h2>
        <button
          onClick={onBack}
          style={{
            background: "#388e3c",
            color: "white",
            marginBottom: 24,
            padding: "12px 28px",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 2px 8px #c8e6c9",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2e7d32")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#388e3c")}
        >
          Back to Products
        </button>
        {orders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#757575",
              fontSize: 18,
              marginTop: 32,
            }}
          >
            No orders yet.
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {orders.map((o, idx) => (
            <div
              key={idx}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                background: "#fafafa",
                padding: 20,
                margin: 8,
                boxShadow: "0 2px 8px #e0f2f1",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 18, color: "#2e7d32" }}>
                Order #{o.order_id}
              </span>
              <span style={{ margin: "8px 0", color: "#757575" }}>
                {new Date(o.order_date).toLocaleString()}
              </span>
              <span style={{ color: "#424242" }}>
                Product: <b>{o.name}</b>
              </span>
              <span style={{ color: "#424242" }}>
                Quantity: <b>{o.quantity}</b>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default OrderHistoryPage;
