import { Router, Request, Response } from "express";

const router: Router = Router();

// @ts-ignore: TS6133
router.all("*", (req: Request, res: Response): Promise<void> => {
  res.status(404);
  res.send();
});

export { router };
