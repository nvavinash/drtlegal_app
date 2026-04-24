import React, { useState, useEffect } from "react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { getEvents } from "../../api/events";
import { Calendar, FileText, ExternalLink, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const eventsData = await getEvents();
        // Just take the latest 5 from both events and notices
        setAnnouncements(eventsData.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SectionWrapper id="announcements" className="bg-red-50/50">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-2">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Notice Board</h2>
          <p className="text-zinc-500 max-w-xl">Stay updated with the top events and newest circulars from the association.</p>
        </div>
        <div className="hidden md:flex gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-zinc-600">
            <div className="w-3 h-3 rounded-full bg-red-500" /> Events
          </div>
          <div className="flex items-center gap-1.5 text-zinc-600">
            <div className="w-3 h-3 rounded-full bg-blue-500" /> Circulars
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : announcements.map((item) => (
          <AnimatedCard 
            key={item._id} 
            className="group hover:border-primary/30 transition-all duration-300 bg-white"
          >
            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                item.type === 'event' 
                ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                {item.type === 'event' ? <Calendar size={24} /> : <FileText size={24} />}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${
                    item.type === 'event' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {item.type}
                  </span>
                  <div className="text-sm text-zinc-400 flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatDate(item.date)}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 line-clamp-1 group-hover:text-primary transition-colors">
                  <Link to={`/events/${item._id}`}>{item.title}</Link>
                </h3>
                <p className="text-zinc-500 text-sm md:text-base line-clamp-1 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-zinc-400 md:ml-4">
                 {item.pdf ? (
                   <a href={`${import.meta.env.VITE_API_URL}${item.pdf}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-primary md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      View PDF <ExternalLink size={16} />
                   </a>
                 ) : (
                   <Link to={`/events/${item._id}`} className="flex items-center gap-2 text-sm font-medium text-primary md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      Read More <ChevronRight size={16} />
                   </Link>
                 )}
                 <div className="hidden md:block">
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
        <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-red-200 text-red-700 font-bold hover:bg-red-50 transition-all duration-300">
          View All Events
        </Link>
        <Link to="/notices" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-blue-200 text-blue-700 font-bold hover:bg-blue-50 transition-all duration-300">
          View All Notices
        </Link>
      </div>
    </SectionWrapper>
  );
};

export default Announcements;
