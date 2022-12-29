import React, {
  createRef,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import type { Task, Tasks } from "../types";
import TodoItem from "./TodoItem";
import TodoListForm from "./TodoListForm";
export type TodoListAppHandlers = {
  handleDelete(payload: Task["id"]): void;
  handleChecked(payload: Omit<Task, "text">): void;
  handleAddTask(payload: Task): void;
};

type ListFilter = "all" | "complete" | "incomplete";

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
    setTasks((tasks) => [...tasks, task]);
  };

  const handleChecked: TodoListAppHandlers["handleChecked"] = ({
    id,
    completed,
  }) => {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          task.completed = completed;
        }

        return task;
      })
    );
  };
  const handleDelete: TodoListAppHandlers["handleDelete"] = (id) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  const [filter, setFilter] = useState<ListFilter>("all");

  const filteredTasks = () => {
    switch (filter) {
      case "all":
        return tasks;
      case "complete":
        return completeTasks;
      case "incomplete":
        return incompleteTasks;
    }
  };

  useEffect(() => {
    localStorage.setItem("react-to-do-list", JSON.stringify({ tasks, filter }));
  }, [tasks, filter]);

  return (
    <div className="w-8/12 mx-auto">
      <div className="grid gap-6">
        <TodoListForm handleAddTask={handleAddTask} />
        <div className="grid gap-2">
          <FilterButtons setFilter={(text) => setFilter(text)} />
          {tasks.length !== 0 ? (
            <TaskList
              tasks={filteredTasks()}
              {...{ handleChecked, handleDelete }}
            />
          ) : (
            <EmptyListState />
          )}
          <TaskStats
            {...{ numOfTasks, numOfTasksCompleted, numOfTasksIncomplete }}
          />
        </div>
      </div>
    </div>
  );
};

const TaskStats: FunctionComponent<
  Record<`numOfTasks${"Completed" | "Incomplete" | ""}`, number>
> = ({ numOfTasksCompleted, numOfTasksIncomplete, numOfTasks }) => {
  const statsTextAndNumbers = {
    all: numOfTasks,
    completed: numOfTasksCompleted,
    incomplete: numOfTasksIncomplete,
  };

  return (
    <div id="tasks-stats" className="flex justify-between items-center h-24">
      {Object.entries(statsTextAndNumbers).map(([key, value]) => (
        <span
          className=" sm:min-w-[6rem] flex justify-center items-center gap-2"
          key={key}
        >
          <span className="text-lg font-bold capitalize">{key}:</span>{" "}
          <span className="text-sm">{value}</span>
        </span>
      ))}
    </div>
  );
};

const FilterButtons: FunctionComponent<{
  setFilter(text: ListFilter): void;
}> = ({ setFilter }) => {
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

  return (
    <div id="filter-buttons" className="px-3 py-1">
      <div
        data-content
        className="flex justify-around items-center flex-wrap gap-4"
      >
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
    </div>
  );
};

const TaskList: FunctionComponent<
  { tasks: Tasks } & Omit<TodoListAppHandlers, "handleAddTask">
> = (props) => {
  const { tasks, handleChecked, handleDelete } = props;

  return (
    <TransitionGroup id="task-list" className="grid gap-5" enter exit>
      {tasks.map((task) => {
        return (
          <CSSTransition
            key={task.id}
            timeout={1000}
            classNames={{
              enter: "fade-enter",
              enterActive: "fade-enter-active",
              enterDone: "fade-enter-done",
              exit: "fade-exit",
              exitActive: "fade-exit-active",
              exitDone: "fade-exit-done",
            }}
          >
            <TodoItem
              {...{
                ...task,
                handleChecked,
                handleDelete,
              }}
            />
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

const EmptyListState = () => (
  <div className="grid place-items-center h-40 ">
    Is there anything you wish to do? You have no tasks listed here
  </div>
);

export default TodoListApp;
