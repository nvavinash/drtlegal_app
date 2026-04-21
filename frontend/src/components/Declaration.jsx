import { useState } from "react";

export default function Declaration() {
  const [checked, setChecked] = useState(false);

  return (
    <div >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 w-full">

        {/* Title */}
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800 mb-3">
          Declaration
        </h3>

        {/* Declaration Text */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          I hereby declare that the above given information is{" "}
          <strong className="text-gray-900">true and correct</strong>. I hereby undertakes to abide by the Rules and Regulation and Bye-Laws of the DRT Advocates Association, DEBT RECOVERY TRIBUNAL, HYDERABAD. <br />
          I, request you to kindly admit me as a Member of the DRT Advocates Association and oblige.  
        </p>

        {/* Checkbox Row */}
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          <input
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />

          {/* Custom Box */}
          <div className={`mt-0.5 w-5 h-5 min-w-[20px] rounded border-2 flex items-center 
            justify-center transition-all duration-200
            ${checked ? "bg-teal-700 border-teal-700" 
                      : "bg-white border-gray-300 group-hover:border-teal-500"}`}>
            {checked && (
              <svg viewBox="0 0 13 13" fill="none" className="w-3 h-3">
                <path d="M2 6.5L5.5 10L11 3" stroke="white"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {/* Label */}
          <span className="text-sm text-gray-600 leading-relaxed">
            I <span className="font-semibold text-gray-900">agree</span> and
            confirm the above declaration is true and correct.
          </span>
        </label>

        {/* Confirmation */}
        {checked && (
          <p className="mt-4 text-sm font-medium text-teal-700">
            ✅ Declaration accepted. Thank you!
          </p>
        )}
      </div>
    </div>
  );
}
