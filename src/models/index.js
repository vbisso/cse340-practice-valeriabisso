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

const addClassification = async (classification_name) => {
  //does nothing if the classification name is empty.
  if (!classification_name || classification_name.trim() === "") {
    throw new Error("Classification name cannot be empty.");
  }

  const db = await dbPromise;

  //Checks if the classification already exists before inserting.
  const classificationExists = await db.get(
    "SELECT classification_id FROM classification WHERE LOWER(classification_name) = LOWER(?)",
    classification_name
  );

  if (classificationExists) {
    throw new Error("Classification already exists.");
  }

  //Inserts the new classification into the database
  const runSQL = await db.run(
    "INSERT INTO classification (classification_name) VALUES (?)",
    classification_name
  );

  return { classification_id: runSQL.lastID, classification_name };
};

const moveClassification = async (
  old_classification_id,
  new_classification_id
) => {
  const db = await dbPromise;

  // Moves all games in the old classification to the new classification
  await db.run(
    "UPDATE game SET classification_id = ? WHERE classification_id = ?",
    [new_classification_id, old_classification_id]
  );
};

const deleteClassification = async (
  classification_id,
  new_classification_id
) => {
  console.log("hola");
  const db = await dbPromise;

  // checks if there are games in the classification
  const games = await db.all(
    "SELECT game_id FROM game WHERE classification_id = ?",
    [classification_id]
  );

  // If there are games in the classification, move them to the new classification
  if (games.length > 0) {
    if (new_classification_id) {
      await moveClassification(classification_id, new_classification_id); // Move games to new category
    }

    // Delete the classification from the database
    await db.run("DELETE FROM classification WHERE classification_id = ?", [
      classification_id,
    ]);
  }

  // Delete the classification from the database
  await db.run("DELETE FROM classification WHERE classification_id = ?", [
    classification_id,
  ]);
};

export {
  getClassifications,
  getGamesByClassification,
  addNewGame,
  getGameById,
  updateGame,
  deleteGame,
  addClassification,
  deleteClassification,
  moveClassification,
};
