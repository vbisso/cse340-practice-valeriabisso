const mode = process.env.MODE || "production";
const port = process.env.PORT || 3000;

export const liveReloading = (req, res, next) => {
  res.locals.isDevMode = mode.includes("dev");
  res.locals.devModeMsg =
    '<p class="dev-mode-msg"> Warning: Development Mode Enabled</p>';

  //adds script in dev mode only
  if (res.locals.isDevMode) {
    res.locals.scripts.push(`<script>
      const ws = new WebSocket("ws://localhost:${parseInt(port) + 1}");

      ws.onclose = () => {
          setTimeout(() => location.reload(), 2000);
      };
    </script>`);
  }
  next();
};

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
