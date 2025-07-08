import React, { useState } from "react";

function SignOutButton({ onSignOut, className = "" }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    onSignOut();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        className={`signout-button ${className}`}
        onClick={handleClick}
        title="Sign Out"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "25px",
          fontWeight: 600,
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          zIndex: 1000,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 20px rgba(255, 107, 107, 0.4)";
          e.currentTarget.style.background =
            "linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 15px rgba(255, 107, 107, 0.3)";
          e.currentTarget.style.background =
            "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)";
        }}
      >
        <span style={{ fontSize: "16px", transition: "transform 0.2s ease" }}>
          🚪
        </span>
        <span style={{ transition: "opacity 0.2s ease" }}>Sign Out</span>
      </button>

      {showConfirmation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "24px" }}>⚠️</span>
              <h3
                style={{
                  margin: 0,
                  color: "#333",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                Confirm Sign Out
              </h3>
            </div>
            <p
              style={{
                margin: "0 0 24px 0",
                color: "#666",
                fontSize: "14px",
              }}
            >
              Are you sure you want to sign out?
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <button
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  background: "white",
                  color: "#666",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f5f5f5";
                  e.currentTarget.style.borderColor = "#ccc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = "#ddd";
                }}
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: "10px 20px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #ff5252 0%, #d32f2f 100%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={handleConfirm}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .signout-button {
            top: 15px !important;
            right: 15px !important;
            padding: 10px 16px !important;
            font-size: 13px !important;
          }

          .signout-button span:last-child {
            display: none;
          }

          .signout-button span:first-child {
            font-size: 18px !important;
          }
        }
      `}</style>
    </>
  );
}

export default SignOutButton;
