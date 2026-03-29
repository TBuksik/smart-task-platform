import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then((response) => response.json())
      .then((data) => setTasks(data))
  }, [])

  return (
    <div>
      <h1>Smart Task Platform</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <p>Liczba zadań: {tasks.length}</p>
    </div>
  )
}

export default App