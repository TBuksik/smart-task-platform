import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'
import Notifications from '../components/Notifications'
import SearchBar from '../components/SearchBar'
import styles from './DashboardPage.module.css'
import { useState } from 'react'

function DashboardPage({ tasks, notifications, onAdd, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = tasks.filter((task) => {
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.button} onClick={onLogout}>Wyloguj</button>
      </div>
      <AddTaskForm onAdd={onAdd} />
      <SearchBar onSearch={setSearchQuery}/>
      <TaskList taskList={filteredTasks} />
      <Notifications notifications={notifications} />
    </div>
  )
}

export default DashboardPage