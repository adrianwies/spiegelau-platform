import "dotenv/config";


import bcrypt from "bcryptjs";


import { pool } from "../src/config/database.js";


async function createAdmin() {
  try {
    const name = String(
      process.env.ADMIN_NAME ?? "",
    ).trim();


    const username = String(
      process.env.ADMIN_USERNAME ?? "",
    )
      .trim()
      .toLowerCase();


    const password = String(
      process.env.ADMIN_PASSWORD ?? "",
    );


    if (
      !name ||
      !username ||
      !password
    ) {
      throw new Error(
        "Faltan ADMIN_NAME, ADMIN_USERNAME o ADMIN_PASSWORD",
      );
    }


    if (
      !/^[a-z0-9._-]{3,50}$/.test(
        username,
      )
    ) {
      throw new Error(
        "El usuario debe tener entre 3 y 50 caracteres y usar solo letras, números, punto, guion o guion bajo",
      );
    }


    if (password.length < 12) {
      throw new Error(
        "La contraseña debe tener al menos 12 caracteres",
      );
    }


    const [existing] =
      await pool.execute(
        `
          SELECT id
          FROM admin_users
          WHERE username = ?
          LIMIT 1
        `,
        [username],
      );


    if (existing.length > 0) {
      throw new Error(
        "Ya existe un administrador con ese usuario",
      );
    }


    const passwordHash =
      await bcrypt.hash(
        password,
        12,
      );


    await pool.execute(
      `
        INSERT INTO admin_users (
          name,
          username,
          password_hash,
          active
        )
        VALUES (?, ?, ?, TRUE)
      `,
      [
        name,
        username,
        passwordHash,
      ],
    );


    console.log("");
    console.log(
      "Administrador creado correctamente.",
    );


    console.log(
      `Nombre: ${name}`,
    );


    console.log(
      `Usuario: ${username}`,
    );


    console.log("");
  } catch (error) {
    console.error("");
    console.error(
      "Error creando administrador:",
    );


    console.error(
      error.message,
    );


    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}


createAdmin();




