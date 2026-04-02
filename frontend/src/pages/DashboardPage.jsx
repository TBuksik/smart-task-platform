import TaskList from '../components/TaskList'
import AddTaskForm from '../components/AddTaskForm'
import Notification from '../components/Notifications'

function DashboardPage({ tasks, notifications, onAdd, onLogout }) {
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={onLogout}>Wyloguj</button>
            <AddTaskForm onAdd={onAdd}/>
            <TaskList taskList={tasks}/>
            <Notification notifications={notifications}/>
        </div>
    )
}

export default DashboardPage