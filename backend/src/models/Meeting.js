const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(

  {

    user: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    status: {

      type: String,

      enum: ["pending", "accepted", "declined"],

      default: "pending",

    },

  },

  { _id: false }

);

const meetingSchema = new mongoose.Schema(

  {

    title: {

      type: String,

      required: true,

      trim: true,

    },

    description: {

      type: String,

      default: "",

      trim: true,

    },

    startAt: {

      type: Date,

      required: true,

    },

    organizer: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    participants: [participantSchema],

  },

  { timestamps: true }

);

module.exports = mongoose.model("Meeting", meetingSchema);