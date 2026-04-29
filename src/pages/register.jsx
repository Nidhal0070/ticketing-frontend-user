import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* header*/}
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🎫</span>
            <span style={styles.logoText}>Ticket Support</span>
          </div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join us to get started with ticket management</p>
        </div>

        {/* alert d'erreur*/}
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* formulaire*/}
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}
          >
            {loading ? (
              <span style={styles.loadingSpinner}>
                <span style={styles.spinner}></span>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* pied de page*/}
        <div style={styles.footer}>
          <p style={styles.loginText}>
            Already have an account? <Link to="/" style={styles.loginLink}>Sign in</Link>
          </p>
          <p style={styles.infoText}>
            <strong>Note:</strong> After registration, you'll be able to create and manage your tickets.
          </p>
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
    maxWidth: "480px",
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
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "24px"
  },
  logoIcon: {
    fontSize: "28px"
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 8px 0"
  },
  subtitle: {
    fontSize: "15px",
    color: "#666",
    margin: 0
  },
  errorAlert: {
    backgroundColor: "#fff5f5",
    border: "1px solid #fed7d7",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#e53e3e",
    fontSize: "14px",
    fontWeight: "500"
  },
  errorIcon: {
    fontSize: "16px"
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
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    fontSize: "18px",
    color: "#999"
  },
  input: {
    width: "100%",
    padding: "14px 14px 14px 44px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "500",
    transition: "all 0.2s",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fafafa"
  },
  button: {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  buttonDisabled: {
    backgroundColor: "#cbd5e0",
    cursor: "not-allowed",
    boxShadow: "none"
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid white",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite"
  },
  footer: {
    marginTop: "32px",
    textAlign: "center"
  },
  loginText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px"
  },
  loginLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s"
  },
  infoText: {
    fontSize: "12px",
    color: "#888",
    lineHeight: "1.6",
    margin: 0,
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0"
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
    background-color: white !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  button:hover:not(:disabled) {
    background-color: #5a67d8;
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  a:hover {
    color: #5a67d8;
    text-decoration: underline;
  }
`;
document.head.appendChild(styleSheet);

export default Register;