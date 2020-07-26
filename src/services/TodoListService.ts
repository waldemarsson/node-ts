import { TodoList, TodoListDocument } from "../models/TodoList";
import { TodoItem } from "../models/TodoItem";
import { ServiceResult, ErrorType } from "../types/ServiceResult";
import { FindAndModifyWriteOpResultObject } from "mongodb";
export class TodoListService {
  private static instance: TodoListService;
  private constructor() {}

  public async getList(
    id: string,
  ): Promise<ServiceResult<TodoListDocument | null>> {
    try {
      const list: TodoListDocument | null = await TodoList.findById(id)
        .populate(
          "items",
        );
      if (list) {
        return { success: true, content: list };
      } else {
        return {
          success: false,
          errors: `Error: Could not find list with id: ${id}`,
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

  public async getLists(): Promise<ServiceResult<TodoListDocument[]>> {
    try {
      const lists: TodoListDocument[] = await TodoList.find()
        .populate(
          "items",
        );
      return { success: true, content: lists };
    } catch (err) {
      return {
        success: false,
        errors: err.toString(),
        errorType: ErrorType.FATAL,
      };
    }
  }

  public async createList(
    newList: TodoListDocument,
  ): Promise<ServiceResult<TodoListDocument>> {
    const list = new TodoList(newList);
    const errors: Error | undefined = list.validateSync();

    if (!errors) {
      try {
        await list.save();
        return { success: true, content: list };
      } catch (err) {
        return { success: false, errorType: ErrorType.FATAL };
      }
    } else {
      return { success: false, errorType: ErrorType.DEFAULT, errors };
    }
  }

  public async deleteList(
    id: string,
  ): Promise<ServiceResult<TodoListDocument | null>> {
    try {
      const list: TodoListDocument | null = await TodoList.findByIdAndDelete(
        id,
      );
      let itemsDeleted: boolean = true;
      if (list?.items && list.items.length > 0) {
        const { deletedCount } = await TodoItem.deleteMany(list.items);
        if (deletedCount === list.items.length) {
          itemsDeleted = deletedCount === list.items.length ? true : false;
        }
      }
      if (list && itemsDeleted) {
        return { success: true, content: list };
      } else {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors: `Error: Could not delete list with id: ${id}`,
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

  public async updateList(id: string, newList: TodoListDocument): Promise<
    ServiceResult<TodoListDocument | null>
  > {
    try {
      const errors: Error | undefined = new TodoList(newList).validateSync();
      if (errors) {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors,
        };
      }
      const result: FindAndModifyWriteOpResultObject<TodoListDocument | null> =
        await TodoList.findOneAndUpdate(
          { _id: id },
          newList,
          { new: true, useFindAndModify: false, rawResult: true },
        );
      if (result?.value) {
        return { success: true, content: result.value };
      } else {
        return {
          success: false,
          errorType: ErrorType.DEFAULT,
          errors: `Error: Could not update list with id: ${id}`,
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

  public static getInstance(): TodoListService {
    if (!TodoListService.instance) {
      TodoListService.instance = new TodoListService();
    }

    return TodoListService.instance;
  }
}
