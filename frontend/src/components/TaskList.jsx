import styles from './TaskList.module.css'

function TaskList({ taskList }) {
  return (
    <ul className={styles.list}>
      {taskList.map((task) => (
        <li key={task.id} className={styles.item}>
          <span>{task.title}</span>
          <span className={task.status === 'completed' ? styles.statusCompleted : styles.status}>
            {task.status}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default TaskList