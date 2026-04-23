const Member = require("../models/Member");
const CommissionerQueue = require("../models/CommissionerQueue");

/**
 * Helper: Calculate experience in years from an enrollmentDate string.
 * Supports common date formats: "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY", "DD-MM-YYYY"
 */
const calculateExperience = (enrollmentDate) => {
  if (!enrollmentDate) return 0;
  let parsed = new Date(enrollmentDate);

  // Try DD/MM/YYYY or DD-MM-YYYY if standard parse fails
  if (isNaN(parsed.getTime())) {
    const parts = enrollmentDate.split(/[\/\-]/);
    if (parts.length === 3) {
      // Assume DD/MM/YYYY
      parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }

  if (isNaN(parsed.getTime())) return 0;

  const now = new Date();
  const diffMs = now - parsed;
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  return Math.max(0, years);
};

// ---------------------------------------------------------------------------
// POST /api/commissioners/init  — Admin only
// Fetch COP members, sort by experience DESC, rebuild queue
// ---------------------------------------------------------------------------
const initQueue = async (req, res) => {
  try {
    // Fetch all COP-eligible members
    const copMembers = await Member.find({ copStatus: true }).lean();

    if (copMembers.length === 0) {
      return res.status(200).json({ message: "No COP members found. Queue is empty.", count: 0 });
    }

    // Calculate experience and sort descending
    const membersWithExp = copMembers
      .map((m) => ({
        ...m,
        experience: calculateExperience(m.enrollmentDate),
      }))
      .sort((a, b) => b.experience - a.experience);

    // Clear existing queue
    await CommissionerQueue.deleteMany({});

    // Build new queue entries
    const queueEntries = membersWithExp.map((m, idx) => ({
      memberId: m._id,
      order: idx,
      assigned: false,
    }));

    await CommissionerQueue.insertMany(queueEntries);

    res.status(200).json({
      message: `Queue initialized with ${queueEntries.length} member(s).`,
      count: queueEntries.length,
    });
  } catch (error) {
    console.error("Error initializing commissioner queue:", error);
    res.status(500).json({ message: "Failed to initialize queue", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// GET /api/commissioners/next  — Admin or Editor
// Find first un-assigned member. If all assigned → auto-reset, return first.
// ---------------------------------------------------------------------------
const getNextCommissioner = async (req, res) => {
  try {
    // Find the first pending (assigned=false) entry in order
    let entry = await CommissionerQueue.findOne({ assigned: false }).sort({ order: 1 });

    if (!entry) {
      // All assigned → reset the cycle
      await CommissionerQueue.updateMany({}, { $set: { assigned: false } });
      entry = await CommissionerQueue.findOne({ assigned: false }).sort({ order: 1 });

      if (!entry) {
        return res.status(404).json({ message: "Queue is empty. Please initialize first." });
      }
    }

    // Mark as assigned
    entry.assigned = true;
    await entry.save();

    // Populate member details
    const member = await Member.findById(entry.memberId).lean();
    if (!member) {
      return res.status(404).json({ message: "Member not found in database." });
    }

    const experience = calculateExperience(member.enrollmentDate);

    res.status(200).json({
      _id: member._id,
      name: member.name,
      enrollmentNumber: member.enrollmentNumber,
      enrollmentDate: member.enrollmentDate,
      experience,
      copStatus: member.copStatus,
      status: member.status,
      queueOrder: entry.order,
      queueId: entry._id,
    });
  } catch (error) {
    console.error("Error getting next commissioner:", error);
    res.status(500).json({ message: "Failed to get next commissioner", error: error.message });
  }
};

// ---------------------------------------------------------------------------
// GET /api/commissioners  — Public / Any authenticated user
// List all COP members with experience and queue assignment status
// ---------------------------------------------------------------------------
const getCommissionerList = async (req, res) => {
  try {
    // Fetch all COP members
    const copMembers = await Member.find({ copStatus: true }).lean();

    // Fetch the current queue to get assignment statuses
    const queue = await CommissionerQueue.find().lean();
    const queueMap = {};
    queue.forEach((q) => {
      queueMap[q.memberId.toString()] = {
        assigned: q.assigned,
        order: q.order,
      };
    });

    // Build response with calculated experience
    const result = copMembers
      .map((m) => {
        const exp = calculateExperience(m.enrollmentDate);
        const queueInfo = queueMap[m._id.toString()];
        return {
          _id: m._id,
          name: m.name,
          enrollmentNumber: m.enrollmentNumber,
          enrollmentDate: m.enrollmentDate,
          experience: exp,
          copStatus: m.copStatus,
          memberStatus: m.status,
          assigned: queueInfo ? queueInfo.assigned : false,
          inQueue: !!queueInfo,
          queueOrder: queueInfo ? queueInfo.order : null,
        };
      })
      .sort((a, b) => b.experience - a.experience); // sort by exp desc

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching commissioner list:", error);
    res.status(500).json({ message: "Failed to fetch commissioner list", error: error.message });
  }
};

module.exports = { initQueue, getNextCommissioner, getCommissionerList };
