import React, { useEffect, useMemo, useState } from "react";
import { animated, useTransition } from "react-spring";
import { Task, Tasks } from "../types";
import TodoItem from "./TodoItem";
import TodoListForm from "./TodoListForm";
export type TodoListAppHandlers = {
  handleDelete(payload: Task["id"]): void;
  handleChecked(payload: Omit<Task, "text">): void;
  handleAddTask(payload: Task): void;
};

type ListFilter = "all" | "complete" | "incomplete";

const filterButtonsTextAndClassColor: Array<{
  text: ListFilter;
  classColor: `bg-${string}-400 ${string}`;
}> = [
  {
    text: "all",
    classColor: "bg-blue-400 hover:bg-blue-600 hover:text-gray-50",
  },
  {
    text: "complete",
    classColor: "bg-green-400 hover:bg-green-600 hover:text-gray-50",
  },
  {
    text: "incomplete",
    classColor: "bg-red-400 hover:bg-red-600 hover:text-gray-50",
  },
];

const AnimatedTodoItem = animated(TodoItem);

const TodoListApp = () => {
  useEffect(() => {
    const reactTodoListState = localStorage.getItem("react-to-do-list");

    const state: { tasks: Tasks; filter: ListFilter } = reactTodoListState
      ? JSON.parse(reactTodoListState)
      : { tasks: [], filter: "all" };

    setTasks(state.tasks);
    setFilter(state.filter);
  }, []);

  const [tasks, setTasks] = useState<Tasks>([]);

  const incompleteTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );
  const completeTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  const numOfTasksCompleted = useMemo(
    () => completeTasks.length,
    [completeTasks]
  );

  const numOfTasks = useMemo(() => tasks.length, [tasks]);

  const numOfTasksIncomplete = useMemo(
    () => incompleteTasks.length,
    [incompleteTasks]
  );

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
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  const [filter, setFilter] = useState<ListFilter>("all");

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "all":
        return tasks;
      case "complete":
        return completeTasks;
      case "incomplete":
        return incompleteTasks;
    }
  }, [tasks, filter]);

  const statsTextAndNumbers: Record<ListFilter, number> = {
    all: numOfTasks,
    complete: numOfTasksCompleted,
    incomplete: numOfTasksIncomplete,
  };

  useEffect(() => {
    localStorage.setItem("react-to-do-list", JSON.stringify({ tasks, filter }));
  }, [tasks, filter]);

  const TaskList = () => {
    const transitions = useTransition(filteredTasks, {
      keys(item) {
        return item.id;
      },
      from: {
        opacity: 0,
      },
      enter: {
        opacity: 0.9,
      },
      leave: {
        opacity: 0,
      },
      config: {
        duration: 500,
      },
    });

    return (
      <div id="task-list" className="grid gap-5">
        {transitions((style, task) => {
          return (
            <AnimatedTodoItem
              {...{ style, ...task, handleChecked, handleDelete }}
            />
          );
        })}
      </div>
    );
  };
  const EmptyListState = () => (
    <div className="grid place-items-center h-40 ">
      Is there anything you wish to do? You have no tasks listed here
    </div>
  );

  return (
    <React.StrictMode>
      <div className="w-8/12 mx-auto">
        <div className="grid gap-6">
          <TodoListForm handleAddTask={handleAddTask} />
          <div className="grid gap-2">
            <div id="filter-buttons" className="flex justify-between px-3 py-1">
              {filterButtonsTextAndClassColor.map(({ text, classColor }) => (
                <button
                  key={text}
                  onClick={() => setFilter(text)}
                  className={`rounded-full py-2 px-6 capitalize min-w-[7rem] ${classColor}`}
                >
                  {text}
                </button>
              ))}
            </div>

            {tasks.length !== 0 ? <TaskList /> : <EmptyListState />}

            <div
              id="tasks-stats"
              className="flex justify-between items-center h-24"
            >
              {Object.entries(statsTextAndNumbers).map(([key, value]) => (
                <span
                  className="min-w-[6rem] flex justify-center items-center gap-2"
                  key={key}
                >
                  <span className="text-lg font-bold capitalize">{key}:</span>{" "}
                  <span className="text-sm">{value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};

export default TodoListApp;
