import AppSidebar from "@/components/Sidebar"
import { Routes, Route } from 'react-router-dom'
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Toaster } from "./components/ui/sonner"
import Bot from "./pages/Bot"
import Protect from "./components/Protect"
import { useApp } from "./stores/useApp"
import { useEffect } from "react"
import Rituals from "./pages/Rituals"
import Habits from "./pages/Habits"
import MoodLogs from "./pages/MoodLogs"
import LifeEvents from "./pages/LifeEvents"
function App() {
  const { fetchUser } = useApp();

  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <div className="min-h-screen w-full bg-black relative flex justify-between">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
      linear-gradient(to right, rgba(75, 85, 99, 0.2) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(75, 85, 99, 0.2) 1px, transparent 1px)
    `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-80 z-10">
        <AppSidebar />
      </div>
      <div className='min-h-screen bg-background rounded-lg border border-zinc-800 flex-1 z-10 relative px-6 py-4 m-5'>

        <Routes>
          <Route
            path="/"
            element={
              <Protect>
                <Bot />
              </Protect>
            }
          />
          <Route
            path="/rituals"
            element={
              <Protect>
                <Rituals />
              </Protect>
            }
          />
          <Route
            path="/habits"
            element={
              <Protect>
                <Habits />
              </Protect>
            }
          />
          <Route
            path="/mood-logs"
            element={
              <Protect>
                <MoodLogs />
              </Protect>
            }
          />
          <Route
            path="/life-events"
            element={
              <Protect>
                <LifeEvents />
              </Protect>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>

      <Toaster position="top-center" />
    </div>
  )
}

export default App
