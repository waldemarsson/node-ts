import { Router, Request, Response } from "express";
import { TodoItemController } from "../controllers/TodoItemController";

const router = Router();
const todoItemController = TodoItemController.getInstance();

router.get("/api/items", (req: Request, res: Response) => {
  todoItemController.readAll(req, res);
});
router.get("/api/item/:id", (req: Request, res: Response) => {
  todoItemController.read(req, res);
});
router.post("/api/item", (req: Request, res: Response) => {
  todoItemController.create(req, res);
});
router.delete("/api/item/:id", (req: Request, res: Response) => {
  todoItemController.delete(req, res);
});
router.patch("/api/item/:id", (req: Request, res: Response) => {
  todoItemController.update(req, res);
});

export { router };
