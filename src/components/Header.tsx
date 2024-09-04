import React, { useEffect } from 'react';
import { createTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  inputRef: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  allTodosCompleted: boolean;
  someTodosExist: boolean;
}

export const Header: React.FC<Props> = ({
  setErrorMessage,
  setTodos,
  setTempTodo,
  inputRef,
  onToggleAll,
  allTodosCompleted,
  someTodosExist,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const submitForm: React.FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault();
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.disabled = true;

    const trimmedTitle = input.value.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      input.disabled = false;
      input.focus();

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: 0,
    });

    try {
      const newTodo = await createTodo(trimmedTitle);

      setTodos(todos => [...todos, newTodo]);
      input.value = '';
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      input.disabled = false;
      input.focus();
      setTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {someTodosExist && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={submitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
