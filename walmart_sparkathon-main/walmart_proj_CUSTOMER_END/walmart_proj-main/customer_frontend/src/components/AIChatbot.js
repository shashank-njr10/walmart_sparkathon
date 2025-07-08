import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AIChatbot = ({ onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI shopping assistant. I can help you find products, make recommendations, and answer questions about our sustainable products. What would you like to shop for today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState("");
  const [sustainabilityPriority, setSustainabilityPriority] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/chatbot/recommend",
        {
          message: inputMessage,
          budget: budget ? parseInt(budget) : null,
          sustainability_priority: sustainabilityPriority,
        }
      );

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: response.data.response,
        recommendations: response.data.recommendations || [],
        totalCost: response.data.totalCost || 0,
        sustainabilityScore: response.data.sustainabilityScore || 0,
        reasoning: response.data.reasoning || "",
        confidence: response.data.confidence || 0,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Chatbot Error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          "I'm experiencing technical difficulties. Please check your connection and try again!",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product.product_id);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          color: "white",
          fontSize: "28px",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = isOpen
            ? "scale(0.85)"
            : "scale(1.1)";
          e.currentTarget.style.boxShadow =
            "0 12px 40px rgba(102, 126, 234, 0.6)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = isOpen ? "scale(0.9)" : "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(102, 126, 234, 0.4)";
        }}
      >
        🤖
      </button>

      {/* Chatbot Interface */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "120px",
            right: "30px",
            width: "500px",
            height: "700px",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1001,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "24px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            >
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: "4px",
                }}
              >
                AI Shopping Assistant
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>Powered by Google Gemini</span>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    animation: "pulse 2s infinite",
                  }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                fontSize: "24px",
                cursor: "pointer",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ×
            </button>
          </div>

          {/* Settings Panel */}
          <div
            style={{
              padding: "20px",
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <div
              className="chatbot-settings-flex"
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0, maxWidth: "60%" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#495057",
                    marginBottom: "6px",
                  }}
                >
                  Budget (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter your budget..."
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{
                    width: "70%",
                    minWidth: 0,
                    padding: "12px 16px",
                    border: "1px solid #dee2e6",
                    borderRadius: "12px",
                    fontSize: "14px",
                    background: "white",
                    transition: "all 0.2s",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dee2e6";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <label
                className="chatbot-checkbox-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#495057",
                  cursor: "pointer",
                  padding: "12px 16px",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid #dee2e6",
                  transition: "all 0.2s",
                  minWidth: 0,
                  flex: "none",
                  marginLeft: 12,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#667eea";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#dee2e6";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <input
                  type="checkbox"
                  checked={sustainabilityPriority}
                  onChange={(e) => setSustainabilityPriority(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#667eea",
                  }}
                />
                🌱 Sustainable Priority
              </label>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "flex",
                  justifyContent:
                    message.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "16px 20px",
                    borderRadius:
                      message.type === "user"
                        ? "20px 20px 6px 20px"
                        : "20px 20px 20px 6px",
                    background:
                      message.type === "user"
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : message.isError
                        ? "#fee2e2"
                        : "white",
                    color:
                      message.type === "user"
                        ? "white"
                        : message.isError
                        ? "#dc2626"
                        : "#1f2937",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    boxShadow:
                      message.type === "user"
                        ? "0 4px 20px rgba(102, 126, 234, 0.3)"
                        : "0 2px 12px rgba(0,0,0,0.08)",
                    border:
                      message.type === "user"
                        ? "none"
                        : "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div>{message.content}</div>

                  {/* AI Confidence and Intent */}
                  {message.type === "bot" && message.confidence && (
                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.7,
                        marginTop: "8px",
                        padding: "6px 10px",
                        background: "rgba(102, 126, 234, 0.1)",
                        borderRadius: "8px",
                        display: "inline-block",
                      }}
                    >
                      Confidence: {(message.confidence * 100).toFixed(1)}%
                    </div>
                  )}

                  {/* Product Recommendations */}
                  {message.type === "bot" &&
                    message.recommendations &&
                    message.recommendations.length > 0 && (
                      <div
                        style={{
                          marginTop: "16px",
                          padding: "16px",
                          background:
                            message.type === "user"
                              ? "rgba(255,255,255,0.1)"
                              : "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                          borderRadius: "16px",
                          border: "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            marginBottom: "12px",
                            color:
                              message.type === "user" ? "white" : "#374151",
                          }}
                        >
                          🛍️ Recommended Products
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: "12px",
                          }}
                        >
                          {message.recommendations
                            .slice(0, 4)
                            .map((product, index) => (
                              <div
                                key={product.product_id}
                                style={{
                                  background:
                                    message.type === "user"
                                      ? "rgba(255,255,255,0.15)"
                                      : "white",
                                  padding: "12px",
                                  borderRadius: "12px",
                                  border: "1px solid rgba(0,0,0,0.08)",
                                  fontSize: "13px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                  transition: "all 0.2s",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                  e.currentTarget.style.boxShadow =
                                    "0 4px 16px rgba(0,0,0,0.1)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                  e.currentTarget.style.boxShadow =
                                    "0 2px 8px rgba(0,0,0,0.05)";
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: "600",
                                    marginBottom: "6px",
                                    color:
                                      message.type === "user"
                                        ? "white"
                                        : "#1f2937",
                                    fontSize: "12px",
                                    lineHeight: "1.3",
                                  }}
                                >
                                  {product.name}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                    fontSize: "11px",
                                    opacity: 0.8,
                                  }}
                                >
                                  <span style={{ fontWeight: "600" }}>
                                    ₹{product.price}
                                  </span>
                                  <span>🌱 {product.recyclability_index}</span>
                                </div>
                                {product.reason && (
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      fontStyle: "italic",
                                      opacity: 0.7,
                                      marginBottom: "8px",
                                      lineHeight: "1.3",
                                    }}
                                  >
                                    {product.reason}
                                  </div>
                                )}
                                <button
                                  onClick={() => addToCart(product)}
                                  style={{
                                    background:
                                      message.type === "user"
                                        ? "rgba(255,255,255,0.25)"
                                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                    cursor: "pointer",
                                    width: "100%",
                                    fontWeight: "600",
                                    transition: "all 0.2s",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1.02)";
                                    e.currentTarget.style.boxShadow =
                                      "0 2px 8px rgba(0,0,0,0.2)";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.transform =
                                      "scale(1)";
                                    e.currentTarget.style.boxShadow = "none";
                                  }}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            ))}
                        </div>

                        {/* AI Insights */}
                        <div
                          style={{
                            marginTop: "16px",
                            padding: "12px",
                            background:
                              message.type === "user"
                                ? "rgba(255,255,255,0.1)"
                                : "linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)",
                            borderRadius: "12px",
                            fontSize: "12px",
                            border: "1px solid rgba(0,0,0,0.05)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "6px",
                            }}
                          >
                            <span style={{ fontWeight: "600" }}>
                              💰 Total Cost: ₹{message.totalCost}
                            </span>
                          </div>
                          {message.reasoning && (
                            <div
                              style={{
                                marginTop: "8px",
                                fontStyle: "italic",
                                lineHeight: "1.4",
                                opacity: 0.8,
                              }}
                            >
                              �� {message.reasoning}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.6,
                      marginTop: "8px",
                      textAlign: "right",
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: "20px 20px 20px 6px",
                    background: "white",
                    color: "#6b7280",
                    fontSize: "15px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div style={{ fontSize: "20px" }}>🤖</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span>AI is thinking</span>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#667eea",
                            animation: "bounce 1.4s infinite ease-in-out both",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#667eea",
                            animation:
                              "bounce 1.4s infinite ease-in-out both 0.2s",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#667eea",
                            animation:
                              "bounce 1.4s infinite ease-in-out both 0.4s",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #e9ecef",
              background: "white",
              display: "flex",
              gap: "12px",
              alignItems: "flex-end",
            }}
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about shopping, products, or recommendations..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "16px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "25px",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.2s",
                background: "#f9fafb",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                e.target.style.background = "white";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#f9fafb";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              style={{
                padding: "16px 24px",
                background:
                  isLoading || !inputMessage.trim()
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "25px",
                cursor:
                  isLoading || !inputMessage.trim() ? "not-allowed" : "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.2s",
                minWidth: "80px",
              }}
              onMouseOver={(e) => {
                if (!isLoading && inputMessage.trim()) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(102, 126, 234, 0.4)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        @media (max-width: 600px) {
          .chatbot-settings-flex {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .chatbot-checkbox-label {
            margin-left: 0 !important;
            margin-top: 8px !important;
          }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;
