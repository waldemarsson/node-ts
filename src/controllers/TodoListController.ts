import { Controller } from "./Controller";
import { TodoListDocument } from "../models/TodoList";
import { Request, Response } from "express";
import { TodoListService } from "../services/TodoListService";
import { ServiceResult, ErrorType } from "../types/ServiceResult";

export class TodoListController implements Controller {
  private static instance: TodoListController;

  private readonly todoListService: TodoListService;

  private constructor() {
    this.todoListService = TodoListService.getInstance();
  }

  public async create(req: Request, res: Response): Promise<void> {
    const list: TodoListDocument = req.body;
    if (!list || list._id === null || list._id) {
      res.status(400).send();
    }
    const result: ServiceResult<TodoListDocument> = await this.todoListService
      .createList(list);

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
    const result: ServiceResult<TodoListDocument | null> = await this
      .todoListService.getList(id);

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

  // @ts-ignore: TS6133
  public async readAll(req: Request, res: Response): Promise<void> {
    const result: ServiceResult<TodoListDocument[]> = await this
    .todoListService.getLists();

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
    const list: TodoListDocument = req.body;
    if (!id || !list) {
      res.status(400).send();
    }

    const result: ServiceResult<TodoListDocument | null> = await this
      .todoListService.updateList(id, list);

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

  public async delete(req: Request, res: Response): Promise<void> {
    const id: string = req.params.id;
    if (!id) {
      res.status(400).send();
    }
    const result: ServiceResult<TodoListDocument | null> = await this
      .todoListService
      .deleteList(id);

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

  public static getInstance(): TodoListController {
    if (!TodoListController.instance) {
      TodoListController.instance = new TodoListController();
    }

    return TodoListController.instance;
  }
}
