import { Router } from "express";
import type { Todo } from "../models/todo.js";

const todos: Todo[] = [];

const router = Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/", (req, res, next) => {
  const newTodo: Todo = {
    id: new Date().toString(),
    text: req.body.text,
  };

  todos.push(newTodo);
  res.status(201).json({ todo: newTodo });
});

router.put("/:id", (req, res, next) => {
  const todoId = req.params.id;
  const updatedText = req.body.text;

  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  if (todoIndex < 0 || !todos[todoIndex]) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos[todoIndex] = { id: todos[todoIndex].id, text: updatedText };
  res.status(200).json({ todo: todos[todoIndex] });
});

router.delete("/:id", (req, res, next) => {
  const todoId = req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  if (todoIndex < 0 || !todos[todoIndex]) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos.splice(todoIndex, 1);
  res.status(200).json({ message: "Todo deleted" });
});

export default router;
