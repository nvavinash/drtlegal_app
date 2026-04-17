import React from "react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { CardContent } from "../ui/card";
import { User, Award, ShieldCheck, Scale } from "lucide-react";

// Import images correctly for Vite
import presidentImg from "../../assets/president.png";
// import vicePresidentImg from "../../assets/vice_president.png"; // If exists
import secretaryImg from "../../assets/seceratary.png";

const officeBearers = [
  {
    id: 1,
    name: "Sri. SUBBA RAJU N V",
    designation: "President",
    experience: "30+ Years",
    specialization: "Banking & Finance Law",
    image: presidentImg,
    icon: <Award className="text-amber-500" size={16} />,
  },
  {
    id: 2,
    name: "Sri. VENKATESHWARLU R",
    designation: "Vice President",
    experience: "25+ Years",
    specialization: "Corporate Law",
    image: presidentImg, // Placeholder until actual is uploaded
    icon: <ShieldCheck className="text-blue-500" size={16} />,
  },
  {
    id: 3,
    name: "Sri. RAVINDER V",
    designation: "General Secretary",
    experience: "15+ Years",
    specialization: "Civil Litigation",
    image: presidentImg, // Placeholder until actual is uploaded
    icon: <Award className="text-zinc-500" size={16} />,
  },
  {
    id: 4,
    name: "Sri. SRIKANTH REDDY Y",
    designation: "Treasurer",
    experience: "12+ Years",
    specialization: "Insolvency Law",
    image: presidentImg, // Placeholder until actual is uploaded
    icon: <ShieldCheck className="text-emerald-500" size={16} />,
  },
  {
    id: 5,
    name: "Smt. RAJESHWARI P",
    designation: "Lady Representative",
    experience: "12+ Years",
    specialization: "Family & Property Law",
    image: secretaryImg,
    icon: <Scale className="text-purple-500" size={16} />,
  },
];

const OfficeBearers = () => {
  return (
    <SectionWrapper id="office-bearers" className="bg-white">
      <div className="mb-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4 tracking-tight">Our Office Bearers</h2>
        <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full mb-6" />
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
          Dedicated leadership committed to representing the interests of our members 
          and upholding the highest legal standards.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 max-w-8xl mx-auto">
        {officeBearers.map((bearer) => (
          <AnimatedCard 
            key={bearer.id} 
            className="group relative overflow-hidden text-center border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-zinc-50/50 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)] xl:w-[calc(20%-2rem)] min-w-[220px]"
          >
            <CardContent className="pt-10 pb-8 px-4">
              {/* Image Container with Glow */}
              <div className="relative w-36 h-36 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
                <div className="relative w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-zinc-100 flex items-center justify-center">
                  {bearer.image ? (
                    <img
                      src={bearer.image}
                      alt={bearer.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <User size={50} className="text-zinc-300" />
                  )}
                </div>
                {/* Badge Icon */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border border-zinc-100">
                   {bearer.icon}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-black text-zinc-900 leading-tight group-hover:text-primary transition-colors duration-300 uppercase tracking-tighter">
                  {bearer.name}
                </h3>
                <p className="text-primary font-black text-[10px] tracking-[0.2em] uppercase">
                  {bearer.designation}
                </p>
              </div>

              {/* <div className="mt-6 pt-6 border-t border-zinc-200/60 transition-colors">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Experience</span>
                  <span className="text-sm font-bold text-zinc-700">{bearer.experience}</span>
                </div>
              </div> */}
            </CardContent>
          </AnimatedCard>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default OfficeBearers;
