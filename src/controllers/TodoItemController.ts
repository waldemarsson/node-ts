import { Controller } from "./Controller";
import { TodoItemDocument } from "../models/TodoItem";
import { Request, Response } from "express";
import { TodoItemService } from "../services/TodoItemService";
import { ServiceResult, ErrorType } from "../types/ServiceResult";

export class TodoItemController implements Controller {
  private static instance: TodoItemController;

  private readonly todoItemService: TodoItemService;

  private constructor() {
    this.todoItemService = TodoItemService.getInstance();
  }

  public async create(req: Request, res: Response): Promise<void> {
    const item: TodoItemDocument = req.body;
    if (!item || item._id === null || item._id) {
      res.status(400).send();
    }

    const result: ServiceResult<TodoItemDocument> = await this.todoItemService
      .createItem(item);

    if (result?.success && result?.content) {
      res.status(201).send(result.content);
    } else if (result?.errors && result?.errorType === ErrorType.DEFAULT) {
      res.status(400).send(result.errors);
    } else if (result?.errors && result?.errorType === ErrorType.FATAL) {
      res.status(500).send(result.errors);
    } else {
      res.status(500).send();
    }
  }

  public async read(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400).send();
    }
    const result: ServiceResult<TodoItemDocument | null> = await this
      .todoItemService.getItem(id);

    TodoItemController.handleServiceResultAndSendResponse(res, result);
  }

  // @ts-ignore: TS6133
  public async readAll(req: Request, res: Response): Promise<void> {
    const result: ServiceResult<TodoItemDocument[]> = await this
      .todoItemService.getItems();

    if (result?.success && result?.content) {
      res.status(200).send(result.content);
    } else if (result?.errors && result?.errorType === ErrorType.FATAL) {
      res.status(500).send(result.errors);
    } else {
      res.status(500).send();
    }
  }
  public async update(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    const item: TodoItemDocument = req.body;
    if (!id || !item) {
      res.status(400).send();
    }

    const result: ServiceResult<TodoItemDocument | null> = await this
      .todoItemService.updateItem(id, item);

    TodoItemController.handleServiceResultAndSendResponse(res, result);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400).send();
    }
    const result: ServiceResult<TodoItemDocument | null> = await this
      .todoItemService
      .deleteItem(id);

    TodoItemController.handleServiceResultAndSendResponse(res, result);
  }

  private static handleServiceResultAndSendResponse(res: Response, result: ServiceResult<TodoItemDocument | null>): void {
    if (result?.success && result?.content) {
      res.status(200).send(result.content);
    } else if (result?.errors && result?.errorType === ErrorType.DEFAULT) {
      res.status(404).send(result.errors);
    } else if (result?.errors && result?.errorType === ErrorType.FATAL) {
      res.status(500).send(result.errors);
    } else {
      res.status(500).send();
    }
  }

  public static getInstance(): TodoItemController {
    if (!TodoItemController.instance) {
      TodoItemController.instance = new TodoItemController();
    }

    return TodoItemController.instance;
  }
}