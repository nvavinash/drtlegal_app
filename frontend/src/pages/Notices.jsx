import React from "react";
import SectionWrapper from "../components/SectionWrapper";
import AnimatedCard from "../components/AnimatedCard";
import { circulars } from "../utils/mockData";
import { FileText, Download, Calendar, ExternalLink } from "lucide-react";

const NoticesPage = () => {
  return (
    <div className="pt-20">
      <SectionWrapper>
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">Official Circulars</h1>
          <p className="text-zinc-500 text-lg">Access and download official notifications and bar association circulars.</p>
        </div>

        <div className="flex flex-col gap-6">
          {circulars.map((notice) => (
            <AnimatedCard key={notice.id} className="group overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 shrink-0 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                  <FileText size={32} />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                      Circular
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium">
                      <Calendar size={14} />
                      {new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2 group-hover:text-primary transition-colors">
                    {notice.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed max-w-3xl">
                    {notice.description}
                  </p>
                </div>

                <div className="md:pl-6 md:border-l border-zinc-100 flex items-center justify-center">
                  <button 
                    onClick={() => window.open(notice.pdfUrl, '_blank')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm tracking-wide hover:bg-primary transition-all duration-300 transform group-hover:scale-105"
                  >
                    View PDF <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </SectionWrapper>
    </div>
  );
};

export default NoticesPage;
