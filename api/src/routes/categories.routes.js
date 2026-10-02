import { Router } from "express";
import { pool } from "../config/database.js";


const router = Router();


router.get("/", async (req, res) => {
  try {
    const [categories] = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description,
        visible,
        sort_order
      FROM categories
      ORDER BY sort_order ASC, name ASC
    `);


    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error obteniendo categorías:", error);


    res.status(500).json({
      success: false,
      message: "No se pudieron obtener las categorías",
    });
  }
});


export default router;




