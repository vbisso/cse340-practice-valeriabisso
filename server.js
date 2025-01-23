// Add these imports to your existing imports
import { fileURLToPath } from "url";
import path from "path";
import express from "express";

// Create __dirname and __filename variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define important variables
const mode = process.env.MODE || "production";
const port = process.env.PORT || 3000;

// Create an instance of an Express application
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  const title = "Home Page";
  const content = "<h1>Welcome to the Home Page!!!!</h1>";
  const mode = process.env.MODE;
  const port = process.env.PORT;
  res.render("index", { title, content, mode, port });
});

app.get("/about", (req, res) => {
  const title = "About Page";
  const content = "<h1>About Page :))) </h1>";
  const mode = process.env.MODE;
  const port = process.env.PORT;
  res.render("about", { title, content, mode, port });
});
app.get("/contact", (req, res) => {
  const title = "Contact Page";
  const content = "<h1>Contact Page</h1>";
  const mode = process.env.MODE;
  const port = process.env.PORT;
  res.render("contact", { title, content, mode, port });
});
//explore page example
// app.get("/explore/:name/:age/:id", (req, res) => {
//   const name = req.params.name;
//   const age = req.params.age;
//   const id = req.params.id;
//   const title = "Explore Page";
//   const content = `<h1>Welcome to the Explore Page, ${name}</h1>`;
//   //res.send(content);
//   res.render("index", { title, content, mode, port });
//   //res.send("Check");
// });

// When in development mode, start a WebSocket server for live reloading
if (mode.includes("dev")) {
  const ws = await import("ws");

  try {
    const wsPort = parseInt(port) + 1;
    const wsServer = new ws.WebSocketServer({ port: wsPort });

    wsServer.on("listening", () => {
      console.log(`WebSocket server is running on port ${wsPort}`);
    });

    wsServer.on("error", (error) => {
      console.error("WebSocket server error:", error);
    });
  } catch (error) {
    console.error("Failed to start WebSocket server:", error);
  }
}

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
