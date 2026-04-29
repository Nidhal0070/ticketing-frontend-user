import { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User not authenticated. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/tickets/my");
      setTickets(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "open") return "#28a745";
    if (status === "in progress") return "#ffc107";
    if (status === "resolved") return "#007bff";
    return "#dc3545";
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <span style={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
          <button onClick={loadTickets} style={styles.retryButton}>Try Again</button>
          <Link to="/dashboard" style={styles.backLink}>Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Tickets</h1>
        <Link to="/create-ticket">
          <button style={styles.createButton}>
            <span>➕</span> Create New Ticket
          </button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>🎫</span>
          <p>You don't have any tickets yet.</p>
          <Link to="/create-ticket">
            <button style={styles.emptyButton}>Create your first ticket</button>
          </Link>
        </div>
      ) : (
        <div style={styles.ticketsGrid}>
          {tickets.map((ticket) => (
            <div key={ticket._id} style={styles.ticketCard}>
              <div style={styles.ticketHeader}>
                <h3 style={styles.ticketTitle}>{ticket.title}</h3>
              </div>
              <p style={styles.ticketDescription}>{ticket.description}</p>
              <div style={styles.ticketFooter}>
                <span style={{
                  ...styles.statusBadge,
                  color: getStatusColor(ticket.status),
                  borderColor: getStatusColor(ticket.status)
                }}>
                  {ticket.status}
                </span>
                <button
                  onClick={() => navigate(`/ticket-chat/${ticket._id}`)}
                  style={styles.chatButton}
                >
                  💬 Open Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div style={styles.backFooter}>
        <Link to="/dashboard" style={styles.backLinkFooter}>← Back to Dashboard</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  createButton: {
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  ticketsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
    marginBottom: "40px"
  },
  ticketCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    animation: "fadeInUp 0.5s ease-out"
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px"
  },
  ticketTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: 0,
    flex: 1
  },
  ticketDescription: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
    marginBottom: "16px"
  },
  ticketFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px"
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    border: "1px solid",
    backgroundColor: "transparent"
  },
  chatButton: {
    padding: "8px 16px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "20px"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px"
  },
  errorCard: {
    textAlign: "center",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px"
  },
  errorIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "16px"
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "16px",
    marginRight: "12px"
  },
  backLink: {
    color: "#667eea",
    textDecoration: "none",
    marginTop: "16px",
    display: "inline-block"
  },
  emptyState: {
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: "24px",
    padding: "60px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  },
  emptyIcon: {
    fontSize: "64px",
    display: "block",
    marginBottom: "20px"
  },
  emptyButton: {
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    marginTop: "20px",
    fontSize: "14px",
    fontWeight: "600"
  },
  backFooter: {
    textAlign: "center",
    marginTop: "40px"
  },
  backLinkFooter: {
    color: "#667eea",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s"
  }
};

// ajoute Keyframes animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
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
  
  .ticket-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  a:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(styleSheet);

export default MyTickets;