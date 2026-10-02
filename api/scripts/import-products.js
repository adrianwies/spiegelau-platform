import "dotenv/config";


import { readFile } from "node:fs/promises";
import { resolve } from "node:path";


import { pool } from "../src/config/database.js";
import {
  createProductSlug,
  normalizeSlug,
} from "../src/utils/product-slugs.js";


const productsPath = resolve(
  process.cwd(),
  "../../lcgroup-web/src/data/products.json",
);


/*
 * =========================================================
 * NORMALIZACIÓN
 * =========================================================
 */


function normalizeCollectionName(name = "") {
  const value = String(name).trim().toUpperCase();


  const aliases = {
    DIFINITION: "DEFINITION",
  };


  return aliases[value] ?? value;
}


function normalizeCategoryName(name = "") {
  return String(name).trim().toLowerCase();
}


/*
 * =========================================================
 * CATEGORÍAS
 * =========================================================
 */


async function prepareCategories(connection, products) {
  /*
   * Sacamos solamente categorías únicas.
   *
   * Ejemplo:
   *
   * copas
   * copas
   * copas
   * vasos
   *
   * termina siendo:
   *
   * copas
   * vasos
   */
  const uniqueCategories = [
    ...new Set(
      products
        .map((product) =>
          normalizeCategoryName(product.category),
        )
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));


  /*
   * Cargamos las que ya existen.
   * Esto permite volver a ejecutar el importador
   * sin hacer INSERT innecesarios.
   */
  const [existingCategories] = await connection.query(`
    SELECT
      id,
      name,
      slug
    FROM categories
  `);


  const categoryIds = new Map(
    existingCategories.map((category) => [
      category.slug,
      category.id,
    ]),
  );


  /*
   * Insertamos únicamente las que todavía
   * no están en la base de datos.
   */
  for (const categoryName of uniqueCategories) {
    const slug = normalizeSlug(categoryName);


    if (categoryIds.has(slug)) {
      continue;
    }


    const [result] = await connection.execute(
      `
        INSERT INTO categories (
          name,
          slug
        )
        VALUES (?, ?)
      `,
      [
        categoryName,
        slug,
      ],
    );


    categoryIds.set(slug, result.insertId);
  }


  return categoryIds;
}


/*
 * =========================================================
 * COLECCIONES
 * =========================================================
 */


async function prepareCollections(connection, products) {
  const uniqueCollections = [
    ...new Set(
      products
        .map((product) =>
          normalizeCollectionName(product.collection),
        )
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));


  const [existingCollections] = await connection.query(`
    SELECT
      id,
      name,
      slug
    FROM collections
  `);


  const collectionIds = new Map(
    existingCollections.map((collection) => [
      collection.slug,
      collection.id,
    ]),
  );


  for (const collectionName of uniqueCollections) {
    const slug = normalizeSlug(collectionName);


    if (collectionIds.has(slug)) {
      continue;
    }


    const [result] = await connection.execute(
      `
        INSERT INTO collections (
          name,
          slug
        )
        VALUES (?, ?)
      `,
      [
        collectionName,
        slug,
      ],
    );


    collectionIds.set(slug, result.insertId);
  }


  return collectionIds;
}


/*
 * =========================================================
 * IMPORTADOR
 * =========================================================
 */


