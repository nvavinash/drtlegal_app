import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Video, User, ExternalLink, Scale } from "lucide-react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { Button } from "../ui/button";

// Import demo images
import judgeGopichand from "../../assets/demo/judge_gopichand.png";
import judgeKothe from "../../assets/demo/judge_kothe.png";

const MeetingSection = () => {
  const [links, setLinks] = useState({ drt1_link: "", drt2_link: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/virtual");
        setLinks(res.data);
      } catch (err) {
        console.error("Failed to fetch meeting links", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const courts = [
    {
      id: "drt1",
      name: "DRT - 1",
      judge: "GUMMADI GOPICHAND",
      designation: "Presiding Officer",
      image: judgeGopichand,
      link: links.drt1_link,
      color: "bg-blue-600",
      accent: "text-blue-600",
    },
    {
      id: "drt2",
      name: "DRT - 2",
      judge: "RAMESHWAR KOTHE",
      designation: "Presiding Officer",
      image: judgeKothe,
      link: links.drt2_link,
      color: "bg-emerald-600",
      accent: "text-emerald-600",
    },
  ];

  return (
    <SectionWrapper id="online-meetings" className="bg-zinc-50/50 py-24">
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/20">
          <Video size={14} />
          <span>Virtual Court Room</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mb-6 tracking-tight">
          Join Online Hearing
        </h2>
        <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full mb-8" />
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
          Access virtual court sessions for DRT-1 and DRT-2. Stay connected with legal proceedings 
          from anywhere with our secure dynamic meeting links.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {courts.map((court) => (
          <AnimatedCard
            key={court.id}
            className="group relative overflow-hidden border-none shadow-xl bg-white transition-all duration-500 hover:-translate-y-2"
          >
            <div className={`absolute top-0 left-0 w-2 h-full ${court.color}`} />
            
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Judge Image */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-100 group-hover:border-primary/20 transition-colors duration-500">
                  <img
                    src={court.image}
                    alt={court.judge}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-zinc-100">
                  <Scale size={18} className="text-primary" />
                </div>
              </div>

              {/* Info & Button */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className={`text-sm font-bold ${court.accent} mb-1 tracking-wider uppercase`}>
                    {court.name}
                  </h4>
                  <h3 className="text-2xl font-bold text-zinc-900 leading-tight mb-1">
                    {court.judge}
                  </h3>
                  <p className="text-zinc-500 text-sm font-medium">
                    {court.designation}
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    size="lg"
                    className={`w-full md:w-auto px-8 py-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                      court.link 
                        ? `${court.color} hover:opacity-90 text-white shadow-lg shadow-${court.id === 'drt1' ? 'blue' : 'emerald'}-200` 
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                    }`}
                    onClick={() => court.link && window.open(court.link, "_blank")}
                    disabled={!court.link}
                  >
                    <Video size={20} />
                    {court.link ? "Join Meeting" : "Link Not Available"}
                    {court.link && <ExternalLink size={14} className="opacity-60" />}
                  </Button>
                  {!court.link && (
                    <p className="text-[10px] text-zinc-400 mt-2 italic">
                      * Link will be updated by admin monthly
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default MeetingSection;
