import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Smile, Frown, Meh, Heart, Star } from "lucide-react"
import type { LifeEvent } from "@/lib/types"
import { useApp } from "@/stores/useApp"
import dayjs from "dayjs"

export default function LifeEvents() {
    const { fetchLifeEvents } = useApp()
    const [eventLogs, setEventLogs] = useState<LifeEvent[]>([])

    useEffect(() => {
        const eventsLogs = async () => {
            const logs = await fetchLifeEvents()
            setEventLogs(logs)
        }
        eventsLogs()
    }, [])

    const getEmotionIcon = (emotion: string) => {
        switch (emotion.toLowerCase()) {
            case "happy":
                return <Smile className="w-4 h-4 text-yellow-400" />
            case "sad":
                return <Frown className="w-4 h-4 text-blue-400" />
            case "neutral":
                return <Meh className="w-4 h-4 text-gray-400" />
            case "love":
                return <Heart className="w-4 h-4 text-pink-400" />
            case "proud":
                return <Star className="w-4 h-4 text-orange-400" />
            default:
                return <Meh className="w-4 h-4 text-white" />
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Life Events</h1>
                    <p className="text-muted-foreground mt-1">Capture key moments and emotions from your journey.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventLogs.map((event) => (
                    <Card key={event.id} className="glass-card border-white/10 transition-all duration-200">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {getEmotionIcon(event.emotionType)}
                                    <CardTitle className="text-lg capitalize">{event.title}</CardTitle>
                                </div>
                                <Badge variant="outline" className="border-white/20 text-white/80">
                                    {event.emotionType}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            {event.description && (
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>{dayjs(event.createdAt).format("hh:mm A, DD MMM YYYY")}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
