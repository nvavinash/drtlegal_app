import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Video, User, ExternalLink, Scale } from "lucide-react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { Button } from "../ui/button";

// Import demo images
import justiceAnilkumar from "../../assets/demo/justice_anil.png";
import judgeGopichand from "../../assets/demo/judge_gopichand.png";
import judgeKothe from "../../assets/demo/judge_kothe.png";

const MeetingSection = () => {
  const [links, setLinks] = useState({drat_link: "", drt1_link: "", drt2_link: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/virtual`);
        setLinks(res.data);
      } catch (err) {
        console.error("Failed to fetch meeting links", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const dratDetails = {
    id: "drat",
    name: "DRAT - Kolkata",
    title: "Debt Recovery Appellate Tribunal",
    judge: "JUSTICE ANIL K SRIVASTAVA",
    designation: "Hon'ble Chairperson",
    image: justiceAnilkumar, // Using existing import as placeholder
    link: links.drat_link || links.drat, // Support both formats just in case
    accent: "bg-amber-600",
    shadow: "shadow-amber-200",
  };

  const courts = [
    {
      id: "drt1",
      name: "DRT - 1 Hyderabad",
      title: "Debt Recovery Tribunal - I",
      judge: "SHRI GUMMADI GOPICHAND",
      designation: "Hon'ble Presiding Officer",
      image: judgeGopichand,
      link: links.drt1_link,
      accent: "bg-blue-600",
      shadow: "shadow-blue-200",
    },
    {
      id: "drt2",
      name: "DRT - 2 Hyderabad",
      title: "Debt Recovery Tribunal - II",
      judge: "SHRI RAMESHWAR KOTHE",
      designation: "Hon'ble Presiding Officer",
      image: judgeKothe,
      link: links.drt2_link,
      accent: "bg-emerald-600",
      shadow: "shadow-emerald-200",
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
          Access virtual court sessions for the Appellate Tribunal and Regional Tribunals. 
          Stay connected with legal proceedings from anywhere.
        </p>
      </div>
      {/* Appellate Tribunal Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-200" />
          <h3 className="text-xl font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
            <Scale size={20} className="text-primary" />
            Debts Recovery Appellate Tribunal
          </h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-200" />
        </div>

        <AnimatedCard
          key={dratDetails.id}
          className="group relative overflow-hidden border-none shadow-2xl bg-white transition-all duration-500 hover:-translate-y-2"
        >
          <div className={`absolute top-0 left-0 w-2 h-full bg-primary rounded-l-lg`} />
          
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
            <div className="relative flex-shrink-0">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-100 group-hover:border-red-600/20 transition-colors duration-500">
                <img
                  src={dratDetails.image}
                  alt={dratDetails.judge}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center border border-zinc-100">
                <Scale size={20} className="text-primary" />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase inline-flex items-center  rounded-full bg-primary/10 text-primary border border-primary/20 mb-4`}>
                  {dratDetails.name}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-2">
                  {dratDetails.judge}
                </h3>
                <p className="text-zinc-500 text-lg font-semibold tracking-wide">
                  {dratDetails.designation}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  size="lg"
                  className={`w-full md:w-auto px-10 py-7 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    dratDetails.link 
                      ? `bg-primary hover:opacity-90 text-white shadow-xl ` 
                      : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  }`}
                  onClick={() => dratDetails.link && window.open(dratDetails.link, "_blank")}
                  disabled={!dratDetails.link}
                >
                  <Video size={24} />
                  {dratDetails.link ? "Join Appellate Hearing" : "Link Not Available"}
                  {dratDetails.link && <ExternalLink size={18} className="opacity-70" />}
                </Button>
                {!dratDetails.link && (
                  <p className="text-xs text-zinc-400 mt-3 italic font-medium">
                    * Virtual link managed by DRAT administration
                  </p>
                )}
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Regional Tribunals Section */}
       <div className="max-w-5xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-200" />
          <h3 className="text-xl font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-3">
            <Scale size={20} className="text-primary" />
            Debts Recovery Tribunals
          </h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {courts.map((court) => (
            <AnimatedCard
              key={court.id}
              className="group relative overflow-hidden border-none shadow-xl bg-white transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`absolute top-0 left-0 w-2 h-full bg-primary rounded-l-lg`} />
              
              <div className="p-8 flex flex-col gap-6 items-center text-center">
                {/* Judge Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-zinc-100 group-hover:border-primary/20 transition-colors duration-500">
                    <img
                      src={court.image}
                      alt={court.judge}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Info & Button */}
                <div className="space-y-4 w-full">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary text-white mb-3`}>
                      {court.name}
                    </span>
                    <h3 className="text-xl font-bold text-zinc-900 leading-tight mb-1">
                      {court.judge}
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium">
                      {court.designation}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      className={`w-full py-6 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                        court.link 
                          ? `bg-primary hover:opacity-90 text-white shadow-lg ` 
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      }`}
                      onClick={() => court.link && window.open(court.link, "_blank")}
                      disabled={!court.link}
                    >
                      <Video size={18} />
                      {court.link ? "Join Session" : "Link Not Available"}
                      {court.link && <ExternalLink size={14} className="opacity-60" />}
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MeetingSection;
