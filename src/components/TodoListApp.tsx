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
  const [tasks, setTasks] = useState<Tasks>([new Task("Clean my room")]);

  const handleAddTask: TodoListAppHandlers["handleAddTask"] = (task) => {
    setTasks([...tasks, task]);
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
    <div className="w-8/12 mx-auto">
      <div className="grid gap-6">
        <TodoListForm handleAddTask={handleAddTask} />
        <div>
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              {...{
                ...task,
                handleChecked,
                handleDelete,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoListApp;
