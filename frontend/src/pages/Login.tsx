import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BACKEND_URL, useApp } from "@/stores/useApp";
import { toast } from "sonner";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, fetchUser } = useApp();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/login`, form, {
        withCredentials: true
      });

      if (res.status === 200) {
        toast.success("Logged In");
        localStorage.setItem("token", res.data.token)
        setUser(res.data.user)
      }
    } catch (error) {
      toast.error("Failed to login")
    } finally {
      setIsLoading(false);
      await fetchUser()
    }
  };

  

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 w-1/2">
      <div className="w-full max-w-md bg-primary-foreground/50 text-white rounded-xl shadow-lg p-8 border border-zinc-800">

        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              className="w-full px-4 py-2 bg-primary-foreground/40 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-white outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="******"
              className="w-full px-4 py-2 bg-primary-foreground/40 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-white outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button className="w-full" disabled={isLoading}>
            {isLoading ? "loading...." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-center mt-6 text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
