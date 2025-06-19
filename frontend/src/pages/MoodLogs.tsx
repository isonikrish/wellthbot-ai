import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, HeartPulse, Zap, Smile, Frown, Meh } from "lucide-react"
import type { MoodLog } from "@/lib/types"
import { useApp } from "@/stores/useApp"
import dayjs from "dayjs"

export default function MoodLogs() {
    const { fetchMoodlogs } = useApp()
    const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])

    useEffect(() => {
        const allMoodLogs = async () => {
            const logs = await fetchMoodlogs()
            setMoodLogs(logs)
        }
        allMoodLogs()
    }, [])

    // Mood icon (basic logic)
    const moodIcon = (mood: string) => {
        switch (mood.toLowerCase()) {
            case "happy":
                return <Smile className="text-yellow-400 w-4 h-4" />
            case "sad":
                return <Frown className="text-blue-400 w-4 h-4" />
            case "neutral":
                return <Meh className="text-gray-400 w-4 h-4" />
            default:
                return <Smile className="text-white w-4 h-4" />
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Mood Logs</h1>
                    <p className="text-muted-foreground mt-1">Reflect on how you've been feeling over time.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moodLogs.map((log) => (
                    <Card key={log.id} className="glass-card border-white/10 transition-all duration-200">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {moodIcon(log.mood)}
                                    <CardTitle className="text-lg capitalize">{log.mood}</CardTitle>
                                </div>
                                <Badge variant="outline" className="border-white/20 text-white/80">
                                    {dayjs(log.createdAt).format("DD MMM")}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span>Energy Level: <strong>{log.energyLevel}</strong></span>
                            </div>

                            <div className="flex items-center gap-2">
                                <HeartPulse className="w-4 h-4 text-red-400" />
                                <span>Stress Level: <strong>{log.stressLevel}</strong></span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>Logged at {dayjs(log.createdAt).format("hh:mm A, DD MMM YYYY")}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
