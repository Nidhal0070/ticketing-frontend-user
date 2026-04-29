import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function TicketChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const role = localStorage.getItem("role") || "user";

  useEffect(() => {
    loadMessages();
  }, [id]);

  const loadMessages = async () => {
    try {
      setError("");
      const res = await api.get(`/tickets/${id}/messages`);
      setMessages(res.data);
    } catch (err) {
      setError("Failed to load messages. Please try again.");
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      setError("");
      await api.post(`/tickets/${id}/messages`, {
        ticketId: id,
        sender: role,
        text: text.trim(),
      });
      setText("");
      loadMessages();
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    try {
      setAiAnalyzing(true);
      setAiSuggestion("");
      const res = await api.post(`/tickets/${id}/analyze`, {
        messages: messages.map((m) => ({ sender: m.sender, text: m.text })),
      });
      setAiSuggestion(res.data.suggestion || "No suggestion available.");
    } catch (err) {
      setAiSuggestion("AI analysis failed. Please try again.");
      console.error(err);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const useSuggestion = () => {
    setText(aiSuggestion);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerIcon}>💬</span>
            <h2 style={styles.title}>Ticket Chat</h2>
            <span style={styles.ticketId}>#{id?.slice(-6)}</span>
          </div>
          <button onClick={() => navigate("/dashboard")} style={styles.backButton}>
            ← Back
          </button>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={styles.emptyIcon}>💬</span>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  ...styles.message,
                  backgroundColor: msg.sender === role ? "#667eea" : "#f1f5f9",
                  alignSelf: msg.sender === role ? "flex-end" : "flex-start",
                  borderBottomRightRadius: msg.sender === role ? "4px" : "12px",
                  borderBottomLeftRadius: msg.sender === role ? "12px" : "4px",
                }}
              >
                <div style={styles.messageHeader}>
                  <strong style={{ color: msg.sender === role ? "white" : "#334155" }}>
                    {msg.sender}
                  </strong>
                  <span style={styles.messageTime}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ ...styles.messageText, color: msg.sender === role ? "white" : "#1e293b" }}>
                  {msg.text}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ia section */}
        {role === "admin" && (
          <div style={styles.aiSection}>
            <div style={styles.aiHeader}>
              <span style={styles.aiIcon}>🤖</span>
              <span style={styles.aiTitle}>AI Assistant</span>
            </div>
            <div style={styles.aiActions}>
              <button
                onClick={analyzeWithAI}
                disabled={aiAnalyzing}
                style={aiAnalyzing ? { ...styles.aiButton, ...styles.aiButtonDisabled } : styles.aiButton}
              >
                {aiAnalyzing ? (
                  <span style={styles.loadingSpinner}>
                    <span style={styles.spinner}></span>
                    Analyzing...
                  </span>
                ) : (
                  "✨ Analyze Conversation"
                )}
              </button>
            </div>
            {aiSuggestion && (
              <div style={styles.aiSuggestion}>
                <div style={styles.aiSuggestionHeader}>
                  <span>💡</span>
                  <strong>Suggestion</strong>
                </div>
                <p style={styles.aiSuggestionText}>{aiSuggestion}</p>
                <button onClick={useSuggestion} style={styles.useButton}>
                  ✏️ Use This Reply
                </button>
              </div>
            )}
          </div>
        )}

        {/* Input Section */}
        <div style={styles.inputSection}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            style={styles.input}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !text.trim()}
            style={loading || !text.trim() ? { ...styles.sendButton, ...styles.sendButtonDisabled } : styles.sendButton}
          >
            {loading ? (
              <span style={styles.loadingSpinner}>
                <span style={styles.spinner}></span>
                Sending...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px"
  },
  card: {
    maxWidth: "900px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "32px",
    animation: "fadeInUp 0.6s ease-out"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  headerIcon: {
    fontSize: "32px"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0
  },
  ticketId: {
    fontSize: "12px",
    backgroundColor: "#e2e8f0",
    padding: "4px 8px",
    borderRadius: "20px",
    color: "#475569"
  },
  backButton: {
    padding: "8px 16px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  errorAlert: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "20px",
    color: "#dc2626",
    fontSize: "14px",
    textAlign: "center"
  },
  messagesContainer: {
    height: "450px",
    overflowY: "auto",
    backgroundColor: "#f8fafc",
    borderRadius: "20px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
    border: "1px solid #e2e8f0"
  },
  message: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: "12px",
    transition: "all 0.2s"
  },
  messageHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "4px",
    fontSize: "12px"
  },
  messageTime: {
    fontSize: "10px",
    opacity: 0.7
  },
  messageText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.5",
    wordBreak: "break-word"
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8"
  },
  emptyIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px"
  },
  aiSection: {
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "#faf5ff",
    borderRadius: "16px",
    border: "1px solid #e9d5ff"
  },
  aiHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px"
  },
  aiIcon: {
    fontSize: "20px"
  },
  aiTitle: {
    fontWeight: "600",
    color: "#7c3aed"
  },
  aiActions: {
    marginBottom: "12px"
  },
  aiButton: {
    padding: "8px 16px",
    backgroundColor: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  aiButtonDisabled: {
    backgroundColor: "#c4b5fd",
    cursor: "not-allowed"
  },
  aiSuggestion: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "#fef9c3",
    borderRadius: "12px",
    borderLeft: "4px solid #eab308"
  },
  aiSuggestionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px"
  },
  aiSuggestionText: {
    margin: "0 0 12px 0",
    fontSize: "14px",
    color: "#854d0e",
    lineHeight: "1.5"
  },
  useButton: {
    padding: "6px 12px",
    backgroundColor: "#eab308",
    color: "#422006",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s"
  },
  inputSection: {
    display: "flex",
    gap: "12px"
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "16px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit"
  },
  sendButton: {
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s"
  },
  sendButtonDisabled: {
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed"
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid white",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  }
};

// ajoute Keyframes animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .messages-container::-webkit-scrollbar {
    width: 6px;
  }
  
  .messages-container::-webkit-scrollbar-track {
    background: #e2e8f0;
    border-radius: 10px;
  }
  
  .messages-container::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 10px;
  }
`;
document.head.appendChild(styleSheet);

export default TicketChat;