import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      //appell l'api pour cree un ticket
      await api.post("/tickets", {
        title,
        description,
        userId,
      });
      alert("✅ Ticket created successfully!");
      navigate("/my-tickets");
    } catch (err) {
      alert("❌ Failed to create ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerIcon}>🎫</span>
          <h1 style={styles.title}>Create New Ticket</h1>
          <p style={styles.subtitle}>Describe your issue and we'll help you</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              placeholder="e.g., Login issue, Payment problem..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Please describe your issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              style={styles.textarea}
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={loading ? { ...styles.submitButton, ...styles.buttonDisabled } : styles.submitButton}
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
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
    maxWidth: "650px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "40px",
    animation: "fadeInUp 0.6s ease-out"
  },
  header: {
    textAlign: "center",
    marginBottom: "32px"
  },
  headerIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 8px 0"
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a2e",
    letterSpacing: "0.3px"
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    transition: "all 0.2s",
    outline: "none",
    fontFamily: "inherit"
  },
  textarea: {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    transition: "all 0.2s",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical"
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "8px"
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  submitButton: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  buttonDisabled: {
    backgroundColor: "#cbd5e0",
    cursor: "not-allowed"
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
  
  input:focus, textarea:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(styleSheet);

export default CreateTicket;