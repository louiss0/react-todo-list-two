import React, {
  FunctionComponent,
  useCallback,
  useState,
  RefCallback,
} from "react";
import { Task } from "../types";
import type { TodoListAppHandlers } from "./TodoListApp";

type Props = Omit<TodoListAppHandlers, "handleDelete" | "handleChecked">;

const labelMessage = "What do you want to do?";
let validationMessage: string | undefined;

const TodoListForm: FunctionComponent<Props> = ({ handleAddTask }) => {
  const [text, setText] = useState("");

  const [submitting, setSubmitting] = useState<
    "not-submitting" | "submitting" | "submitted"
  >("not-submitting");

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    handleAddTask(new Task(text));
    setSubmitting("submitting");
  };

  const inputTextRefHandler = useCallback<RefCallback<HTMLInputElement>>(
    (el) => {
      switch (submitting) {
        case "not-submitting":
          el?.focus();
          break;
        case "submitting":
          return el?.validity.tooShort
            ? setSubmitting("not-submitting")
            : setSubmitting("submitted");
        case "submitted":
          el?.focus();
          setText("");
          setSubmitting("not-submitting");
          break;
      }

      validationMessage = el?.validationMessage;
    },
    [text, submitting]
  );

  return (
    <form className="flex justify-between items-center" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="sr-only" htmlFor="text">
          {labelMessage}
        </label>
        <input
          type="text"
          id="text"
          ref={inputTextRefHandler}
          required
          minLength={3}
          maxLength={25}
          name="text"
          className="px-3 leading-8 border-b-2 border-gray-500"
          value={text}
          placeholder={labelMessage}
          onInput={(event) => setText(event.currentTarget.value)}
        />
        {validationMessage ? (
          <span className="max-w-[25ch] text-sm">{validationMessage}</span>
        ) : null}
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
