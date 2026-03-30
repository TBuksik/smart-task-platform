import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TaskList from './TaskList'
import AddTaskModal from './AddTaskModal'
import NotificationPanel from './NotificationPanel'
import './Dashboard.css'

function Dashboard({ token, userEmail, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  function fetchTasks() {
    setIsLoadingTasks(true)
    fetch('/api/v1/tasks/', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setTasks(data.items || []))
      .finally(() => setIsLoadingTasks(false))
  }

  useEffect(() => {
    fetchTasks()

    const ws = new WebSocket(`ws://localhost:5173/api/v1/ws/tasks/${userEmail}?token=${token}`)

    ws.onmessage = async (event) => {
      const text = typeof event.data === 'string' ? event.data : await event.data.text()
      const message = JSON.parse(text)
      setNotifications((prev) => [{ ...message, id: Date.now() }, ...prev].slice(0, 20))
      fetchTasks()
    }

    return () => ws.close()
  }, [token])

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true
    return task.status === activeFilter
  })

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => t.status === 'active').length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <div className="dashboard">
      <Sidebar
        userEmail={userEmail}
        onLogout={onLogout}
        stats={stats}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notificationCount={notifications.length}
      />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h2 className="header-title">
              {activeFilter === 'all' && 'Wszystkie zadania'}
              {activeFilter === 'active' && 'Zadania aktywne'}
              {activeFilter === 'pending' && 'Zadania oczekujące'}
              {activeFilter === 'completed' && 'Zadania ukończone'}
            </h2>
            <span className="header-count">{filteredTasks.length} zadań</span>
          </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <span className="add-btn-icon">+</span>
            Nowe zadanie
          </button>
        </header>

        <TaskList
          tasks={filteredTasks}
          isLoading={isLoadingTasks}
          onRefresh={fetchTasks}
        />
      </main>

      <NotificationPanel notifications={notifications} />

      {showAddModal && (
        <AddTaskModal
          token={token}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchTasks()
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
