import { TodoItem, TodoItemDocument } from "../models/TodoItem";
import { TodoListDocument } from "../models/TodoList";
import { ServiceResult, ErrorType } from "../types/ServiceResult";
import { FindAndModifyWriteOpResultObject } from "mongodb";
import { TodoListService } from "../services/TodoListService";
import { TodoList } from "../models/TodoList";

export class TodoItemService {
  private static instance: TodoItemService;
  private readonly todoListService: TodoListService;

  private constructor() {
    this.todoListService = TodoListService.getInstance();
  }

  public async getItem(
    id: string,
  ): Promise<ServiceResult<TodoItemDocument | null>> {
    try {
      const item: TodoItemDocument | null = await TodoItem.findById(id)
        .populate(
          "list",
          "-items",
        );
      if (item) {
        return { success: true, content: item };
      } else {
        return {
          success: false,
          errors: `Error: Could not find item with id: ${id}`,
          errorType: ErrorType.DEFAULT,
        };
      }
    } catch (err) {
      return {
        success: false,
        errors: err.toString(),
        errorType: ErrorType.FATAL,
      };
    }
  }

  public async getItems(): Promise<ServiceResult<TodoItemDocument[]>> {
    try {
      const items: TodoItemDocument[] = await TodoItem.find()
        .populate(
          "list",
          "-items",
        );
      return { success: true, content: items };
    } catch (err) {
      return {
        success: false,
        errors: err.toString(),
        errorType: ErrorType.FATAL,
      };
    }
  }

  public async createItem(
    newItem: TodoItemDocument,
  ): Promise<ServiceResult<TodoItemDocument>> {
    const item = new TodoItem(newItem);
    const errors: Error | undefined = item.validateSync();
    const result: ServiceResult<TodoListDocument | null> = await this
      .todoListService.getList(item.list);

    if (!errors && result?.success && result?.content) {
      try {
        const savedItem: TodoItemDocument = await item.save();
        result.content.items.push(savedItem.id);
        await result.content.save();
        return { success: true, content: savedItem };
      } catch (err) {
        return { success: false, errorType: ErrorType.FATAL };
      }
    } else {
      return { success: false, errorType: ErrorType.DEFAULT, errors };
    }
  }

  public async deleteItem(
    id: string,
  ): Promise<ServiceResult<TodoItemDocument | null>> {
    try {
      const item: TodoItemDocument | null = await TodoItem.findByIdAndDelete(
        id,
      );
      const list: TodoListDocument | null = await TodoList.findById(item?.list);
      if (list) {
        list.items.splice(list.items.indexOf(item?.id), 1);
        list.save();
      }
      if (item) {
        return { success: true, content: item };
      } else {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors: `Error: Could not delete item with id: ${id}`,
        };
      }
    } catch (err) {
      return {
        success: false,
        errorType: ErrorType.FATAL,
        errors: err.toString(),
      };
    }
  }

  public async deleteItems(ids: string[]): Promise<ServiceResult<number>> {
    try {
      const { deletedCount } = await TodoItem.deleteMany(ids);
      if (deletedCount === ids.length) {
        return { success: true, content: deletedCount };
      } else {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors: `Error: Could not delete items with id: ${ids}`,
        };
      }
    } catch (err) {
      return {
        success: false,
        errorType: ErrorType.FATAL,
        errors: err.toString(),
      };
    }
  }

  public async updateItem(id: string, newItem: TodoItemDocument): Promise<
    ServiceResult<TodoItemDocument | null>
  > {
    try {
      const errors: Error | undefined = new TodoItem(newItem).validateSync();
      if (errors) {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors,
        };
      }
      const result: FindAndModifyWriteOpResultObject<TodoItemDocument | null> =
        await TodoItem.findOneAndUpdate(
          { _id: id },
          newItem,
          { new: true, useFindAndModify: false, rawResult: true },
        );
      if (result?.value) {
        return { success: true, content: result.value };
      } else {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors: `Error: Could not update item with id: ${id}`,
        };
      }
    } catch (err) {
      return {
        success: false,
        errorType: ErrorType.FATAL,
        errors: err.toString(),
      };
    }
  }

  public static getInstance(): TodoItemService {
    if (!TodoItemService.instance) {
      TodoItemService.instance = new TodoItemService();
    }

    return TodoItemService.instance;
  }
}
