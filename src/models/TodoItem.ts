import { Document, Schema, model } from "mongoose";

export type TodoItemDocument = Document & {
  list: string;
  name: string;
  checked: boolean;
};

const todoItemSchema = new Schema({
  list: {
    type: Schema.Types.ObjectId,
    ref: "list",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 64,
  },
  checked: {
    type: Boolean,
    required: true,
  },
});

export const TodoItem = model<TodoItemDocument>("item", todoItemSchema);
