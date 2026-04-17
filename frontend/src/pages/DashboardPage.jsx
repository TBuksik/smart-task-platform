import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'
import Notifications from '../components/Notifications'
import SearchBar from '../components/SearchBar'
import styles from './DashboardPage.module.css'

function DashboardPage({ tasks, notifications, onAdd, onLogout, onSearch, onDelete, onUpdate, onStatusUpdate, currentUser }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const navigate = useNavigate()

  function handleSearch(value) {
    setSearchQuery(value)
    onSearch(value, statusFilter)
  }

  function handleStatusChange(value) {
    setStatusFilter(value)
    onSearch(searchQuery, value)
  }

  function handleReset() {
    setSearchQuery('')
    setStatusFilter('all')
    onSearch('', 'all')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cześć, {currentUser?.full_name || currentUser?.email}!</h1>
        <button className={styles.button} onClick={() => navigate('/profile')}>Profil</button>
        <button className={styles.button} onClick={onLogout}>Wyloguj</button>
      </div>
      <AddTaskForm onAdd={onAdd} />
      <SearchBar value={searchQuery} onSearch={handleSearch}/>
      <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}>
        <option value="all">Wszystkie</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="completed">Completed</option>
      </select>
      {(searchQuery != '' || statusFilter != 'all') &&
        <button onClick={handleReset}>Resetuj Filtry</button>}
      <p>Znaleziono: {tasks.length} zadań</p>
      <TaskList taskList={tasks} onDelete={onDelete} onUpdate={onUpdate} onStatusUpdate={onStatusUpdate}/>
      <Notifications notifications={notifications} />
    </div>
  )
}

export default DashboardPage