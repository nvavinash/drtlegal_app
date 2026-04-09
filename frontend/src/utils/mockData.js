// Mock data for Events and Circulars
// Each item has: id, title, type ('event' | 'circular'), date, description, and optional pdfUrl

export const events = [
  {
    id: 'e1',
    title: "National Webinar on New Labor Codes",
    type: 'event',
    date: "2026-04-15",
    time: "10:30 AM",
    description: "Join us for an in-depth discussion on the upcoming labor code changes in India.",
    pdfUrl: "#",
  },
  {
    id: 'e2',
    title: "Regional Bar Council Conference",
    type: 'event',
    date: "2026-04-22",
    time: "02:00 PM",
    description: "Annual conference for legal practitioners in the Hyderabad region.",
    pdfUrl: "#",
  },
  {
    id: 'e3',
    title: "Legal Aid Camp at Uppal",
    type: 'event',
    date: "2026-05-01",
    time: "11:00 AM",
    description: "Voluntary legal aid camp to assist local residents with legal documentation.",
  },
];

export const circulars = [
  {
    id: 'c1',
    title: "Circular No. 12/2026: Court Timing Changes",
    type: 'circular',
    date: "2026-04-08",
    description: "Official notification regarding updated tribunal timings for the summer season.",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Placeholder PDF
  },
  {
    id: 'c2',
    title: "Notice regarding E-Filing System Downtime",
    type: 'circular',
    date: "2026-04-07",
    description: "Scheduled maintenance for the electronic filing portal on April 12th.",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 'c3',
    title: "Revised Membership Fee Structure 2026-27",
    type: 'circular',
    date: "2026-04-05",
    description: "Details of the updated annual membership fees for the new financial year.",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
  {
    id: 'c4',
    title: "Protocol for Physical Hearings",
    type: 'circular',
    date: "2026-03-25",
    description: "Guidelines to be followed for physical presence in courtrooms.",
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },
];

// Helper to get combined top announcements
export const getLatestAnnouncements = () => {
  const topEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 2);
  const topCirculars = [...circulars].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  return [...topEvents, ...topCirculars];
};
