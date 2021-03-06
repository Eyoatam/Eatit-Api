import express, { NextFunction, Request, Response } from "express";
import { connectToDatabase } from "services/database";
import { foodsRouter, sharedFoodsRouter } from "routes/index";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";

// setup express server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
config();
setupServer();

async function setupServer() {
  try {
    app.get("/", (_req: Request, res: Response, _next: NextFunction) => {
      res.status(200).json({
        message: "You are on the home endpoint go to /foods to view foods",
      });
    });
    app.use("/foods", foodsRouter);
    app.use("/sharedFoods", sharedFoodsRouter);
    // 404 Handler
    app.use((_req, res, _next) => {
      res.status(404).json({
        error: {
          message: "Not Found",
        },
      });
    });
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
    await connectToDatabase();
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
