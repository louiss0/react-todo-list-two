import React, { useState } from "react";
import { Task, Tasks } from "../types";
import TodoItem from "./TodoItem";
import TodoListForm from "./TodoListForm";

export type TodoListAppHandlers = {
  handleDelete(payload: Task["id"]): void;
  handleChecked(payload: Omit<Task, "text">): void;
  handleAddTask(payload: Task): void;
};
const TodoListApp = () => {
  const [tasks, setTasks] = useState<Tasks>([]);

  const handleAddTask: TodoListAppHandlers["handleAddTask"] = (task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const handleChecked: TodoListAppHandlers["handleChecked"] = ({
    id,
    completed,
  }) => {
    setTasks(
      tasks.map((task) => {
        return task.id === id ? new Task(task.text, completed) : task;
      })
    );
  };
  const handleDelete: TodoListAppHandlers["handleDelete"] = (id) => {
    setTasks(tasks.filter((task) => task.id === id));
  };

  return (
    <div>
      <TodoListForm handleAddTask={handleAddTask} />
      <div className="w-10/12">
        {tasks.map((task) => (
          <TodoItem {...{ ...task, handleChecked, handleDelete }} />
        ))}
      </div>
    </div>
  );
};

export default TodoListApp;
