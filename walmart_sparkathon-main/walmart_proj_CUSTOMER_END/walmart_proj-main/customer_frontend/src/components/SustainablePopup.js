import React, { useState } from "react";

export default function SustainablePopup({ recommendations, onChoose }) {
  const [isLoading, setIsLoading] = useState(false);
  if (!recommendations || recommendations.length === 0) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          minWidth: 500,
          maxWidth: 700,
          boxShadow: "0 8px 32px #b2dfdb",
        }}
      >
        <h2 style={{ color: "#388e3c", textAlign: "center", marginBottom: 24 }}>
          Sustainable Choices Available
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {recommendations.map((rec, idx) => (
            <div
              key={rec.cart_product_id}
              style={{
                background: "#f1f8e9",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 2px 8px #e0f2f1",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 16, color: "#2e7d32" }}>
                In Cart: {rec.cart_product_name} ({rec.cart_category})
              </div>
              <div style={{ color: "#555", fontSize: 15 }}>
                Recyclability: {rec.cart_recyclability_index}, Price: ₹
                {rec.cart_product_price}
              </div>
              {rec.recommended ? (
                <div style={{ marginTop: 8 }}>
                  <span style={{ fontWeight: 500, color: "#388e3c" }}>
                    Recommended:
                  </span>{" "}
                  {rec.recommended.name} (Recyclability:{" "}
                  {rec.recommended.recyclability_index}, Price: ₹
                  {rec.recommended.price})
                  <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
                    <button
                      style={{
                        background:
                          "linear-gradient(90deg, #43a047 60%, #66bb6a 100%)",
                        color: "white",
                        padding: "6px 18px",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #c8e6c9",
                      }}
                      onClick={() => onChoose(true, rec)}
                    >
                      Yes, Replace
                    </button>
                    <button
                      style={{
                        background: "#b71c1c",
                        color: "white",
                        padding: "6px 18px",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #ffcdd2",
                      }}
                      onClick={() => onChoose(false, rec)}
                    >
                      No, Keep Original
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ color: "#888", marginTop: 8 }}>
                  No more sustainable alternative available.
                  <div style={{ marginTop: 10 }}>
                    <button
                      style={{
                        background: "#388e3c",
                        color: "white",
                        padding: "6px 18px",
                        border: "none",
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px #c8e6c9",
                      }}
                      onClick={() => onChoose(false, rec)}
                    >
                      Keep Original
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
