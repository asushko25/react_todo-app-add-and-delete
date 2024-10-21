import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {isLoading ? <span className="loader" /> : todo.title}
      </span>
      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
