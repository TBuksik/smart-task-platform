import { useState, useEffect } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [tasks, setTasks] = useState([])

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
    fetch('/api/v1/tasks/', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => setTasks(data.items))
  }, [token])

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
      {token && <p>Zalogowano pomyślnie</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title} - {task.status}</li>
        ))}
      </ul>
    </div>
  )
}

export default App