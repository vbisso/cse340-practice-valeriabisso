import dbPromise from "../database/index.js";
import path from "path";
import fs from "fs";

const getClassifications = async () => {
  const db = await dbPromise;
  return await db.all("SELECT * FROM classification");
};

const getGamesByClassification = async (classificationId) => {
  const db = await dbPromise;
  return await db.all(
    `
      SELECT game.*, classification.classification_name 
      FROM game 
      JOIN classification ON game.classification_id = classification.classification_id
      WHERE game.classification_id = ?`,
    [classificationId]
  );
};

const addNewGame = async (name, description, classification_id, image_path) => {
  const db = await dbPromise;
  const sql = `
      INSERT INTO game (game_name, game_description, classification_id, image_path)
      VALUES (?, ?, ?, ?)
  `;
  return await db.run(sql, [name, description, classification_id, image_path]);
};

const getGameById = async (gameId) => {
  const db = await dbPromise;
  const query = `
      SELECT game.*, classification.classification_name 
      FROM game 
      JOIN classification ON game.classification_id = classification.classification_id
      WHERE game.game_id = ?;
  `;
  return await db.get(query, [gameId]);
};

async function updateGame(
  gameId,
  name,
  description,
  classificationId,
  imagePath = ""
) {
  const db = await dbPromise;

  // If no image was uploaded, update basic game info
  if (imagePath === "") {
    const sql = `
          UPDATE game 
          SET game_name = ?, 
              game_description = ?, 
              classification_id = ?
          WHERE game_id = ?
      `;
    return await db.run(sql, [name, description, classificationId, gameId]);
  }

  // If image was uploaded, update all info including image
  const sql = `
      UPDATE game 
      SET game_name = ?, 
          game_description = ?, 
          classification_id = ?,
          image_path = ?
      WHERE game_id = ?
  `;
  return await db.run(sql, [
    name,
    description,
    classificationId,
    imagePath,
    gameId,
  ]);
}

async function deleteGame(game_id) {
  const db = await dbPromise;

  // Retrieve classification_id and image_path before deleting the game
  const game = await db.get(
    "SELECT classification_id, image_path FROM game WHERE game_id = ?",
    game_id
  );

  // Delete the game from the database
  await db.run("DELETE FROM game WHERE game_id = ?", game_id);

  //deletes the associated image file (if it's not a placeholder)
  if (game.image_path && !game.image_path.includes("placehold.co")) {
    const imagePath = path.join(process.cwd(), `public${game.image_path}`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  return game.classification_id; // Returns the classification ID to redirect back
}

export {
  getClassifications,
  getGamesByClassification,
  addNewGame,
  getGameById,
  updateGame,
  deleteGame,
};
