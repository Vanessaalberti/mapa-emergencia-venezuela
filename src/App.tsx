import { HomePage } from './pages/HomePage'
import { AuthProvider } from './store/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  )
}
