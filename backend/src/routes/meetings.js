const express = require("express");

const Meeting = require("../models/Meeting");

const router = express.Router();

const MEETING_DURATION_MS = 60 * 60 * 1000;

// Get meetings for a user

router.get("/", async (req, res) => {

  try {

    const { userId } = req.query;

    const meetings = await Meeting.find({

      $or: [

        { organizer: userId },

        { "participants.user": userId },

      ],

    })

      .populate("organizer", "name email")

      .populate("participants.user", "name email")

      .sort({ startAt: 1 });

    res.json(meetings);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch meetings" });

  }

});

// Get meeting details

router.get("/:id", async (req, res) => {

  try {

    const meeting = await Meeting.findById(req.params.id)

      .populate("organizer", "name email")

      .populate("participants.user", "name email");

    if (!meeting) {

      return res.status(404).json({ message: "Meeting not found" });

    }

    res.json(meeting);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch meeting" });

  }

});

// Create meeting

router.post("/", async (req, res) => {

  try {

    const { title, description, startAt, organizer, participantIds } = req.body;

    if (!title || !startAt || !organizer) {

      return res.status(400).json({

        message: "Title, start time and organizer are required",

      });

    }

    const meeting = await Meeting.create({

      title,

      description,

      startAt,

      organizer,

      participants: (participantIds || []).map((userId) => ({

        user: userId,

        status: "pending",

      })),

    });

    res.status(201).json(meeting);

  } catch (error) {

    res.status(400).json({ message: "Failed to create meeting" });

  }

});

// Accept or decline invitation

router.patch("/:id/invitations/:userId", async (req, res) => {

  try {

    const { status } = req.body;

    const { id, userId } = req.params;

    if (!["accepted", "declined"].includes(status)) {

      return res.status(400).json({ message: "Invalid invitation status" });

    }

    const meeting = await Meeting.findById(id);

    if (!meeting) {

      return res.status(404).json({ message: "Meeting not found" });

    }

    const participant = meeting.participants.find(

      (item) => item.user.toString() === userId

    );

    if (!participant) {

      return res.status(404).json({ message: "Invitation not found" });

    }


    // Rule: a user cannot accept overlapping meetings.

    if (status === "accepted") {

      const requestedStart = new Date(meeting.startAt);

      const requestedEnd = new Date(

        requestedStart.getTime() + MEETING_DURATION_MS

      );

      const acceptedMeetings = await Meeting.find({

        _id: { $ne: meeting._id },

        participants: {

          $elemMatch: {

            user: userId,

            status: "accepted",

          },

        },

      });

      const hasConflict = acceptedMeetings.some((acceptedMeeting) => {

        const existingStart = new Date(acceptedMeeting.startAt);

        const existingEnd = new Date(

          existingStart.getTime() + MEETING_DURATION_MS

        );

        return requestedStart < existingEnd && requestedEnd > existingStart;

      });

      if (hasConflict) {

        return res.status(409).json({

          message: "You already have an accepted meeting at this time.",

        });

      }

    }

    participant.status = status;

    await meeting.save();

    const updatedMeeting = await Meeting.findById(id)

      .populate("organizer", "name email")

      .populate("participants.user", "name email");

    res.json(updatedMeeting);

  } catch (error) {

    res.status(500).json({ message: "Failed to update invitation" });

  }

});

module.exports = router;