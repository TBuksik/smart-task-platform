import './Sidebar.css'

function Sidebar({ userEmail, onLogout, stats, activeFilter, onFilterChange, notificationCount }) {
  const filters = [
    { key: 'all', label: 'Wszystkie', count: stats.total },
    { key: 'active', label: 'Aktywne', count: stats.active },
    { key: 'pending', label: 'Oczekujące', count: stats.pending },
    { key: 'completed', label: 'Ukończone', count: stats.completed },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">⬡</span>
        <div>
          <div className="sidebar-brand-name">Smart Task</div>
          <div className="sidebar-brand-tag">Enterprise</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">WIDOKI</div>
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`sidebar-nav-item ${activeFilter === filter.key ? 'sidebar-nav-item-active' : ''}`}
            onClick={() => onFilterChange(filter.key)}
          >
            <span className="nav-item-dot"></span>
            <span className="nav-item-label">{filter.label}</span>
            <span className="nav-item-count">{filter.count}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-stats">
        <div className="sidebar-nav-label">STATYSTYKI</div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Łącznie</div>
          </div>
          <div className="stat-card stat-card-active">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Aktywne</div>
          </div>
          <div className="stat-card stat-card-completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Ukończone</div>
          </div>
          <div className="stat-card stat-card-pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Oczekujące</div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-email">{userEmail}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Wyloguj
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
