import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import AnimatedCard from "../components/AnimatedCard";
import { events } from "../utils/mockData";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";

const EventsPage = () => {
  return (
    <div className="pt-20">
      <SectionWrapper>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Upcoming Events</h1>
          <p className="text-zinc-500 text-lg">Stay informed about our upcoming webinars, seminars, and legal camps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <AnimatedCard key={event.id} className="overflow-hidden group">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                    <Calendar size={28} />
                  </div>
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                    {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-zinc-600 mb-8 leading-relaxed">
                  {event.description}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Calendar size={16} className="text-primary" />
                    {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                    <Clock size={16} className="text-primary" />
                    {event.time}
                  </div>
                </div>

                {event.pdfUrl && (
                  <div className="mt-8 pt-6">
                    <button 
                      onClick={() => window.open(event.pdfUrl, '_blank')}
                      className="w-full py-4 rounded-xl bg-zinc-900 text-white font-bold text-sm tracking-wide hover:bg-primary transition-colors flex items-center justify-center gap-2"
                    >
                      View Event Details <ExternalLink size={16} />
                    </button>
                  </div>
                )}
              </div>
            </AnimatedCard>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default EventsPage;
