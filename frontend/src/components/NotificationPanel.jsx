import './NotificationPanel.css'

function NotificationPanel({ notifications }) {
  if (notifications.length === 0) {
    return (
      <aside className="notif-panel">
        <div className="notif-header">
          <span className="notif-label">POWIADOMIENIA</span>
          <span className="notif-live">
            <span className="live-dot"></span>
            LIVE
          </span>
        </div>
        <div className="notif-empty">
          <div className="notif-empty-icon">◎</div>
          <p>Brak powiadomień</p>
          <p className="notif-empty-sub">Nasłuchuję zdarzeń...</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="notif-panel">
      <div className="notif-header">
        <span className="notif-label">POWIADOMIENIA</span>
        <span className="notif-live">
          <span className="live-dot live-dot-active"></span>
          LIVE
        </span>
      </div>
      <div className="notif-list">
        {notifications.map((notif) => (
          <div key={notif.id} className="notif-item">
            <div className="notif-item-dot"></div>
            <div className="notif-item-body">
              <div className="notif-item-title">
                Zadanie {notif.status === 'completed' ? 'ukończone' : 'zaktualizowane'}
              </div>
              <div className="notif-item-meta">
                {notif.email || 'System'} · przed chwilą
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default NotificationPanel
