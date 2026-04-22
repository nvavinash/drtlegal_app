import React, { useState, useEffect } from "react";
import SectionWrapper from "../components/SectionWrapper";
import AnimatedCard from "../components/AnimatedCard";
import { getEvents } from "../api/events";
import { Calendar, Search, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

const NoticesPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const notices = events.filter((event) => {
    if (event.type !== "notice") return false;
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pt-24 bg-[#fafafa] min-h-screen pb-20">
      <SectionWrapper>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Notices & Circulars</h1>
            <p className="text-zinc-500 mt-2">Official notifications from DRT Bar Association.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search notices..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-zinc-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : notices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {notices.map((notice) => (
              <AnimatedCard key={notice._id} className="overflow-hidden group hover:border-zinc-200 transition-all border border-zinc-100 bg-white">
                <div className="flex flex-col md:flex-row p-6 md:p-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
                        Notice
                      </span>
                      <span className="text-xs font-medium text-zinc-400">
                        Posted {format(parseISO(notice.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-zinc-900 mb-3 group-hover:text-primary transition-colors">
                      <Link to={`/events/${notice._id}`}>{notice.title}</Link>
                    </h3>
                    
                    <p className="text-zinc-500 mb-6 line-clamp-2 text-sm leading-relaxed">
                      {notice.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-50 justify-between">
                      <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-tight">
                        <Calendar size={14} className="text-zinc-400" />
                        {format(parseISO(notice.date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      {notice.pdf && (
                        <a href={`http://localhost:5000${notice.pdf}`} target="_blank" rel="noreferrer" className="text-xs font-bold bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition shadow">
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-zinc-200 p-20 text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="text-zinc-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No notices found</h3>
            <p className="text-zinc-500 max-w-xs mx-auto">There are no circulars matching your search query.</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
};

export default NoticesPage;
