import express from "express";
import todosRoutes from "./routes/todos.js";

const app = express();

app.use("/todos", todosRoutes);
app.listen(3000);
