import { useState } from 'react'
import { Modal } from './Modal'
import { useAuthContext } from '../store/AuthContext'

interface AuthModalProps {
  onClose: () => void
}

type Mode = 'login' | 'signup'

export function AuthModal({ onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail} = useAuthContext()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    setSubmitting(true)

    const result =
      mode === 'login'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, displayName)

    setSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else if (mode === 'signup') {
      setSignupSuccess(true)
    } else {
      onClose()
    }
  }

  if (signupSuccess) {
    return (
      <Modal title="Revisá tu correo" onClose={onClose}>
        <div className="text-center py-4 space-y-3">
          <p className="text-4xl">📧</p>
          <p className="text-ink-primary">
            Te enviamos un enlace de confirmación a <strong>{email}</strong>. Confirmá tu correo
            para activar tu cuenta.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 px-5 py-2.5 rounded-lg bg-info text-white font-semibold"
          >
            Entendido
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title={mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-ink-secondary">
          No es necesario tener cuenta para reportar o pedir ayuda — el inicio de sesión es
          opcional, útil si quieres ser voluntario o gestionar tus propios reportes mas adelante.
        </p>
        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <div className="flex-1 h-px bg-border" />
          <span>o con tu correo</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="text-sm font-medium block mb-1 text-ink-primary">
              Nombre
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary ">
            Correo
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full p-3 text-base rounded-lg border border-border text-ink-primary "
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1 text-ink-primary">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 text-base rounded-lg border border-border text-ink-primary"
          />
        </div>

        {error && (
          <p className="text-sm text-critical bg-critical/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={submitting || !email || !password || (mode === 'signup' && !displayName)}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl font-bold text-white bg-info disabled:opacity-40"
        >
          {submitting ? 'Procesando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-ink-secondary">
          {mode === 'login' ? (
            <>
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-info underline"
              >
                Creá una
              </button>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-info underline"
              >
                Iniciá sesión
              </button>
            </>
          )}
        </p>
      </div>
    </Modal>
  )
}
