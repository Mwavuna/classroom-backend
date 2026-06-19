import express, { Request, Response } from "express";
import cors from "cors";
import subjectsRouter from "./routes/subjects";
const app = express();
const PORT = 8000;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL is required");
}
// JSON middleware to parse incoming requests with JSON payloads
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use("/api/subjects", subjectsRouter);
// Root GET route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to the University Subjects API!" });
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`🚀 Server is running successfully.`);
  console.log(`🔗 Local URL: http://localhost:${PORT}`);
});
