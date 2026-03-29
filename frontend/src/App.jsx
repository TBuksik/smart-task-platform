import { useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('')

  function addTask() {
    if (inputValue === '') return
    setTasks([...tasks, inputValue])
    setInputValue('')
  }

  return (
    <div>
      <h1>Smart Task Platform</h1>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Nazwa zadania"
      />
      <button onClick={addTask}>Dodaj zadanie</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  )
}

export default App