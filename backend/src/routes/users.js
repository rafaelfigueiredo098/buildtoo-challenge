const express = require("express");

const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {

  try {

    const search = req.query.search || "";

    const users = await User.find({

      $or: [

        { name: { $regex: search, $options: "i" } },

        { email: { $regex: search, $options: "i" } },

      ],

    }).sort({ name: 1 });

    res.json(users);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch users" });

  }

});

module.exports = router;