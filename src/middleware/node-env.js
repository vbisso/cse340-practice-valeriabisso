//to support dynamic script and style injection
import { getNav } from "../utilities/index.js";

export const resLocals = (req, res, next) => {
  res.locals.scripts = [];
  res.locals.scripts.push('<script src="/js/theme.js" defer></script>');

  res.locals.styles = [];
  const currentHour = new Date().getHours(); // gets current hour (0-23)
  //console.log(currentHour);
  if (currentHour < 12) {
    res.locals.styles.push('<link rel="stylesheet" href="/css/test1.css">');
  } else {
    res.locals.styles.push('<link rel="stylesheet" href="/css/test2.css">');
  }

  next();
};

export const configureNodeEnvironment = async (req, res, next) => {
  res.locals.navHTML = await getNav();

  next();

  // Code omitted for brevity...
};
