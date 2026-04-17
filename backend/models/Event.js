const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    date: {
      type: Date,
      required: [true, "Please add a date"],
    },
    time: {
      type: String,
      required: [true, "Please add a time"],
    },
    location: {
      type: String,
      required: [true, "Please add a location"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Seminar", "Webinar", "Meeting", "Conference", "Social", "Other"],
      default: "Other",
    },
    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
