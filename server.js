// Import required modules using ESM import syntax
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import all other required modules: Route handlers, Middleware, etc.
import baseRoute from "./src/routes/index.js";
import categoryRoute from "./src/routes/category/index.js";
import layouts from "./src/middleware/layouts.js";
//import staticPaths from "./src/middleware/static-paths.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./src/middleware/error-handler.js";
import {
  resLocals,
  configureNodeEnvironment,
} from "./src/middleware/node-env.js"; //resLocals import
import { liveReloading } from "./src/middleware/live-reloading.js";
import { setupDatabase } from "./src/database/index.js";
import configureStaticPaths from "./src/middleware/static-paths.js";
import fileUploads from "./src/middleware/file-upload.js";

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of an Express application
const app = express();

// Middleware to process multipart form data with file uploads
app.use(fileUploads);

// Middleware to parse JSON data in request body
app.use(express.json());

// Middleware to parse URL-encoded form data (like from a standard HTML form)
app.use(express.urlencoded({ extended: true }));

//apply res locals to insert scripts and styles dynamically
app.use(resLocals);
app.use(configureNodeEnvironment);
//apply middleware to live reload
app.use(liveReloading);

// Serve static files from the public directory
configureStaticPaths(app);
// app.use("/css", express.static(path.join(__dirname, "public/css")));
// app.use("/js", express.static(path.join(__dirname, "public/js")));
// app.use("/images", express.static(path.join(__dirname, "public/images")));

// Set EJS as the view engine and record the location of the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Set Layouts middleware to automatically wrap views in a layout and configure default layout
app.set("layout default", "default");
app.set("layouts", path.join(__dirname, "src/views/layouts"));
app.use(layouts);

// Use the home route for the root URL
app.use("/", baseRoute);
//about route for the /about URL
app.use("/about", baseRoute);
//category route
app.use("/category", categoryRoute);

// Apply error handlers

app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await setupDatabase(); // Initialize the database
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
