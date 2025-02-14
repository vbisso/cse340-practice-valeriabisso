import dbPromise from "../database/index.js";

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

export { getClassifications, getGamesByClassification, addNewGame };
