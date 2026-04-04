import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'
import Notifications from '../components/Notifications'
import SearchBar from '../components/SearchBar'
import styles from './DashboardPage.module.css'
import { useState } from 'react'

function DashboardPage({ tasks, notifications, onAdd, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredTasks = tasks.filter((task) => {
    const matchesTitle = task.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesTitle && matchesStatus
  })

  console.log('searchQuery:', searchQuery)
  console.log('pierwszy tytuł:', tasks[0]?.title)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <button className={styles.button} onClick={onLogout}>Wyloguj</button>
      </div>
      <AddTaskForm onAdd={onAdd} />
      <SearchBar onSearch={setSearchQuery}/>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="all">Wszystkie</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
      <TaskList taskList={filteredTasks} />
      <p>Znaleziono: {filteredTasks.length} zadań</p>
      <Notifications notifications={notifications} />
    </div>
  )
}

export default DashboardPage