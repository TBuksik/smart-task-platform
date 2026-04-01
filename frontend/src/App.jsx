import { useState, useEffect } from 'react'
import Notifications from './components/Notifications'
import TaskList from './components/TaskList'
import LoginForm from './components/LoginForm'

function App() {
  const [token, setToken] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [notifications, setNotifications] = useState([])

  function login(email, password) {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)

    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setToken(data.access_token))
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

  function fetchTasks() {
    fetch('/api/v1/tasks/', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setTasks(data.items))
  }

  function addTask() {
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
        setNewTask('')
        fetchTasks()
      })
  }

  return (
    <div>
      <h1>Smart Task Platform</h1>
      <LoginForm onLogin={login}/>
      {token && (
        <div>
          <p>Zalogowano pomyślnie</p>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Nowe zadanie'
          />
          <button onClick={addTask}>Dodaj zadanie</button>
          <TaskList taskList={tasks}/>
          <Notifications notifications={notifications}/>
        </div>
      )}
    </div>
  )
}

export default App