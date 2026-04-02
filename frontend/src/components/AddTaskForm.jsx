import { useState } from 'react'
import styles from './AddTaskForm.module.css'

function AddTaskForm({ onAdd }) {
  const [newTask, setNewTask] = useState('')

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Nowe zadanie"
      />
      <button className={styles.button} onClick={() => {
        onAdd(newTask)
        setNewTask('')
      }}>Dodaj zadanie</button>
    </div>
  )
}

export default AddTaskForm