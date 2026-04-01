function Notifications({ notifications }) {
    return (
        <div>
            <h2>Powiadomienia</h2>
            <ul>
                {notifications.map((n, index) => (
                    <li key={index}>{JSON.stringify(n)}</li>
                ))}
            </ul>
        </div>
    )
}

export default Notifications