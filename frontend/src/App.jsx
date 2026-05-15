import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://team-task-manager-production-ca3f.up.railway.app/api";
function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [profileEmail, setProfileEmail] = useState(
    localStorage.getItem("email") || ""
  );

  const [notifications, setNotifications] = useState([
    "Welcome to Team Task Manager!",
  ]);

  const [activityLogs, setActivityLogs] = useState([
    "Application opened",
  ]);

  const [chatOpen, setChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  const [messages, setMessages] = useState([
    { text: "Hi 👋 I am your Task Manager Bot!", sender: "bot" },
  ]);

  const userRole = (localStorage.getItem("role") || role)?.toLowerCase();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "Completed" &&
      task.dueDate &&
      new Date(task.dueDate) < new Date()
  ).length;

  const addNotification = (message) => {
    setNotifications((prev) => [message, ...prev]);
  };

  const addActivity = (message) => {
    setActivityLogs((prev) => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...prev,
    ]);
  };

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
      }

      await axios.post(`${API_URL}/auth/signup`, {
        name,
        email,
        password,
        role,
      });

      alert("Registration Successful. Please login now.");
      addActivity(`New ${role} registered: ${email}`);

      setShowRegister(false);
      setName("");
      setEmail("");
      setPassword("");
      setRole("member");
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Registration Failed");
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please enter email and password");
        return;
      }

      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", email);

      setRole(res.data.role);
      setProfileEmail(email);
      setLoggedIn(true);

      alert("Login Successful");

      addNotification(`Logged in as ${res.data.role}`);
      addActivity(`${email} logged in`);

      fetchTasks();
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Login Failed");
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (error) {
      console.log("FETCH TASK ERROR:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/users`);
      setUsers(res.data);
    } catch (error) {
      console.log("FETCH USERS ERROR:", error);
    }
  };

  const createTask = async () => {
    try {
      if (!title || !description) {
        alert("Please enter task title and description");
        return;
      }
      const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://team-task-manager-kaj8.vercel.app",
    "https://team-task-manager-kaj8-ya4j4fixf-akshaya-s-projects4.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/tasks`,
        {
          title,
          description,
          dueDate,
          assignedTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task Created");

      addNotification(`New task created: ${title}`);
      addActivity(`Admin created task: ${title}`);

      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedTo("");

      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Task Creation Failed");
    }
  };

  const updateTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/tasks/${id}`,
        {
          status: "Completed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Task Updated");

      addNotification("Task marked as completed");
      addActivity(`Task status updated to Completed`);

      fetchTasks();
    } catch (error) {
      console.log("UPDATE TASK ERROR:", error);
    }
  };

  const handleLogout = () => {
    addActivity(`${profileEmail} logged out`);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    setLoggedIn(false);
    setTasks([]);
    setUsers([]);
    setEmail("");
    setPassword("");
    setProfileEmail("");
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      text: inputMessage,
      sender: "user",
    };

    let botReply =
      "I can help you with login, register, create task, assign members, due dates, and task updates.";

    const msg = inputMessage.toLowerCase();

    if (msg.includes("profile")) {
      botReply = "Profile shows your email and role.";
    } else if (msg.includes("notification")) {
      botReply = "Notifications show important updates like task creation and status changes.";
    } else if (msg.includes("activity")) {
      botReply = "Activity logs show recent actions performed in the app.";
    } else if (msg.includes("assign")) {
      botReply = "Admins can assign tasks to members using the Assign Member dropdown.";
    } else if (msg.includes("due") || msg.includes("overdue")) {
      botReply = "Due Date is used to track overdue tasks in the dashboard.";
    } else if (msg.includes("create")) {
      botReply = "Admins can create tasks using the Create Task section.";
    } else if (msg.includes("complete") || msg.includes("update")) {
      botReply = "Click Mark Completed button to update task status.";
    } else if (msg.includes("dashboard")) {
      botReply = "Dashboard shows total, pending, completed, and overdue tasks.";
    }

    setMessages([
      ...messages,
      userMsg,
      {
        text: botReply,
        sender: "bot",
      },
    ]);

    setInputMessage("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
      setProfileEmail(localStorage.getItem("email") || "");
      fetchTasks();
      fetchUsers();
    }
  }, []);

  return (
    <div
      className={`container ${
        userRole === "admin" ? "admin-theme" : "member-theme"
      }`}
    >
      <h1 className="heading">Team Task Manager</h1>

      {!loggedIn ? (
        <div className="card">
          {!showRegister ? (
            <>
              <h2>Login</h2>

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={handleLogin}>Login</button>

              <p>
                Don&apos;t have an account?
                <button onClick={() => setShowRegister(true)}>Register</button>
              </p>
            </>
          ) : (
            <>
              <h2>Register</h2>

              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>

              <button onClick={handleRegister}>Register</button>

              <p>
                Already have an account?
                <button onClick={() => setShowRegister(false)}>Login</button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="card">
            <h2>
              {userRole === "admin" ? "Admin Dashboard" : "Member Dashboard"}
            </h2>

            <p>Role: {userRole}</p>

            <div className="stats">
              <div className="stat-box">
                <h3>Total Tasks</h3>
                <p>{totalTasks}</p>
              </div>

              <div className="stat-box">
                <h3>Pending Tasks</h3>
                <p>{pendingTasks}</p>
              </div>

              <div className="stat-box">
                <h3>Completed Tasks</h3>
                <p>{completedTasks}</p>
              </div>

              <div className="stat-box">
                <h3>Overdue Tasks</h3>
                <p>{overdueTasks}</p>
              </div>
            </div>

            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="card">
            <h2>Profile</h2>
            <p>Email: {profileEmail}</p>
            <p>Role: {userRole}</p>
          </div>

          <div className="card">
            <h2>Notifications</h2>
            {notifications.map((note, index) => (
              <p key={index}>🔔 {note}</p>
            ))}
          </div>

          <div className="card">
            <h2>Activity Logs</h2>
            {activityLogs.map((log, index) => (
              <p key={index}>📝 {log}</p>
            ))}
          </div>

          {userRole === "admin" && (
            <div className="card">
              <h2>Create Task</h2>

              <input
                type="text"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Assign Member</option>

                {users
                  .filter((user) => user.role === "member")
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} - {user.email}
                    </option>
                  ))}
              </select>

              <button onClick={createTask}>Create Task</button>
            </div>
          )}

          <div className="card">
            <h2>{userRole === "admin" ? "All Tasks" : "Assigned Tasks"}</h2>

            {tasks.length === 0 ? (
              <p>No tasks found.</p>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>Status: {task.status}</p>

                  <p>
                    Assigned To:{" "}
                    {task.assignedTo?.name || "Not Assigned"}
                  </p>

                  <p>
                    Due Date:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No Due Date"}
                  </p>

                  {task.status !== "Completed" && (
                    <button onClick={() => updateTask(task._id)}>
                      Mark Completed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button className="chat-button" onClick={() => setChatOpen(!chatOpen)}>
        💬
      </button>

      {chatOpen && (
        <div className="chat-box">
          <h3>Task Bot</h3>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <p
                key={index}
                className={msg.sender === "user" ? "user-msg" : "bot-msg"}
              >
                {msg.text}
              </p>
            ))}
          </div>

          <input
            type="text"
            placeholder="Ask something..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;