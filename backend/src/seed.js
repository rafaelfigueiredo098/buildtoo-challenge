//Adicionar dados na bd

const mongoose = require("mongoose");

require("dotenv").config();

const User = require("./models/User");

const users = [

  {
    name: "Rafael Figueiredo",
    email: "rafael@example.com",
  },

  {
    name: "Ana Silva",
    email: "ana@example.com",
  },

  {
    name: "João Santos",
    email: "joao@example.com",
  },

  {
    name: "Maria Costa",
    email: "maria@example.com",
  },

  {
    name: "Pedro Almeida",
    email: "pedro@example.com",
  },

];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});
    await User.insertMany(users);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();