import { Document, Schema, model } from "mongoose";

export type TodoListDocument = Document & {
  name: string;
  items: string[];
};

const todoListSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 64,
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: "item",
    required: false,
  }],
});

export const TodoList = model<TodoListDocument>("list", todoListSchema);
