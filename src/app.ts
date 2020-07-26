import express from "express";
import { PORT } from "./config/env";
import { db } from "./config/db";

import { router as todoItemRouter } from "./routes/todoItemRoutes";
import { router as todoListRouter } from "./routes/todoListRoutes";
import { router as defaultRouter } from "./routes/default";

const app = express();

app.use(express.json());
app.use(todoListRouter);
app.use(todoItemRouter);
app.use(defaultRouter);

db.then(() => {
  app.listen(PORT, () => console.log(`Started on ${PORT}`));
});
