import React from "react";
import SectionWrapper from "../SectionWrapper";
import AnimatedCard from "../AnimatedCard";
import { CardContent } from "../ui/card";
import { Gavel, ScrollText, Users, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    {
      title: "Events",
      description: "Upcoming seminars, workshops, and association gatherings.",
      icon: <Gavel size={32} />,
      path: "/events",
      color: "bg-red-50 text-red-600",
    },
    {
      title: "Notices",
      description: "Official notifications and circulars from the Tribunal.",
      icon: <ScrollText size={32} />,
      path: "/notices",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Members Directory",
      description: "Connect with our community of professional advocates.",
      icon: <Users size={32} />,
      path: "/members",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Judiciary Resources",
      description: "Access important legal documents and case resources.",
      icon: <Scale size={32} />,
      path: "/notices",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <SectionWrapper id="quick-links" className="bg-white">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-2 text-zinc-900">Quick Resources</h2>
        <p className="text-zinc-500">Essential links for our advocates and members.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {links.map((link, index) => (
          <AnimatedCard
            key={index}
            onClick={() => navigate(link.path)}
            className="border border-zinc-100 hover:border-zinc-200"
          >
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
              <div className={`p-4 rounded-2xl mb-6 ${link.color} transition-transform duration-300 group-hover:scale-110`}>
                {link.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-900">{link.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {link.description}
              </p>
            </CardContent>
          </AnimatedCard>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default QuickLinks;
