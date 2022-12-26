import React, { FunctionComponent, useState } from "react";
import { Task } from "../types";
import type { TodoListAppHandlers } from "./TodoListApp";

type Props = Omit<TodoListAppHandlers, "handleDelete" | "handleChecked">;

const labelMessage = "What do you want to do?";
const TodoListForm: FunctionComponent<Props> = ({ handleAddTask }) => {
  const [text, setText] = useState("");

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    handleAddTask(new Task(text));
  };

  return (
    <form className="flex justify-between items-center" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label className="sr-only" htmlFor="text">
          {labelMessage}
        </label>
        <input
          type="text"
          id="text"
          name="text"
          className="px-2 leading-5"
          value={text}
          placeholder={labelMessage}
          onInput={(event) => setText(event.currentTarget.value)}
        />
      </div>

      <button type="submit">
        <PlusIcon />
        <div className="sr-only">Add Item To the List</div>
      </button>
    </form>
  );
};

function PlusIcon() {
  return (
    <svg className="text-blue-500 w-12 " viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 14h-6v6h-4v-6H4v-4h6V4h4v6h6v4Z" />
    </svg>
  );
}

export default TodoListForm;
