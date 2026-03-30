import './TaskList.css'

function TaskList({ tasks, isLoading, onRefresh }) {
  if (isLoading) {
    return (
      <div className="tasklist-empty">
        <div className="tasklist-spinner"></div>
        <p>Ładowanie zadań...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="tasklist-empty">
        <div className="empty-icon">◈</div>
        <p className="empty-title">Brak zadań</p>
        <p className="empty-sub">Dodaj pierwsze zadanie klikając przycisk powyżej</p>
      </div>
    )
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  function getStatusClass(status) {
    if (status === 'active') return 'status-active'
    if (status === 'completed') return 'status-completed'
    return 'status-pending'
  }

  function getStatusLabel(status) {
    if (status === 'active') return 'Aktywne'
    if (status === 'completed') return 'Ukończone'
    return 'Oczekujące'
  }

  return (
    <div className="tasklist">
      <div className="tasklist-header-row">
        <span className="col-title">ZADANIE</span>
        <span className="col-schedule">HARMONOGRAM</span>
        <span className="col-date">DATA</span>
        <span className="col-status">STATUS</span>
      </div>
      <div className="tasklist-body">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="task-row"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="task-col-title">
              <div className="task-id">#{task.id}</div>
              <div>
                <div className="task-title">{task.title}</div>
                {task.description && (
                  <div className="task-desc">{task.description}</div>
                )}
              </div>
            </div>
            <div className="task-col-schedule">
              {task.schedule ? (
                <span className="task-schedule">{task.schedule}</span>
              ) : (
                <span className="task-no-schedule">—</span>
              )}
            </div>
            <div className="task-col-date">
              {formatDate(task.created_at)}
            </div>
            <div className="task-col-status">
              <span className={`task-status ${getStatusClass(task.status)}`}>
                <span className="status-dot"></span>
                {getStatusLabel(task.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskList
