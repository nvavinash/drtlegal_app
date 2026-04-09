import React from "react";
import SectionWrapper from "../components/SectionWrapper";

const Members = () => {
  return (
    <SectionWrapper>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Member Directory</h1>
        <p className="text-zinc-500">A directory of registered advocates and members.</p>
        <div className="mt-8 p-12 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-300">
          The directory is being updated. Please check back later.
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Members;
