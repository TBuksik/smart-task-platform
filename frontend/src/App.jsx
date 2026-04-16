import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'

function AppContent() {
  const [token, setToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [tasks, setTasks] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()


  function login(email, password) {
    setToken('')
    setTasks([])
    setNotifications([])
    setLoading(true)
    setError('')
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Nieprawidłowy email lub hasło')
        return response.json()
      })
      .then((data) => {
        setToken(data.access_token)
        setRefreshToken(data.refresh_token)
        setLoading(false)
        navigate('/dashboard')
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }


  function refreshAccessToken() {
    return fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    })
    .then((response) => {
      if (!response.ok) {
        logout()
        return null
      }
      return response.json()
    })
    .then((data) => {
      if (data) setToken(data.access_token)
      return data
    })
  }


  function logout() {
    setToken('')
    setTasks([])
    setNotifications([])
    setError('')
    navigate('/')
  }


  useEffect(() => {
    if (token === '') return
    fetchTasks()

    const ws = new WebSocket(`ws://localhost:5173/api/v1/ws/tasks/test?token=${token}`)

    ws.onmessage = async (event) => {
      const text = typeof event.data === 'string' ? event.data : await event.data.text()
      const message = JSON.parse(text)
      setNotifications((prev) => [...prev, message])
      fetchTasks()
    }

    return () => ws.close()
  }, [token])


  function fetchTasks(search = '', status = 'all') {
    let url = '/api/v1/tasks/?'
    if (search) url += `search=${search}&`
    if (status !== 'all') url += `status=${status}&`

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status === 401) {
          refreshAccessToken()
          return null
        }
        return response.json()
      })
      .then((data) => {
        if (data) setTasks(data.items)
      })
  }


  function addTask(newTask) {
    if (newTask === '') return
    fetch('/api/v1/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTask, description: '' }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchTasks()
      })
  }


  function updateTask(taskId, newTitle) {
    fetch(`/api/v1/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    })
    .then((response) => response.json())
    .then((updatedTask) => {
      setTasks((prev) => prev.map((task) =>
        task.id === taskId ? updatedTask : task
      ))
    })
  }


  function updateTaskStatus(taskId, newStatus) {
    fetch(`/api/v1/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prev) => prev.map((task) =>
          task.id === taskId ? updatedTask : task
        ))
      })
  }


  function deleteTask(taskId) {
    fetch(`/api/v1/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
    .then((response) => {
      if (response.status === 204) fetchTasks()
    })
  }


  return (
    <Routes>
      <Route path="/" element={<LoginPage onLogin={login} error={error} loading={loading} />} />
      <Route path="/dashboard" element={
        token ? 
        <DashboardPage
          tasks={tasks} 
          notifications={notifications} 
          onAdd={addTask} 
          onLogout={logout} 
          onSearch={fetchTasks}
          onDelete={deleteTask}
          onUpdate={updateTask}
          onStatusUpdate={updateTaskStatus}
        /> : <Navigate to="/"/>
      }/>
      <Route path="/profile" element={
        token ?
        <ProfilePage token={token} /> : <Navigate to="/" />
      }/>
      <Route path='*' element={<NotFoundPage onLogout={logout}/>}/>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App