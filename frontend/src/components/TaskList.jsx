import styles from './TaskList.module.css'

function TaskList({ taskList, onDelete }) {
  return (
    <ul className={styles.list}>
      {taskList.map((task) => (
        <li key={task.id} className={styles.item}>
          <span>{task.title}</span>
          <div className={styles.actions}>
            <span className={task.status === 'completed' ? styles.statusCompleted : styles.status}>
              {task.status}
            </span>
            <button className={styles.deleteButton} onClick={() => onDelete(task.id)}>Usuń</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default TaskList