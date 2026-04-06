import styles from './TaskList.module.css'
import { useState } from 'react'

function TaskList({ taskList, onDelete, onUpdate }) {
  const [confirmId, setConfirmId] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(task) {
    setEditId(task.id)
    setEditValue(task.title)
  }

  function confirmEdit(taskId) {
    onUpdate(taskId, editValue)
    setEditId(null)
    setEditValue('')
  }

  return (
    <ul className={styles.list}>
      {taskList.map((task) => (
        <li key={task.id} className={styles.item}>
          {editId === task.id
            ? <input 
                className={styles.editInput}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            : <span>{task.title}</span>
          }
          <div className={styles.actions}>
            <span className={task.status === 'completed' ? styles.statusCompleted : styles.status}>
              {task.status}
            </span>
            {editId === task.id
              ? <div>
                  <button className={styles.editButton} onClick={() => confirmEdit(task.id)}>Zapisz</button>
                  <button className={styles.cancelButton} onClick={() => setEditId(null)}>Anuluj</button>
                </div> 
              : <button className={styles.editButton} onClick={() => startEdit(task)}>Edytuj</button>
            }
            {task.id === confirmId 
              ? <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>Potwierdź usunięcie</button> 
              : <button className={styles.deleteButton} onClick={() => setConfirmId(task.id)}>Usuń</button>
            }
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList