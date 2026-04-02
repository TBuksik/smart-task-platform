import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'
import Notifications from '../components/Notifications'
import styles from './DashboardPage.module.css'

function DashboardPage({ tasks, notifications, onAdd, onLogout }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.button} onClick={onLogout}>Wyloguj</button>
      </div>
      <AddTaskForm onAdd={onAdd} />
      <TaskList taskList={tasks} />
      <Notifications notifications={notifications} />
    </div>
  )
}

export default DashboardPage