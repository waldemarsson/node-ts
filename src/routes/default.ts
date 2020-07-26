import { Router } from "express";

const router = Router();

// @ts-ignore: TS6133
router.all("*", (req, res) => {
  res.status(404);
  res.send();
});

export { router };
