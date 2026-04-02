import { useState } from "react"

function AddTaskForm({ onAdd }) {
    const [newTask, setNewTask] = useState('')

    return (
        <div>
            <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder='Nowe zadanie'
          />
          <button onClick={() => {
            onAdd(newTask)
            setNewTask('')
            }}>Dodaj zadanie</button>
          
        </div>
    )
}

export default AddTaskForm