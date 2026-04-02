import styles from './Notifications.module.css'

function Notifications({ notifications }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Powiadomienia</h2>
      <ul className={styles.list}>
        {notifications.map((n, index) => (
          <li key={index} className={styles.item}>{JSON.stringify(n)}</li>
        ))}
      </ul>
    </div>
  )
}

export default Notifications