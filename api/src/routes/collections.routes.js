import { Router } from "express";
import { pool } from "../config/database.js";


const router = Router();


router.get("/", async (req, res) => {
  try {
    const [collections] = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description,
        visible,
        sort_order
      FROM collections
      ORDER BY sort_order ASC, name ASC
    `);


    res.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("Error obteniendo colecciones:", error);


    res.status(500).json({
      success: false,
      message: "No se pudieron obtener las colecciones",
    });
  }
});


export default router;




