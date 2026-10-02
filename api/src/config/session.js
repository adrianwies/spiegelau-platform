import "dotenv/config";


import session from "express-session";


import { sessionStore } from "./mysql-session-store.js";


const isProduction =
  process.env.NODE_ENV === "production";


if (!process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET no está configurado",
  );
}


export const sessionMiddleware = session({
  name: "spiegelau.sid",


  secret: process.env.SESSION_SECRET,


  store: sessionStore,


  resave: false,
  saveUninitialized: false,
  rolling: true,


  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",


    maxAge:
      1000 *
      60 *
      60 *
      8,
  },
});




