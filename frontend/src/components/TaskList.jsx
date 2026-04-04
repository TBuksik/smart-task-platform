import styles from './TaskList.module.css'
import { useState } from 'react'

function TaskList({ taskList, onDelete }) {
  const [confirmId, setConfirmId] = useState(null)

  return (
    <ul className={styles.list}>
      {taskList.map((task) => (
        <li key={task.id} className={styles.item}>
          <span>{task.title}</span>
          <div className={styles.actions}>
            <span className={task.status === 'completed' ? styles.statusCompleted : styles.status}>
              {task.status}
            </span>
            {task.id === confirmId ? 
            <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>Potwierdź usunięcie</button> : 
            <button className={styles.deleteButton} onClick={() => setConfirmId(task.id)}>Usuń</button>}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList