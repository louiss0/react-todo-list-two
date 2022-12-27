import React, { forwardRef, RefCallback, useCallback, useEffect } from "react";
import type {
  SVGProps,
  FunctionComponent,
  MouseEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from "react";
import { useState } from "react";
import type { Task } from "../types";
import type { TodoListAppHandlers } from "./TodoListApp";

export type Props = Omit<TodoListAppHandlers, "handleAddTask"> & Task;

const TodoItem = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { id, completed, text, handleChecked, handleDelete, ...rest } = props;

  const [editing, setEditing] = useState<"editing" | "edited" | "not-editing">(
    "not-editing"
  );

  const [inputText, setInputText] = useState(text);

  const startEditing: MouseEventHandler = () => {
    setEditing("editing");
  };

  const cancelEditing: FocusEventHandler = () => {
    setEditing("not-editing");
  };
  const finishEditing: KeyboardEventHandler = (event) => {
    return event.key === "Enter" && setEditing("edited");
  };

  const inputRefHandler = useCallback<RefCallback<HTMLInputElement>>((el) => {
    el?.focus();
  }, []);

  let timer: number;
  useEffect(() => {
    switch (editing) {
      case "editing":
      case "not-editing":
        setInputText((value) => (value.length === 0 ? text : value));
        break;
      case "edited":
        timer = setTimeout(() => setEditing("not-editing"), 1000);
        break;
    }

    return () => {
      clearTimeout(timer);
    };
  }, [editing]);

  const renderMap: Record<typeof editing, JSX.Element> = {
    edited: <div>This thing is edited</div>,
    editing: (
      <input
        type="text"
        id="input-text"
        ref={inputRefHandler}
        value={inputText}
        onInput={(event) => setInputText(event.currentTarget.value.trim())}
        className="leading-10 px-3 text-lg w-3/5 caret-slate-600 bg-inherit"
        onBlur={cancelEditing}
        onKeyDown={finishEditing}
      />
    ),
    "not-editing": (
      <button disabled={completed} onClick={startEditing}>
        <span
          className={`${completed ? "line-through decoration-red-600" : ""}`}
        >
          {inputText}
        </span>
      </button>
    ),
  };

  return (
    <div id={`todo-item-${id}`} className="px-6 py-2" ref={ref} {...rest}>
      <div className="flex gap-6 justify-between items-center">
        <button
          className="px-4 py-2 transition-opacity duration-300 hover:opacity-90"
          onClick={() => handleChecked({ id, completed: !completed })}
          aria-label="Complete Task"
        >
          <CheckCircleIcon />
        </button>
        <label htmlFor="input-text" className="sr-only">
          <div>Edit item here</div>
        </label>
        {renderMap[editing]}
        <button
          className="px-4 py-2 transition-opacity duration-300 hover:opacity-90"
          onClick={() => handleDelete(id)}
          aria-label="Delete Item"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
});

const CheckCircleIcon: FunctionComponent<SVGProps<SVGSVGElement>> = ({
  className,
  ...attrs
}) => {
  return (
    <svg
      className={`w-6 h-6 text-red-600  ${className}`}
      viewBox="0 0 24 24"
      {...attrs}
    >
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      />
    </svg>
  );
};

const TrashIcon: FunctionComponent<SVGProps<SVGSVGElement>> = ({
  className,
  ...attrs
}) => {
  return (
    <svg
      className={`w-6 h-6 text-amber-600 ${className}`}
      viewBox="0 0 24 24"
      {...attrs}
    >
      <path
        fill="currentColor"
        d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z"
      />
    </svg>
  );
};

export default TodoItem;
