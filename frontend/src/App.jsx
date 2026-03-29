import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Smart Task Platform</h1>
      <p>Licznik: {count}</p>
      <button onClick={() => setCount(count + 1)}>Dodaj</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

export default App