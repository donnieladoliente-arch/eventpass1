import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the project-root .env.local file, then restart Vite."
  );
}

const supabase = createClient(supabaseUrl, supabasePublishableKey);

// ======================================================
// EMAIL VALIDATION
// ======================================================

function isValidEmail(email) {
  const value = email.trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(date) {
  if (!date) return "No date";

  return new Date(date).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ======================================================
// NAVBAR
// ======================================================

function Navbar({
  user,
  page,
  setPage,
  menuOpen,
  setMenuOpen,
  handleLogout,
}) {
  const navigate = (target) => {
    setPage(target);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button
          className="logo"
          onClick={() => navigate(user ? "dashboard" : "home")}
        >
          EventPass
        </button>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => navigate("home")}>Home</button>

          {user ? (
            <>
              <button onClick={() => navigate("dashboard")}>
                Dashboard
              </button>

              <button onClick={() => navigate("events")}>
                Events
              </button>

              <button onClick={() => navigate("tickets")}>
                My Tickets
              </button>

              <button onClick={() => navigate("reward")}>
                Reward
              </button>

              <button onClick={() => navigate("profile")}>
                Profile
              </button>

              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("login")}>Login</button>
              <button onClick={() => navigate("signup")}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ======================================================
// HOME PAGE
// ======================================================

function HomePage({ user, setPage, showRewardPopup, setShowRewardPopup }) {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="demo-badge">DEMO PROJECT</span>

          <h1>Welcome to EventPass</h1>

          <p>
            Discover events, reserve tickets, and manage your event
            experience in one place.
          </p>

          <div className="hero-buttons">
            {user ? (
              <button
                className="primary-button"
                onClick={() => setPage("events")}
              >
                Browse Events
              </button>
            ) : (
              <>
                <button
                  className="primary-button"
                  onClick={() => setPage("signup")}
                >
                  Get Started
                </button>

                <button
                  className="secondary-button"
                  onClick={() => setShowRewardPopup(true)}
                >
                  View Demo Reward
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🎟️</div>
          <h3>Easy Ticketing</h3>
          <p>Reserve event tickets through a simple online process.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Discover Events</h3>
          <p>Browse upcoming events and view their details.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>Your Account</h3>
          <p>Manage your profile, tickets, and demo reward.</p>
        </div>
      </section>
    </div>
  );
}

// ======================================================
// SIGNUP PAGE
// IMPORTANT: OUTSIDE APP()
// ======================================================

function SignupPage({
  fullName,
  setFullName,
  username,
  setUsername,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  handleSignup,
  loading,
  message,
  messageType,
  goToLogin,
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="demo-badge">EVENTPASS</span>

          <h1>Create Account</h1>

          <p>Register your EventPass account.</p>
        </div>

        {message && (
          <div className={messageType === "success"
            ? "success-message"
            : "error-message"}>
            {message}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <small>
              Use letters, numbers, and underscore only.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="signupEmail">Email Address</label>

            <input
              id="signupEmail"
              name="signupEmail"
              type="email"
              placeholder="example@gmail.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              autoComplete="email"
            />

            <small>
              Example: yourname@gmail.com
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="signupPassword">Password</label>

            <input
              id="signupPassword"
              name="signupPassword"
              type="password"
              placeholder="Create a password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              autoComplete="new-password"
            />

            <small>Minimum of 6 characters.</small>
          </div>

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?
          </p>

          <button
            type="button"
            className="link-button"
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// LOGIN PAGE
// IMPORTANT: OUTSIDE APP()
// ======================================================

function LoginPage({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  handleLogin,
  loading,
  message,
  messageType,
  goToSignup,
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="demo-badge">EVENTPASS</span>

          <h1>Welcome Back</h1>

          <p>Login to your EventPass account.</p>
        </div>

        {message && (
          <div className={messageType === "success"
            ? "success-message"
            : "error-message"}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="loginEmail">Email Address</label>

            <input
              id="loginEmail"
              name="loginEmail"
              type="email"
              placeholder="example@gmail.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>

            <input
              id="loginPassword"
              name="loginPassword"
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>

          <button
            type="button"
            className="link-button"
            onClick={goToSignup}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// DASHBOARD
// ======================================================

function DashboardPage({
  profile,
  events,
  tickets,
  reward,
  setPage,
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="demo-badge">DASHBOARD</span>

        <h1>
          Welcome, {profile?.full_name || "User"}!
        </h1>

        <p>
          Manage your EventPass account from your dashboard.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Available Events</h3>
          <strong>{events.length}</strong>

          <button onClick={() => setPage("events")}>
            View Events
          </button>
        </div>

        <div className="dashboard-card">
          <h3>My Tickets</h3>
          <strong>{tickets.length}</strong>

          <button onClick={() => setPage("tickets")}>
            View Tickets
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Demo Reward</h3>
          <strong>₱5,000</strong>

          <button onClick={() => setPage("reward")}>
            View Reward
          </button>
        </div>
      </div>

      <div className="dashboard-note">
        <strong>Demo Notice:</strong>

        <p>
          The ₱5,000 reward shown in this application is fictional
          and has no real monetary value.
        </p>

        {reward && (
          <p>
            Your demo reward record is stored in Supabase.
          </p>
        )}
      </div>
    </div>
  );
}

// ======================================================
// EVENTS PAGE
// ======================================================

function EventsPage({ events, buyTicket, loading }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="demo-badge">EVENTS</span>

        <h1>Upcoming Events</h1>

        <p>Choose an event and reserve your ticket.</p>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <h2>No Events Available</h2>
          <p>Please add events to your Supabase database.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="event-image"
                />
              ) : (
                <div className="event-image-placeholder">
                  🎫
                </div>
              )}

              <div className="event-content">
                <h2>{event.title}</h2>

                <p>{event.description}</p>

                <div className="event-info">
                  <p>
                    <strong>📍 Location:</strong>{" "}
                    {event.location}
                  </p>

                  <p>
                    <strong>📅 Date:</strong>{" "}
                    {formatDate(event.event_date)}
                  </p>

                  <p>
                    <strong>💰 Price:</strong>{" "}
                    ₱{Number(event.price).toFixed(2)}
                  </p>

                  <p>
                    <strong>🎟️ Available:</strong>{" "}
                    {event.available_tickets}
                  </p>
                </div>

                <button
                  className="primary-button full-width"
                  onClick={() => buyTicket(event)}
                  disabled={
                    loading || event.available_tickets <= 0
                  }
                >
                  {event.available_tickets <= 0
                    ? "Sold Out"
                    : loading
                    ? "Processing..."
                    : "Buy Ticket"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ======================================================
// TICKETS PAGE
// ======================================================

function TicketsPage({ tickets }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="demo-badge">MY TICKETS</span>

        <h1>My Tickets</h1>

        <p>Your purchased EventPass tickets.</p>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <h2>No Tickets Yet</h2>

          <p>
            You haven't purchased any event tickets.
          </p>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div className="ticket-card" key={ticket.id}>
              <div>
                <span className="ticket-status">
                  {ticket.status}
                </span>

                <h2>
                  {ticket.events?.title || "Event"}
                </h2>

                <p>
                  📍 {ticket.events?.location || "N/A"}
                </p>

                <p>
                  📅{" "}
                  {formatDate(ticket.events?.event_date)}
                </p>
              </div>

              <div className="ticket-details">
                <p>
                  <strong>Ticket Code</strong>
                </p>

                <code>{ticket.ticket_code}</code>

                <p>
                  Quantity: {ticket.quantity}
                </p>

                <p>
                  Total: ₱
                  {Number(ticket.total_price).toFixed(2)}
                </p>

                <p>
                  Purchased:{" "}
                  {formatDate(ticket.purchased_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ======================================================
// REWARD PAGE
// ======================================================

function RewardPage({ reward, claimReward, loading }) {
  return (
    <div className="page-container">
      <div className="reward-page-card">
        <span className="demo-badge">DEMO REWARD</span>

        <h1>₱5,000</h1>

        <h2>Congratulations!</h2>

        <p>
          This is a fictional reward used only for the EventPass
          school/demo project.
        </p>

        <p className="reward-warning">
          This reward has no real monetary value and cannot be
          withdrawn or redeemed.
        </p>

        {reward ? (
          <div className="success-message">
            Your demo reward record has been saved to Supabase.
          </div>
        ) : (
          <button
            className="primary-button"
            onClick={claimReward}
            disabled={loading}
          >
            {loading
              ? "Saving Reward..."
              : "Claim Demo Reward"}
          </button>
        )}
      </div>
    </div>
  );
}

// ======================================================
// PROFILE PAGE
// ======================================================

function ProfilePage({ profile }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <span className="demo-badge">PROFILE</span>

        <h1>My Profile</h1>

        <p>Your EventPass account information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <strong>Full Name</strong>
          <span>{profile?.full_name || "N/A"}</span>
        </div>

        <div className="profile-row">
          <strong>Username</strong>
          <span>{profile?.username || "N/A"}</span>
        </div>

        <div className="profile-row">
          <strong>Email</strong>
          <span>{profile?.email || "N/A"}</span>
        </div>

        <div className="profile-row">
          <strong>Account Created</strong>
          <span>
            {formatDate(profile?.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [showRewardPopup, setShowRewardPopup] =
    useState(true);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [reward, setReward] = useState(null);

  // Signup
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("error");

  const [loading, setLoading] = useState(false);

  // ====================================================
  // LOAD SESSION
  // ====================================================

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        setPage("dashboard");
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ====================================================
  // LOAD USER DATA
  // ====================================================

  useEffect(() => {
    if (!user) return;

    loadProfile();
    loadEvents();
    loadTickets();
    loadReward();
  }, [user]);

  // ====================================================
  // LOAD PROFILE
  // ====================================================

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile error:", error);
      return;
    }

    setProfile(data);
  }

  // ====================================================
  // LOAD EVENTS
  // ====================================================

  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", {
        ascending: true,
      });

    if (error) {
      console.error("Events error:", error);
      return;
    }

    setEvents(data || []);
  }

  // ====================================================
  // LOAD TICKETS
  // ====================================================

  async function loadTickets() {
    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        events (
          title,
          location,
          event_date
        )
      `)
      .eq("user_id", user.id)
      .order("purchased_at", {
        ascending: false,
      });

    if (error) {
      console.error("Tickets error:", error);
      return;
    }

    setTickets(data || []);
  }

  // ====================================================
  // LOAD REWARD
  // ====================================================

  async function loadReward() {
    const { data, error } = await supabase
      .from("demo_rewards")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Reward error:", error);
      return;
    }

    setReward(data);
  }

  // ====================================================
  // SIGNUP
  // ====================================================

  async function handleSignup(e) {
    e.preventDefault();

    setMessage("");
    setMessageType("error");

    const cleanName = fullName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = signupEmail.trim();

    if (!cleanName) {
      setMessage("Please enter your full name.");
      return;
    }

    if (cleanName.length < 2) {
      setMessage(
        "Full name must contain at least 2 characters."
      );
      return;
    }

    if (!cleanUsername) {
      setMessage("Please enter a username.");
      return;
    }

    if (cleanUsername.length < 3) {
      setMessage(
        "Username must contain at least 3 characters."
      );
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setMessage(
        "Username can only contain letters, numbers, and underscore."
      );
      return;
    }

    if (!cleanEmail) {
      setMessage("Please enter your email.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setMessage(
        "Please enter a valid email address, such as name@gmail.com."
      );
      return;
    }

    if (!signupPassword) {
      setMessage("Please create a password.");
      return;
    }

    if (signupPassword.length < 6) {
      setMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      // ----------------------------------------------
      // CREATE SUPABASE AUTH USER
      // ----------------------------------------------

      const {
        data,
        error,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password: signupPassword,

        options: {
          data: {
            full_name: cleanName,
            username: cleanUsername,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);

        if (
          error.message
            .toLowerCase()
            .includes("rate limit")
        ) {
          setMessage(
            "Supabase email rate limit has been reached. Please wait before trying another signup."
          );
        } else if (
          error.message
            .toLowerCase()
            .includes("already registered")
        ) {
          setMessage(
            "This email is already registered. Please login instead."
          );
        } else {
          setMessage(error.message);
        }

        return;
      }

      if (!data?.user) {
        setMessage(
          "Account could not be created. Please try again."
        );
        return;
      }

      // Clear fields only AFTER successful signup.
      setFullName("");
      setUsername("");
      setSignupEmail("");
      setSignupPassword("");

      setLoginEmail(cleanEmail);

      setMessageType("success");

      setMessage(
        "Account created successfully. You can now login."
      );

      setPage("login");
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // LOGIN
  // ====================================================

  async function handleLogin(e) {
    e.preventDefault();

    setMessage("");
    setMessageType("error");

    const cleanEmail = loginEmail.trim();

    if (!cleanEmail) {
      setMessage("Please enter your email.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setMessage(
        "Please enter a valid email address."
      );
      return;
    }

    if (!loginPassword) {
      setMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: loginPassword,
      });

      if (error) {
        console.error("Login error:", error);

        setMessage(error.message);
        return;
      }

      setLoginPassword("");

      setMessageType("success");
      setMessage("Login successful!");

      setUser(data.user);
      setPage("dashboard");
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // LOGOUT
  // ====================================================

  async function handleLogout() {
    await supabase.auth.signOut();

    setUser(null);
    setProfile(null);
    setTickets([]);
    setReward(null);

    setPage("home");
  }

  // ====================================================
  // BUY TICKET
  // ====================================================

  async function buyTicket(event) {
    if (!user) {
      setPage("login");
      return;
    }

    if (event.available_tickets <= 0) {
      setMessage("This event is sold out.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const ticketCode =
        "EP-" +
        Date.now().toString(36).toUpperCase() +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 7)
          .toUpperCase();

      const totalPrice = Number(event.price);

      const { error } = await supabase
        .from("tickets")
        .insert({
          user_id: user.id,
          event_id: event.id,
          ticket_code: ticketCode,
          quantity: 1,
          total_price: totalPrice,
          status: "CONFIRMED",
        });

      if (error) {
        console.error("Ticket error:", error);
        setMessage(error.message);
        return;
      }

      setMessageType("success");
      setMessage(
        `Ticket purchased successfully! Code: ${ticketCode}`
      );

      await loadTickets();
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while purchasing the ticket."
      );
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // CLAIM REWARD
  // ====================================================

  async function claimReward() {
    if (!user) {
      setPage("login");
      return;
    }

    if (reward) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase
        .from("demo_rewards")
        .insert({
          user_id: user.id,
          reward_amount: 5000,
          reward_type: "DEMO_REWARD",
          status: "DEMO",
        })
        .select()
        .single();

      if (error) {
        console.error("Reward error:", error);

        if (
          error.message
            .toLowerCase()
            .includes("duplicate")
        ) {
          await loadReward();
          return;
        }

        setMessage(error.message);
        return;
      }

      setReward(data);

      setMessageType("success");
      setMessage(
        "Your fictional demo reward was saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong while claiming the demo reward."
      );
    } finally {
      setLoading(false);
    }
  }

  // ====================================================
  // PAGE CONTENT
  // ====================================================

  function renderPage() {
    if (page === "home") {
      return (
        <HomePage
          user={user}
          setPage={setPage}
          showRewardPopup={showRewardPopup}
          setShowRewardPopup={setShowRewardPopup}
        />
      );
    }

    if (page === "signup") {
      return (
        <SignupPage
          fullName={fullName}
          setFullName={setFullName}
          username={username}
          setUsername={setUsername}
          signupEmail={signupEmail}
          setSignupEmail={setSignupEmail}
          signupPassword={signupPassword}
          setSignupPassword={setSignupPassword}
          handleSignup={handleSignup}
          loading={loading}
          message={message}
          messageType={messageType}
          goToLogin={() => {
            setMessage("");
            setPage("login");
          }}
        />
      );
    }

    if (page === "login") {
      return (
        <LoginPage
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          handleLogin={handleLogin}
          loading={loading}
          message={message}
          messageType={messageType}
          goToSignup={() => {
            setMessage("");
            setPage("signup");
          }}
        />
      );
    }

    if (page === "dashboard") {
      return (
        <DashboardPage
          profile={profile}
          events={events}
          tickets={tickets}
          reward={reward}
          setPage={setPage}
        />
      );
    }

    if (page === "events") {
      return (
        <EventsPage
          events={events}
          buyTicket={buyTicket}
          loading={loading}
        />
      );
    }

    if (page === "tickets") {
      return <TicketsPage tickets={tickets} />;
    }

    if (page === "reward") {
      return (
        <RewardPage
          reward={reward}
          claimReward={claimReward}
          loading={loading}
        />
      );
    }

    if (page === "profile") {
      return <ProfilePage profile={profile} />;
    }

    return null;
  }

  return (
    <div className="app">
      <Navbar
        user={user}
        page={page}
        setPage={setPage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleLogout={handleLogout}
      />

      {message && page !== "signup" && page !== "login" && (
        <div className="global-message">
          <div
            className={
              messageType === "success"
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </div>
        </div>
      )}

      <main>{renderPage()}</main>

      {!user &&
        page === "home" &&
        showRewardPopup && (
          <div className="reward-overlay">
            <div className="reward-popup">
              <button
                className="close-popup"
                onClick={() => setShowRewardPopup(false)}
              >
                ×
              </button>

              <span className="demo-badge">
                DEMO REWARD
              </span>

              <h2>🎉 Congratulations!</h2>

              <h1>₱5,000</h1>

              <p>
                You have been selected for a fictional
                EventPass demo reward.
              </p>

              <p className="small-text">
                This reward is for demonstration purposes
                only and has no real monetary value.
              </p>

              <button
                className="primary-button full-width"
                onClick={() => {
                  setShowRewardPopup(false);
                  setPage("signup");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;