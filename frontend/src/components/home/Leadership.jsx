import React from "react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { Quote, Send } from "lucide-react";

// Import demo assets
import presidentImg from "../../assets/president.png";
import secretaryImg from "../../assets/seceratary.jpeg";
import signatureImg from "../../assets/demo/signature.png";

const Leadership = () => {
  const leaders = [
    {
      id: "president",
      name: "Sri. SUBBA RAJU N V",
      designation: "President",
      image: presidentImg,
      message: "Our association is dedicated to providing robust legal support to advocates practicing in the Debt Recovery Tribunals. We strive to maintain the highest standards of professional ethics and facilitate a collaborative environment for legal excellence.",
    },
    {
      id: "secretary",
      name: "Sri. RAVINDER V",
      designation: "General Secretary",
      image: secretaryImg, 
      message: "Communication and transparency are the pillars of our association. We are committed to ensuring that every member has access to the latest updates, digital resources, and support needed for their legal practice.",
    },
  ];

  return (
    <SectionWrapper id="leadership" className="bg-white border-y border-zinc-100 py-24">
      <div className="mb-20 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-900 mb-6 tracking-tight uppercase">
          Association Leadership
        </h2>
        <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full mb-8" />
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg italic">
          "Dedicated to serving our members with integrity and professional excellence."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
        {leaders.map((leader, index) => (
          <AnimatedCard
            key={leader.id}
            className="group relative overflow-hidden border-none shadow-2xl bg-zinc-50/50 rounded-3xl p-1"
          >
            <div className="bg-white rounded-[calc(1.5rem-4px)] p-8 md:p-12 h-full flex flex-col items-center md:items-start text-center md:text-left">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 w-full">
                <div className="relative flex-shrink-0">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-zinc-50 shadow-xl">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary text-white p-3 rounded-full shadow-lg">
                    <Quote size={20} fill="currentColor" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                    {leader.name}
                  </h3>
                  <div className="inline-block px-4 py-1.5 bg-red-700 text-white rounded-lg text-md font-bold skew-x-[-10deg]">
                    <span className="block skew-x-[10deg]">{leader.designation}</span>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="relative flex-1 mb-10">
                <Quote 
                  size={60} 
                  className="absolute -top-6 -left-6 text-zinc-100 opacity-50 z-0" 
                />
                <p className="relative z-10 text-zinc-600 leading-relaxed text-lg mb-8">
                  {leader.message}
                </p>
              </div>

              {/* Footer Signature */}
              {/* <div className="w-full pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="max-w-[180px]">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-2">Signature</p>
                  <img
                    src={leader.signature}
                    alt="Signature"
                    className="w-full h-auto opacity-80 mix-blend-multiply"
                  />
                </div>
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span>Official Leadership Portfolios</span>
                </div>
              </div> */}
            </div>
          </AnimatedCard>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Leadership;
