import session from "express-session";


import { pool } from "./database.js";


class MySQLSessionStore extends session.Store {
  async get(sessionId, callback) {
    try {
      const [rows] = await pool.execute(
        `
          SELECT
            data,
            expires
          FROM sessions
          WHERE session_id = ?
          LIMIT 1
        `,
        [sessionId],
      );


      if (rows.length === 0) {
        callback(null, null);
        return;
      }


      const row = rows[0];


      if (Number(row.expires) <= Date.now()) {
        await pool.execute(
          `
            DELETE FROM sessions
            WHERE session_id = ?
          `,
          [sessionId],
        );


        callback(null, null);
        return;
      }


      callback(
        null,
        JSON.parse(row.data),
      );
    } catch (error) {
      callback(error);
    }
  }


  async set(sessionId, sessionData, callback) {
    try {
      const expires = sessionData.cookie?.expires
        ? new Date(
            sessionData.cookie.expires,
          ).getTime()
        : Date.now() + 8 * 60 * 60 * 1000;


      await pool.execute(
        `
          INSERT INTO sessions (
            session_id,
            expires,
            data
          )
          VALUES (?, ?, ?)


          ON DUPLICATE KEY UPDATE
            expires = VALUES(expires),
            data = VALUES(data),
            updated_at = CURRENT_TIMESTAMP
        `,
        [
          sessionId,
          expires,
          JSON.stringify(sessionData),
        ],
      );


      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  }


  async destroy(sessionId, callback) {
    try {
      await pool.execute(
        `
          DELETE FROM sessions
          WHERE session_id = ?
        `,
        [sessionId],
      );


      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  }


  async touch(sessionId, sessionData, callback) {
    try {
      const expires = sessionData.cookie?.expires
        ? new Date(
            sessionData.cookie.expires,
          ).getTime()
        : Date.now() + 8 * 60 * 60 * 1000;


      await pool.execute(
        `
          UPDATE sessions
          SET
            expires = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE session_id = ?
        `,
        [
          expires,
          sessionId,
        ],
      );


      callback?.(null);
    } catch (error) {
      callback?.(error);
    }
  }
}


export const sessionStore =
  new MySQLSessionStore();