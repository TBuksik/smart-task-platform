import { useNavigate } from "react-router-dom"

function NotFoundPage() {
    const navigate = useNavigate()
    return (
        <div>
            <h1>404 - Strona nie istnieje</h1>
            <button onClick={() => navigate('/')}>Wróć do logowania</button>
        </div>
    )
}

export default NotFoundPage