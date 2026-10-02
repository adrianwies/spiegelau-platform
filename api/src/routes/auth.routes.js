import { Router } from "express";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";


import { pool } from "../config/database.js";


const router = Router();


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,


  standardHeaders: "draft-8",
  legacyHeaders: false,


  message: {
    success: false,
    message:
      "Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde.",
  },
});


router.post(
  "/login",
  loginLimiter,
  async (req, res) => {
    try {
      const username = String(
        req.body?.username ?? "",
      )
        .trim()
        .toLowerCase();


      const password = String(
        req.body?.password ?? "",
      );


      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Usuario y contraseña son obligatorios",
        });
      }


      const [rows] = await pool.execute(
        `
          SELECT
            id,
            name,
            username,
            password_hash,
            active
          FROM admin_users
          WHERE username = ?
          LIMIT 1
        `,
        [username],
      );


      const user = rows[0];


      if (!user || !user.active) {
        return res.status(401).json({
          success: false,
          message:
            "Usuario o contraseña incorrectos",
        });
      }


      const validPassword =
        await bcrypt.compare(
          password,
          user.password_hash,
        );


      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message:
            "Usuario o contraseña incorrectos",
        });
      }


      await new Promise(
        (resolve, reject) => {
          req.session.regenerate((error) => {
            if (error) {
              reject(error);
              return;
            }


            resolve();
          });
        },
      );


      req.session.user = {
        id: user.id,
        name: user.name,
        username: user.username,
      };


      await new Promise(
        (resolve, reject) => {
          req.session.save((error) => {
            if (error) {
              reject(error);
              return;
            }


            resolve();
          });
        },
      );


      await pool.execute(
        `
          UPDATE admin_users
          SET last_login_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
        [user.id],
      );


      res.json({
        success: true,
        user: req.session.user,
      });
    } catch (error) {
      console.error(
        "Error iniciando sesión:",
        error,
      );


      res.status(500).json({
        success: false,
        message:
          "No se pudo iniciar sesión",
      });
    }
  },
);


router.get("/me", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({
      success: false,
      message:
        "No hay una sesión activa",
    });
  }


  res.json({
    success: true,
    user: req.session.user,
  });
});


router.post("/logout", (req, res) => {
  if (!req.session) {
    return res.json({
      success: true,
    });
  }


  req.session.destroy((error) => {
    if (error) {
      console.error(
        "Error cerrando sesión:",
        error,
      );


      return res.status(500).json({
        success: false,
        message:
          "No se pudo cerrar la sesión",
      });
    }


    res.clearCookie("spiegelau.sid", {
      httpOnly: true,


      secure:
        process.env.NODE_ENV ===
        "production",


      sameSite: "lax",
      path: "/",
    });


    res.json({
      success: true,
    });
  });
});


export default router;




