import "dotenv/config";


import express from "express";
import cors from "cors";


import { pool } from "./src/config/database.js";
import { sessionMiddleware } from "./src/config/session.js";


import authRoutes from "./src/routes/auth.routes.js";
import productsRoutes from "./src/routes/products.routes.js";
import categoriesRoutes from "./src/routes/categories.routes.js";
import collectionsRoutes from "./src/routes/collections.routes.js";


const app = express();


const PORT =
  process.env.PORT || 3000;


if (
  process.env.NODE_ENV ===
  "production"
) {
  app.set("trust proxy", 1);
}


app.use(
  cors({
    origin:
      "http://localhost:5173",


    credentials: true,
  }),
);


app.use(express.json());


app.use(sessionMiddleware);


app.get(
  "/api/health",
  async (req, res) => {
    try {
      await pool.query("SELECT 1");


      res.json({
        success: true,
        api: "online",
        database: "connected",
      });
    } catch (error) {
      console.error(
        "Database error:",
        error,
      );


      res.status(500).json({
        success: false,
        api: "online",
        database: "disconnected",
      });
    }
  },
);


app.use(
  "/api/auth",
  authRoutes,
);


app.use(
  "/api/products",
  productsRoutes,
);


app.use(
  "/api/categories",
  categoriesRoutes,
);


app.use(
  "/api/collections",
  collectionsRoutes,
);


app.listen(
  PORT,
  () => {
    console.log(
      `Spiegelau API running on http://localhost:${PORT}`,
    );
  },
);