async function importProducts() {
  let connection;


  try {
    console.log("");
    console.log("Leyendo productos desde:");
    console.log(productsPath);
    console.log("");


    const content = await readFile(
      productsPath,
      "utf8",
    );


    const products = JSON.parse(content);


    console.log(
      `Productos encontrados: ${products.length}`,
    );


    connection = await pool.getConnection();


    await connection.beginTransaction();


    /*
     * =====================================================
     * 1. PREPARAR CATEGORÍAS
     * =====================================================
     */


    const categoryIds = await prepareCategories(
      connection,
      products,
    );


    console.log(
      `Categorías encontradas: ${categoryIds.size}`,
    );


    /*
     * =====================================================
     * 2. PREPARAR COLECCIONES
     * =====================================================
     */


    const collectionIds = await prepareCollections(
      connection,
      products,
    );


    console.log(
      `Colecciones encontradas: ${collectionIds.size}`,
    );


    console.log("");
    console.log("Importando productos...");
    console.log("");


    /*
     * =====================================================
     * 3. IMPORTAR PRODUCTOS
     * =====================================================
     */


    for (const product of products) {
      /*
       * Categoría
       */
      const categoryName =
        normalizeCategoryName(product.category);


      const categorySlug =
        normalizeSlug(categoryName);


      const categoryId =
        categoryIds.get(categorySlug) ?? null;


      /*
       * Colección
       */
      const collectionName =
        normalizeCollectionName(product.collection);


      const collectionSlug =
        normalizeSlug(collectionName);


      const collectionId = collectionName ? collectionIds.get(collectionSlug) ?? null : null;





      /*
       * Comprobaciones de seguridad
       */
      if (!categoryId) {
        throw new Error(
          `No se encontró category_id para "${product.category}" en producto ${product.id}`,
        );
      }


      /*
       * Slug del producto.
       *
       * Solo se usa para crear inicialmente el producto.
       * En ON DUPLICATE KEY UPDATE NO modificamos slug
       * para mantener URLs estables para SEO.
       */
      const slug = createProductSlug(
        product,
        products,
      );


      /*
       * Estado
       */
      const status =
        product.visible === false
          ? "draft"
          : "published";


      /*
       * ===================================================
       * INSERT / UPDATE PRODUCTO
       * ===================================================
       */


      await connection.execute(
        `
          INSERT INTO products (
            id,
            sku,
            slug,
            name,
            channel,


            category_id,
            collection_id,


            presentation,
            short_description,
            description,


            specifications,
            recommended_for,


            price,
            offer_price,
            stock,


            featured,
            is_new,
            offer,
            visible,


            status,
            published_at
          )


          VALUES (
            ?, ?, ?, ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, ?,
            ?, ?, ?,
            ?, ?, ?, ?,
            ?, ?
          )


          ON DUPLICATE KEY UPDATE


            sku = VALUES(sku),


            name = VALUES(name),
            channel = VALUES(channel),


            category_id = VALUES(category_id),
            collection_id = VALUES(collection_id),


            presentation = VALUES(presentation),


            short_description =
              VALUES(short_description),


            description =
              VALUES(description),


            specifications =
              VALUES(specifications),


            recommended_for =
              VALUES(recommended_for),


            price = VALUES(price),


            offer_price =
              VALUES(offer_price),


            stock = VALUES(stock),


            featured = VALUES(featured),


            is_new = VALUES(is_new),


            offer = VALUES(offer),


            visible = VALUES(visible),


            status = VALUES(status)
        `,
        [
          product.id,


          product.sku,


          slug,


          product.name,


          product.channel ?? null,


          categoryId,


          collectionId,


          product.presentation ?? null,


          product.shortDescription ?? null,


          product.description ?? null,


          JSON.stringify(
            product.specifications ?? [],
          ),


          JSON.stringify(
            product.recommendedFor ?? [],
          ),


          Number(product.price ?? 0),


          product.offerPrice != null
            ? Number(product.offerPrice)
            : null,


          Number(product.stock ?? 0),


          product.featured ? 1 : 0,


          product.new ? 1 : 0,


          product.offer ? 1 : 0,


          product.visible === false
            ? 0
            : 1,


          status,


          status === "published"
            ? new Date()
            : null,
        ],
      );


      /*
       * ===================================================
       * GALERÍA
       * ===================================================
       *
       * Eliminamos las imágenes anteriores para que
       * volver a ejecutar el importador no las duplique.
       */


      await connection.execute(
        `
          DELETE FROM product_images
          WHERE product_id = ?
        `,
        [product.id],
      );


      const gallery =
        Array.isArray(product.gallery)
          ? product.gallery
          : [];


      for (
        let position = 0;
        position < gallery.length;
        position += 1
      ) {
        const image = gallery[position];


        if (!image?.image) {
          continue;
        }


        await connection.execute(
          `
            INSERT INTO product_images (
              product_id,
              image_url,
              alt_text,
              position
            )


            VALUES (?, ?, ?, ?)
          `,
          [
            product.id,


            image.image,


            image.alt ?? null,


            position,
          ],
        );
      }


      console.log(
        `✓ ${product.id} - ${product.name}`,
      );
    }


    /*
     * =====================================================
     * CONFIRMAR TRANSACCIÓN
     * =====================================================
     */


    await connection.commit();


    console.log("");
    console.log(
      "==========================================",
    );


    console.log(
      "Importación completada correctamente",
    );


    console.log(
      `Productos procesados: ${products.length}`,
    );


    console.log(
      `Categorías: ${categoryIds.size}`,
    );


    console.log(
      `Colecciones: ${collectionIds.size}`,
    );


    console.log(
      "==========================================",
    );


    console.log("");
  } catch (error) {
    /*
     * Si algo falla a mitad de proceso,
     * deshacemos TODA la importación.
     */
    if (connection) {
      await connection.rollback();
    }


    console.error("");
    console.error(
      "Error importando productos:",
    );


    console.error(error);


    process.exitCode = 1;
  } finally {
    connection?.release();


    await pool.end();
  }
}


importProducts();




