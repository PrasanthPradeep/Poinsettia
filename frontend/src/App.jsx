import { useEffect, useState } from 'react'
import Home from './pages/Home'
import CreateRoom from './pages/CreateRoom'
import JoinRoom from './pages/JoinRoom'
import Dashboard from './pages/Dashboard'
import MyMatch from './pages/MyMatch'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const path = window.location.pathname
    if (path === '/create') {
      setCurrentPage('create')
    } else if (path === '/join') {
      setCurrentPage('join')
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard')
    } else if (path === '/my-match') {
      setCurrentPage('my-match')
    } else {
      setCurrentPage('home')
    }
  }, [])

  // Simple client-side routing
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname
      if (path === '/create') {
        setCurrentPage('create')
      } else if (path === '/join') {
        setCurrentPage('join')
        } else if (path === '/dashboard') {
          setCurrentPage('dashboard')
        } else if (path === '/my-match') {
          setCurrentPage('my-match')
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('popstate', handleNavigation)
    return () => window.removeEventListener('popstate', handleNavigation)
  }, [])

  // Intercept link clicks
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.tagName === 'A' && e.target.href.startsWith(window.location.origin)) {
        e.preventDefault()
        window.history.pushState({}, '', e.target.href)
        const path = new URL(e.target.href).pathname
        if (path === '/create') {
          setCurrentPage('create')
        } else if (path === '/join') {
          setCurrentPage('join')
          } else if (path === '/dashboard') {
            setCurrentPage('dashboard')
          } else if (path === '/my-match') {
            setCurrentPage('my-match')
        } else {
          setCurrentPage('home')
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      {currentPage === 'home' && <Home />}
      {currentPage === 'create' && <CreateRoom />}
      {currentPage === 'join' && <JoinRoom />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'my-match' && <MyMatch />}
    </>
  )
}

export default App
