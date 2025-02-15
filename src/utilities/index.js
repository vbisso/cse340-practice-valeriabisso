import { getClassifications } from "../models/index.js";

const getNav = async () => {
  const classifications = await getClassifications();
  let nav = "<ul>";
  classifications.forEach((row) => {
    const id = row.classification_id;
    const name = row.classification_name;
    nav += `<li><a href="/category/view/${id}">${name}</a></li>`;
  });
  return `${nav} <li><a href="/category/add">Add Game</a></li> <li><a href="/category/add/classification">Add Classification</a></li> <li><a href="/category/delete/classification">Delete Classification</a></li> <li><a href="/about">About</a></li> </ul>`;
};

export { getNav };
