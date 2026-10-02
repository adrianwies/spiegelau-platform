import { Router } from "express";
import { pool } from "../config/database.js";


const router = Router();


router.get("/", async (req, res) => {
  try {
    /*
     * Productos + categoría + colección
     */
    const [products] = await pool.query(`
      SELECT
        p.id,
        p.sku,
        p.slug,
        p.name,
        p.channel,


        p.category_id,
        cat.name AS category_name,
        cat.slug AS category_slug,


        p.collection_id,
        col.name AS collection_name,
        col.slug AS collection_slug,


        p.presentation,


        p.price,
        p.offer_price,
        p.stock,


        p.featured,
        p.is_new,
        p.offer,
        p.visible,
        p.status,


        p.created_at,
        p.updated_at,
        p.published_at,


        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.id
          ORDER BY pi.position ASC, pi.id ASC
          LIMIT 1
        ) AS primary_image


      FROM products p


      LEFT JOIN categories cat
        ON cat.id = p.category_id


      LEFT JOIN collections col
        ON col.id = p.collection_id


      ORDER BY p.id ASC
    `);


    /*
     * Transformamos el resultado para que el frontend
     * reciba objetos más limpios.
     */
    const formattedProducts = products.map((product) => ({
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      name: product.name,
      channel: product.channel,


      category: product.category_id
        ? {
            id: product.category_id,
            name: product.category_name,
            slug: product.category_slug,
          }
        : null,


      collection: product.collection_id
        ? {
            id: product.collection_id,
            name: product.collection_name,
            slug: product.collection_slug,
          }
        : null,


      presentation: product.presentation,


      price: Number(product.price),
      offerPrice:
        product.offer_price !== null
          ? Number(product.offer_price)
          : null,


      stock: product.stock,


      featured: Boolean(product.featured),
      new: Boolean(product.is_new),
      offer: Boolean(product.offer),
      visible: Boolean(product.visible),


      status: product.status,


      primaryImage: product.primary_image,


      createdAt: product.created_at,
      updatedAt: product.updated_at,
      publishedAt: product.published_at,
    }));


    res.json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error(
      "Error obteniendo productos:",
      error,
    );


    res.status(500).json({
      success: false,
      message: "No se pudieron obtener los productos",
    });
  }
});
function parseJson(value, fallback = []) {
  if (value == null) {
    return fallback;
  }


  if (typeof value === "object") {
    return value;
  }


  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;


    const [rows] = await pool.execute(
      `
        SELECT
          p.id,
          p.sku,
          p.slug,
          p.name,
          p.channel,


          p.category_id,
          cat.name AS category_name,
          cat.slug AS category_slug,


          p.collection_id,
          col.name AS collection_name,
          col.slug AS collection_slug,


          p.presentation,
          p.short_description,
          p.description,


          p.specifications,
          p.recommended_for,


          p.price,
          p.offer_price,
          p.stock,


          p.featured,
          p.is_new,
          p.offer,
          p.visible,


          p.status,
          p.created_at,
          p.updated_at,
          p.published_at


        FROM products p


        LEFT JOIN categories cat
          ON cat.id = p.category_id


        LEFT JOIN collections col
          ON col.id = p.collection_id


        WHERE p.id = ?


        LIMIT 1
      `,
      [id],
    );


    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }


    const product = rows[0];


    const [images] = await pool.execute(
      `
        SELECT
          id,
          image_url,
          alt_text,
          position
        FROM product_images
        WHERE product_id = ?
        ORDER BY position ASC, id ASC
      `,
      [id],
    );


    res.json({
      success: true,


      product: {
        id: product.id,
        sku: product.sku,
        slug: product.slug,
        name: product.name,
        channel: product.channel,


        category: product.category_id
          ? {
              id: product.category_id,
              name: product.category_name,
              slug: product.category_slug,
            }
          : null,


        collection: product.collection_id
          ? {
              id: product.collection_id,
              name: product.collection_name,
              slug: product.collection_slug,
            }
          : null,


        presentation: product.presentation,


        shortDescription:
          product.short_description,


        description:
          product.description,


        specifications:
          parseJson(product.specifications),


        recommendedFor:
          parseJson(product.recommended_for),


        price: Number(product.price),


        offerPrice:
          product.offer_price !== null
            ? Number(product.offer_price)
            : null,


        stock: product.stock,


        featured: Boolean(product.featured),
        new: Boolean(product.is_new),
        offer: Boolean(product.offer),
        visible: Boolean(product.visible),


        status: product.status,


        images: images.map((image) => ({
          id: image.id,
          imageUrl: image.image_url,
          altText: image.alt_text,
          position: image.position,
        })),


        createdAt: product.created_at,
        updatedAt: product.updated_at,
        publishedAt: product.published_at,
      },
    });
  } catch (error) {
    console.error(
      "Error obteniendo producto:",
      error,
    );


    res.status(500).json({
      success: false,
      message: "No se pudo obtener el producto",
    });
  }
});






export default router;




