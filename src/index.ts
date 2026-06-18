import express, { Request, Response } from "express";

const app = express();
const PORT = 8000;

// JSON middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Root GET route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the University Subjects API!" });
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`🚀 Server is running successfully.`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
});
