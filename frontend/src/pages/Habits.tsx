import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus } from "lucide-react"
import type { Habit } from "@/lib/types"
import { BACKEND_URL, useApp } from "@/stores/useApp"
import dayjs from "dayjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"

export default function Habits() {
    const { fetchHabits } = useApp()
    const [habits, setHabits] = useState<Habit[]>([])
    const [newHabit, setNewHabit] = useState({
        title: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    useEffect(() => {
        const allHabits = async () => {
            const habits = await fetchHabits()
            setHabits(habits)
        }
        allHabits()
    }, [])
    const addHabit = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${BACKEND_URL}/api/habit/create`, newHabit, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                await fetchHabits();
                toast.success(res.data.msg);

            }
        } catch (error) {
            toast.error("Failed to add habit");
        } finally {
            setIsLoading(false)

        }


    }
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Daily Habits</h1>
                    <p className="text-muted-foreground mt-1">Build consistency and stay on track with your wellness habits.</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Habit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/20 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="gradient-text mb-5">Add New Habit</DialogTitle>
                            <Label>Habit Title</Label>

                            <Input
                                id="name"
                                value={newHabit.title}
                                onChange={(e) => setNewHabit((prev) => ({ ...prev, title: e.target.value }))}
                                className="glass-card border-white/20 bg-white/5"
                            />

                            <Button disabled={isLoading} onClick={addHabit}>{isLoading ? "loading..." : "Add"}</Button>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                    <Card key={habit.id} className="glass-card transition-all duration-200 border-white/20">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-1">
                                    <CardTitle className="text-lg">{habit.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Created on {dayjs(habit.createdAt).format("DD MMM YYYY")}
                                    </p>
                                </div>
                                <Badge variant="secondary" className="bg-green-400/10 text-green-400 border-green-400/20">
                                    Active
                                </Badge>
                            </div>
                        </CardHeader>

                    </Card>
                ))}
            </div>
        </div>
    )
}
