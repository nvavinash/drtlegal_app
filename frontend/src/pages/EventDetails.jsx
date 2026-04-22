import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SectionWrapper from "../components/SectionWrapper";
import { getEventById } from "../api/events";
import { 
  Calendar, 
  ArrowLeft, 
  Share2, 
  CalendarPlus, 
  FileText,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "../components/ui/button";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-zinc-400 animate-pulse font-bold text-xl uppercase tracking-widest">Loading Event Details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-32 pb-20 min-h-screen">
        <SectionWrapper>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Event not found</h1>
            <Button onClick={() => navigate("/events")} className="mt-4">Back to Events</Button>
          </div>
        </SectionWrapper>
      </div>
    );
  }

  const addToGoogleCalendar = () => {
    const start = format(parseISO(event.date), "yyyyMMdd");
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${start}&details=${encodeURIComponent(event.description)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pt-20 bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-zinc-50 border-b border-zinc-100 py-4">
        <SectionWrapper>
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/events" className="hover:text-primary transition-colors">Events</Link>
            <ChevronRight size={12} />
            <span className="text-zinc-900">{event.title}</span>
          </div>
        </SectionWrapper>
      </div>

      <SectionWrapper>
        <div className="mt-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to previous
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Event Header & Content */}
            <div className="lg:col-span-8">
              <div className="mb-6">
                <span className={`px-4 py-1.5 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full ${
                  event.type === 'event' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  {event.type}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-zinc-900 mb-8 leading-[1.1] tracking-tight">
                {event.title}
              </h1>

              <div className="prose prose-zinc max-w-none">
                <div className="text-zinc-600 text-lg leading-relaxed whitespace-pre-wrap mb-10">
                  {event.description}
                </div>
                
                {event.pdf && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                      <FileText className="text-primary" /> Attached Document
                    </h3>
                    <div className="bg-zinc-50 border border-zinc-200 rounded-[32px] overflow-hidden shadow-inner">
                      <iframe 
                        src={`http://localhost:5000${event.pdf}`} 
                        className="w-full aspect-[1/1.4] md:aspect-[4/3] border-0" 
                        title="Document Viewer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Sidebar Info */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <div className="bg-white rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-100/50 p-8 md:p-10">
                  <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">Event Details</h4>
                  
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-tight mb-1">Date</p>
                        <p className="text-zinc-900 font-bold">{event.date ? format(parseISO(event.date), 'EEEE, MMMM d, yyyy') : "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 space-y-3">
                    {event.pdf && (
                      <a href={`http://localhost:5000${event.pdf}`} target="_blank" rel="noreferrer" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-zinc-200 transition">
                        <ExternalLink size={20} />
                        Download PDF
                      </a>
                    )}
                    {event.type === 'event' && (
                      <Button 
                        onClick={addToGoogleCalendar}
                        className="w-full border-zinc-200 hover:bg-zinc-50 py-7 rounded-2xl font-bold flex items-center justify-center gap-2 transition"
                        variant="outline"
                      >
                        <CalendarPlus size={20} />
                        Add to Calendar
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="w-full border-zinc-200 hover:bg-zinc-50 py-7 rounded-2xl font-bold flex items-center justify-center gap-2"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }}
                    >
                      <Share2 size={20} />
                      Share Event
                    </Button>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-[40px] p-10 border border-primary/10">
                  <h4 className="text-lg font-bold text-zinc-900 mb-4">Have Questions?</h4>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                    If you have any questions regarding this event or need help with registration, please contact our support team.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-primary font-bold hover:underline">
                    Contact Association Office
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventDetails;
