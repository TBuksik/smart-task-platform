function TaskList({ taskList }) {
    return (
        <ul>
            {taskList.map((task) => (
              <li key={task.id}>{task.title} - {task.status}</li>
            ))}
        </ul>
    )
}

export default TaskList