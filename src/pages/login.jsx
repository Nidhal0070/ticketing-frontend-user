import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    console.log('🔐 [LOGIN-USER] Form submitted');
    console.log('📧 [LOGIN-USER] Email:', email);
    
    try {
      console.log('📤 [LOGIN-USER] Sending login request to /auth/login');
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log('✅ [LOGIN-USER] Login successful!');
      console.log('🎫 [LOGIN-USER] Token received:', res.data.access_token ? 'YES' : 'NO');
      console.log('👤 [LOGIN-USER] User role:', res.data.role);
      console.log('🆔 [LOGIN-USER] User ID:', res.data.userId);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("role", res.data.role);
      navigate("/dashboard");
    } catch (err) {
      console.error('❌ [LOGIN-USER] Login failed!');
      console.error('🔴 [LOGIN-USER] Error status:', err.response?.status);
      console.error('🔴 [LOGIN-USER] Error message:', err.response?.data?.message);
      console.error('🔴 [LOGIN-USER] Full error:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
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
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your account to continue</p>
        </div>

        {/* alerte d'erreur*/}
        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.errorIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* formulaire*/}
        <form onSubmit={handleLogin} style={styles.form}>
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
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* pied de page*/}
        <div style={styles.footer}>
          <p style={styles.registerText}>
            Don't have an account? <Link to="/register" style={styles.registerLink}>Create an account</Link>
          </p>
          <p style={styles.demoText}>
            <strong>Demo Credentials:</strong><br />
            Admin: admin@example.com / admin123<br />
            User: user@example.com / user123
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
  registerText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px"
  },
  registerLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s"
  },
  demoText: {
    fontSize: "12px",
    color: "#888",
    lineHeight: "1.6",
    margin: 0,
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0"
  }
};

//  ajoute Keyframes animations
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

export default Login;

