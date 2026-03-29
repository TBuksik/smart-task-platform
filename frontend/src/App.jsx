import { useState, useEffect } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [notifications, setNotifications] = useState([])

  function login() {
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

    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/tasks?token=${token}`)

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
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
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Email'
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Hasło'
        type='password'
      />
      <button onClick={login}>Zaloguj</button>
      {token && (
        <div>
          <p>Zalogowano pomyślnie</p>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Nowe zadanie'
          />
          <button onClick={addTask}>Dodaj zadanie</button>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>{task.title} - {task.status}</li>
            ))}
          </ul>
          <h2>Powiadomienia</h2>
          <ul>
            {notifications.map((n, index) => (
              <li key={index}>{JSON.stringify(n)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App