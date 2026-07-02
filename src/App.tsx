import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ForeignAidPage } from './pages/ForeignAidPage'
import { AuthProvider } from './store/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ayuda-extranjero" element={<ForeignAidPage />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    
  )
}

