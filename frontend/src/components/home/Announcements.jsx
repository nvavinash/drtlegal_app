import React, { useState, useEffect } from "react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { getLatestAnnouncements } from "../../utils/mockData";
import { Calendar, FileText, ExternalLink, ChevronRight, Clock } from "lucide-react";

const Announcements = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    setAnnouncements(getLatestAnnouncements());
  }, []);

  const handleAction = (item) => {
    if (item.pdfUrl && item.pdfUrl !== "#") {
      window.open(item.pdfUrl, "_blank");
    } else {
      setSelectedAnnouncement(item);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <SectionWrapper id="announcements" className="bg-red-50">
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

      {/* List / Grid Container */}
      <div className="flex flex-col gap-4">
        {announcements.map((item) => (
          <AnimatedCard 
            key={item.id} 
            onClick={() => handleAction(item)}
            className="group cursor-pointer hover:border-primary/30 transition-all duration-300"
          >
            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            
              {/* Type Icon */}
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                item.type === 'event' 
                ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' 
                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
              }`}>
                {item.type === 'event' ? <Calendar size={24} /> : <FileText size={24} />}
              </div>

              {/* Content */}
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
                    {item.time && <span> • {item.time}</span>}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-zinc-900 line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm md:text-base line-clamp-1 mt-1">
                  {item.description}
                </p>
              </div>

              {/* Action */}
              <div className="flex items-center gap-3 text-zinc-400 md:ml-4">
                 {item.pdfUrl && item.pdfUrl !== "#" ? (
                   <span className="flex items-center gap-2 text-sm font-medium text-primary md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      View PDF <ExternalLink size={16} />
                   </span>
                 ) : (
                   <span className="flex items-center gap-2 text-sm font-medium text-primary md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      Read More <ChevronRight size={16} />
                   </span>
                 )}
                 <div className="hidden md:block">
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a href="/notices" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-900 hover:text-white transition-all duration-300">
          View All Announcements
        </a>
      </div>

      {/* Detail Modal (for items without PDF) */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="sm:max-w-[600px] border-none shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                selectedAnnouncement?.type === 'event' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedAnnouncement?.type}
              </span>
              <div className="text-sm text-zinc-500">
                {selectedAnnouncement && formatDate(selectedAnnouncement.date)}
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold">{selectedAnnouncement?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-zinc-600 leading-relaxed whitespace-pre-wrap">
            {selectedAnnouncement?.description}
            {selectedAnnouncement?.time && (
              <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <p className="font-bold text-zinc-900 flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Event Time: {selectedAnnouncement.time}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
};

export default Announcements;
