import { useState } from 'react'
import './AddTaskModal.css'

function AddTaskModal({ token, onClose, onSuccess }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [schedule, setSchedule] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!title) {
      setError('Tytuł jest wymagany')
      return
    }
    setIsLoading(true)
    fetch('/api/v1/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, schedule }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          onSuccess()
        } else {
          setError('Błąd podczas dodawania zadania')
        }
      })
      .catch(() => setError('Błąd połączenia z serwerem'))
      .finally(() => setIsLoading(false))
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-label">NOWE ZADANIE</div>
            <h3 className="modal-title">Dodaj zadanie</h3>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label className="field-label">TYTUŁ *</label>
            <input
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nazwa zadania"
              autoFocus
            />
          </div>

          <div className="field-group">
            <label className="field-label">OPIS</label>
            <textarea
              className="field-input field-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Opcjonalny opis zadania..."
              rows={3}
            />
          </div>

          <div className="field-group">
            <label className="field-label">HARMONOGRAM</label>
            <input
              className="field-input"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="np. codziennie o 9:00"
            />
          </div>

          {error && (
            <div className="modal-error">
              <span>!</span> {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>
            Anuluj
          </button>
          <button
            className={`modal-btn-submit ${isLoading ? 'btn-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <span className="btn-spinner"></span> : 'Dodaj zadanie →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal
