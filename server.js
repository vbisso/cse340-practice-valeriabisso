// Import express using ESM syntax
import express from "express";

// Create an instance of an Express application
const app = express();
const name = process.env.NAME; //process = global object. It takes the name from the .env file

// Define a route handler for the root URL ('/')
app.get("/", (req, res) => {
  res.send(`Hello, ${name}!`);
});

app.get("/about", (req, res) => {
  res.send(
    "I was born in February 22th so I'm a piscis! :) I love to read, eat and sleep! I'm currently watching Naruto for the first time! My favorite characters at the moment are Naruto, Kakashi, Hinata and Neji <3"
  );
});

// Define the port number the server will listen on
const PORT = 3000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
