import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ForeignAidPage } from './pages/ForeignAidPage'
import { AuthProvider } from './store/AuthContext'
import { TestGoogle } from './components/TestGoogle'

export default function App() {
  return (
    <AuthProvider>
      <TestGoogle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ayuda-extranjero" element={<ForeignAidPage />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

