import { Router, Request, Response } from "express";
import { TodoListController } from "../controllers/TodoListController";

const router = Router();
const todoListController = TodoListController.getInstance();

router.get("/api/lists", (req: Request, res: Response) => {
  todoListController.readAll(req, res);
});
router.get("/api/list/:id", (req: Request, res: Response) => {
  todoListController.read(req, res);
});
router.post("/api/list", (req: Request, res: Response) => {
  todoListController.create(req, res);
});
router.delete("/api/list/:id", (req: Request, res: Response) => {
  todoListController.delete(req, res);
});
router.patch("/api/list/:id", (req: Request, res: Response) => {
  todoListController.update(req, res);
});

export { router };
