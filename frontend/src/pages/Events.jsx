import React, { useState, useEffect } from "react";
import SectionWrapper from "../components/SectionWrapper";
import AnimatedCard from "../components/AnimatedCard";
import CompactCalendar from "../components/events/CompactCalendar";
import { getEvents } from "../api/events";
import { Calendar, Clock, MapPin, Search, Filter, ArrowRight } from "lucide-react";
import { format, isAfter, isBefore, isSameDay, parseISO } from "date-fns";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); // upcoming, past, all
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date Filter
    if (selectedDate && !isSameDay(eventDate, selectedDate)) return false;

    // Search Query
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

    // Status Filter
    if (filter === "upcoming" && isBefore(eventDate, today)) return false;
    if (filter === "past" && isAfter(eventDate, today) && !isSameDay(eventDate, today)) return false;

    return true;
  });

  const upcomingEventsCount = events.filter(e => isAfter(parseISO(e.date), new Date()) || isSameDay(parseISO(e.date), new Date())).length;

  return (
    <div className="pt-24 bg-[#fafafa] min-h-screen pb-20">
      <SectionWrapper>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar: Search & Calendar */}
          <div className="lg:w-1/3 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Find Events</h2>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <CompactCalendar 
                events={events} 
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(isSameDay(date, selectedDate) ? null : date)}
              />
              
              {selectedDate && (
                <button 
                  onClick={() => setSelectedDate(null)}
                  className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Clear date selection
                </button>
              )}
            </div>

            <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-widest">Next Major Event</p>
                <h3 className="text-2xl font-bold mb-4">Annual General Meeting 2026</h3>
                <Link to="/events" className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                  Remind Me <ArrowRight size={16} />
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Scale size={120} />
              </div>
            </div>
          </div>

          {/* Main Content: Event List */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
              <div>
                <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Events</h1>
                <p className="text-zinc-500 mt-2">Discover and participate in our upcoming legal sessions.</p>
              </div>

              <div className="flex bg-white p-1 rounded-2xl border border-zinc-100 shadow-sm self-start sm:self-center">
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === "upcoming" ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" : "text-zinc-500 hover:bg-zinc-50"}`}
                >
                  Upcoming ({upcomingEventsCount})
                </button>
                <button
                  onClick={() => setFilter("past")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === "past" ? "bg-zinc-900 text-white shadow-md shadow-zinc-200" : "text-zinc-500 hover:bg-zinc-50"}`}
                >
                  Past
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-zinc-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map((event) => (
                  <AnimatedCard key={event._id} className="overflow-hidden group hover:border-zinc-200 transition-all border border-zinc-100 bg-white">
                    <Link to={`/events/${event._id}`} className="flex flex-col md:flex-row">
                      {event.imageUrl && (
                        <div className="md:w-48 h-48 md:h-auto overflow-hidden shrink-0">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {event.category}
                          </span>
                          <span className="text-xs font-medium text-zinc-400">
                            Added {format(parseISO(event.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-extrabold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        
                        <p className="text-zinc-500 mb-8 line-clamp-2 text-sm leading-relaxed">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-zinc-50">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-tight">
                            <Calendar size={14} className="text-zinc-400" />
                            {format(parseISO(event.date), 'EEEE, MMMM d')}
                          </div>
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-tight">
                            <Clock size={14} className="text-zinc-400" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-tight">
                            <MapPin size={14} className="text-zinc-400" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-zinc-200 p-20 text-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="text-zinc-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No events found</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                {(searchQuery || selectedDate || filter !== "upcoming") && (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedDate(null);
                      setFilter("upcoming");
                    }}
                    className="mt-8 text-sm font-bold text-primary hover:underline"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventsPage;

// Placeholder for Scale icon if not imported from lucide
function Scale({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}
