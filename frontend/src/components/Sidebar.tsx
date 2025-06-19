import { Link } from "react-router-dom";
import { Target, Calendar, Heart, BookOpen, Brain, LogOut } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { Button } from "./ui/button";

const menuItems = [
  { title: "WellthBot AI", url: "/", icon: Brain },
  { title: "Rituals", url: "/rituals", icon: Target },
  { title: "Habits", url: "/habits", icon: Calendar },
  { title: "Mood Logs", url: "/mood-logs", icon: Heart },
  { title: "Life Events", url: "/life-events", icon: BookOpen },
];

export default function AppSidebar() {
  const { user, logout } = useApp();
  return (
    <aside className="min-h-screen bg-background text-white flex flex-col border border-zinc-800  rounded-lg m-5">
      <div className="flex items-center gap-3 p-6 border-b border-zinc-800">
        <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">WellthBot AI</h1>
          <p className="text-sm text-zinc-400">Wellness Agent</p>
        </div>
      </div>
      {user ? (
        <div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-800 transition"
              >
                <item.icon className="w-5 h-5 text-white" />
                <span>{item.title}</span>
              </Link>
            ))}
            <Button onClick={logout} className="w-full"><LogOut />Logout</Button>
          </nav>

        </div>
      ) : (
        <div className="flex-1 p-4 space-y-2">

          <Button variant={"outline"} className="w-full" asChild>
            <Link to={"/login"}>Login</Link>
          </Button>

          <Button className="w-full" asChild>
            <Link to={'/signup'}>Signup</Link>
          </Button>
        </div>
      )}
    </aside>
  );
}
