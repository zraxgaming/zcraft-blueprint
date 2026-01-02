import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    title: "New Year's Celebration",
    date: "January 1, 2025",
    time: "12:00 AM UTC",
    description: "Ring in the new year with fireworks, special drops, and a community gathering!",
    participants: 500,
    status: "upcoming",
    emoji: "🎆",
  },
  {
    title: "Winter Building Contest",
    date: "January 5-12, 2025",
    time: "All Week",
    description: "Show off your creativity! Build the best winter-themed structure to win prizes.",
    participants: 128,
    status: "upcoming",
    emoji: "🏔️",
  },
  {
    title: "PvP Tournament: Champions League",
    date: "January 15, 2025",
    time: "6:00 PM UTC",
    description: "Compete against the best fighters for glory and exclusive rewards.",
    participants: 64,
    status: "upcoming",
    emoji: "⚔️",
  },
];

const pastEvents = [
  {
    title: "Summer Event: Ice Kingdom",
    date: "December 15-28, 2024",
    description: "Explore the frozen realm and complete challenges for exclusive rewards.",
    participants: 2450,
    emoji: "❄️",
  },
  {
    title: "Halloween Spooktacular",
    date: "October 25-31, 2024",
    description: "Haunted dungeons, spooky mobs, and limited-time cosmetics.",
    participants: 1890,
    emoji: "🎃",
  },
  {
    title: "Anniversary Celebration",
    date: "September 1, 2024",
    description: "Celebrating 4 years of ZCraft with special rewards for all players.",
    participants: 3200,
    emoji: "🎂",
  },
];

export default function EventsPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border mb-6">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Events Calendar</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Server <span className="text-gradient">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join exciting events, win prizes, and make memories with the community.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              Upcoming Events
            </h2>
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <Card key={index} className="card-hover border-0 bg-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 p-8 md:p-12 text-6xl md:w-48 shrink-0">
                        {event.emoji}
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className="bg-emerald-500/10 text-emerald-600">Upcoming</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.participants} interested
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-2">{event.title}</h3>
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex items-center justify-center md:border-l">
                        <Button className="btn-primary-gradient gap-2">
                          Learn More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl font-bold mb-6">Past Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <Card key={index} className="card-hover border-0 bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{event.emoji}</div>
                    <Badge variant="secondary" className="mb-3">Completed</Badge>
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{event.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.participants.toLocaleString()} participants
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
