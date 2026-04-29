import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [totalTickets, setTotalTickets] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // verifier l'authentification et charger les données
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      loadUserInfo();
      loadTicketStats();
    }
  }, [navigate]);

  const loadUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      // Décode le token JWT directement (pas besoin d'appel API)
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
const res = { data: { name: payload.name || payload.email, email: payload.email, role: payload.role }};
      setUserName(res.data.name);
    } catch (err) {
      console.log("Failed to load user info", err);
    }
  };

  const loadTicketStats = async () => {
    try {
      const res = await api.get("/tickets/my");
      const tickets = res.data;
      setTotalTickets(tickets.length);
    } catch (err) {
      console.log("Failed to load ticket stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.welcomeSection}>
            <span style={styles.welcomeIcon}>👋</span>
            <div>
              <h2 style={styles.title}>Welcome back, {userName || "User"}!</h2>
              <p style={styles.subtitle}>Here's what's happening with your tickets</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <span>🚪</span> Logout
          </button>
        </div>

        {/* statistiques*/}
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, backgroundColor: "#667eea" }}>
            <div style={styles.statNumber}>{totalTickets}</div>
            <div style={styles.statLabel}>Total Tickets</div>
          </div>
        </div>

        {/* actions */}
        <div style={styles.actionsGrid}>
          <Link to="/create-ticket" style={styles.actionLink}>
            <div style={styles.actionCard}>
              <span style={styles.actionIcon}>➕</span>
              <h3 style={styles.actionTitle}>Create Ticket</h3>
              <p style={styles.actionDesc}>Submit a new support ticket</p>
            </div>
          </Link>
          
          <Link to="/my-tickets" style={styles.actionLink}>
            <div style={styles.actionCard}>
              <span style={styles.actionIcon}>📋</span>
              <h3 style={styles.actionTitle}>My Tickets</h3>
              <p style={styles.actionDesc}>View and manage your tickets</p>
            </div>
          </Link>
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
    padding: "40px",
    animation: "fadeInUp 0.6s ease-out"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "20px"
  },
  welcomeSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  welcomeIcon: {
    fontSize: "48px"
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
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  statsGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    textAlign: "center",
    padding: "25px 40px",
    borderRadius: "20px",
    color: "white",
    transition: "transform 0.2s",
    minWidth: "200px"
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "8px"
  },
  statLabel: {
    fontSize: "14px",
    opacity: 0.9
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  actionLink: {
    textDecoration: "none"
  },
  actionCard: {
    backgroundColor: "#f8f9fa",
    border: "2px solid #e2e8f0",
    borderRadius: "20px",
    padding: "30px 20px",
    textAlign: "center",
    transition: "all 0.3s",
    cursor: "pointer"
  },
  actionIcon: {
    fontSize: "48px",
    display: "block",
    marginBottom: "15px"
  },
  actionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a2e",
    margin: "0 0 8px 0"
  },
  actionDesc: {
    fontSize: "13px",
    color: "#666",
    margin: 0
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
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
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .action-card:hover {
    transform: translateY(-5px);
    border-color: #667eea;
    box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.2);
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;