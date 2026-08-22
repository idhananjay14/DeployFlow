interface SidebarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const navItems = [
  { label: "Dashboard", icon: "▦", active: true },
  { label: "Tasks", icon: "☑", active: false },
];

const Sidebar = ({ theme, onToggleTheme }: SidebarProps) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">◆</div>
        <div>
          <h1>DeployFlow</h1>
          <p>Task Management</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`nav-item ${item.active ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">D</div>
          <div>
            <p className="user-name">Dhananjay</p>
            <p className="user-role">Developer</p>
          </div>
        </div>

        <div className="theme-toggle">
          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => theme !== "light" && onToggleTheme()}
          >
            ☀
          </button>
          <button
            className={theme === "dark" ? "active" : ""}
            onClick={() => theme !== "dark" && onToggleTheme()}
          >
            🌙
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
