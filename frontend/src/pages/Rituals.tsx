import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus,  Clock, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Ritual } from "@/lib/types"
import { BACKEND_URL, useApp } from "@/stores/useApp"
import axios from "axios"
import { toast } from "sonner"


export default function Rituals() {
    const { fetchRituals } = useApp()
    const [rituals, setRituals] = useState<Ritual[]>([])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newRitual, setNewRitual] = useState({
        title: "",
        notes: "",
        duration: 10,
        ritualSteps: [""],
        ritualType: ""
    })
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")

    const addStep = () => {
        setNewRitual((prev) => ({
            ...prev,
            ritualSteps: [...prev.ritualSteps, ""],
        }))
    }

    const updateStep = (index: number, value: string) => {
        setNewRitual((prev) => ({
            ...prev,
            ritualSteps: prev.ritualSteps.map((step, i) => (i === index ? value : step)),
        }))
    }

    const removeStep = (index: number) => {
        setNewRitual((prev) => ({
            ...prev,
            ritualSteps: prev.ritualSteps.filter((_, i) => i !== index),
        }))
    }

    const createRitual = async () => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${BACKEND_URL}/api/ritual/create`, newRitual, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                toast.success(res.data.msg);
            }
        } catch (error) {
            toast.error("Failed to create ritual");
        } finally {
            setIsLoading(false)
            await fetchRituals();
        }


    }

    useEffect(() => {
        const allRituals = async () => {
            const rituals = await fetchRituals();
            setRituals(rituals)
        }
        allRituals()
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Daily Rituals</h1>
                    <p className="text-muted-foreground mt-1">Create and manage your wellness routines</p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Ritual
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-white/20 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="gradient-text">Create New Ritual</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name" className="mb-2">Ritual Title</Label>
                                <Input
                                    id="name"
                                    value={newRitual.title}
                                    onChange={(e) => setNewRitual((prev) => ({ ...prev, title: e.target.value }))}
                                    className="glass-card border-white/20 bg-white/5"
                                />
                            </div>
                            <div>
                                <Label htmlFor="ritualType" className="mb-2">Ritual Type</Label>
                                <Input
                                    id="ritualType"
                                    value={newRitual.ritualType}
                                    onChange={(e) => setNewRitual((prev) => ({ ...prev, ritualType: e.target.value }))}
                                    className="glass-card border-white/20 bg-white/5"
                                    placeholder="Eg. Mindfulness"
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes" className="mb-2">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={newRitual.notes}
                                    onChange={(e) => setNewRitual((prev) => ({ ...prev, notes: e.target.value }))}
                                    className="glass-card border-white/20 bg-white/5"
                                />
                            </div>

                            <div>
                                <Label htmlFor="duration" className="mb-2">Duration (seconds)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    value={newRitual.duration}
                                    onChange={(e) =>
                                        setNewRitual((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 10 }))
                                    }
                                    className="glass-card border-white/20 bg-white/5"
                                />
                            </div>

                            <div>
                                <Label className="mb-2">Steps</Label>
                                <div className="space-y-2">
                                    {newRitual.ritualSteps.map((step, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={step}
                                                onChange={(e) => updateStep(index, e.target.value)}
                                                placeholder={`Step ${index + 1}`}
                                                className="glass-card border-white/20 bg-white/5"
                                            />
                                            {newRitual.ritualSteps.length > 1 && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeStep(index)}
                                                    className="border-red-400/30 text-red-400 hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={addStep}

                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Step
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={createRitual}
                                    disabled={!newRitual.title.trim() || newRitual.ritualSteps.every((step) => !step.trim()) || isLoading}

                                >
                                    {isLoading ? "loading...." : "Create Ritual"}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}

                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rituals.map((ritual) => (
                    <Card
                        key={ritual.id}
                        className="glass-card  transition-all duration-200"
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-lg mb-2">{ritual.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground mb-3">{ritual.notes}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge>{ritual.ritualType}</Badge>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            {ritual.duration}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-2 text-purple-400">Steps:</h4>
                                <ul className="space-y-1">
                                    {ritual.ritualSteps.map((step, index) => (
                                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="text-white font-mono text-xs mt-0.5">{index + 1}.</span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>

{/* 
                            <div className="flex gap-2">
                                
                                <Button size="sm" className="flex-1 bg-white/20 border border-white/40 text-white hover:bg-white/30">
                                    <Play className="w-4 h-4 mr-2" />
                                    Start
                                </Button>
                            </div> */}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
