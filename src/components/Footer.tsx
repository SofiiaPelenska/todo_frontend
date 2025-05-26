import React from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';
import classNames from 'classnames';

type Props = {
  completedTodos: Todo[];
  amountOfActiveTodo: number;
  filterBy: string;
  setFilterBy: (value: FilterBy) => void;
  deleteTodo: (value: number) => void;
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  amountOfActiveTodo,
  filterBy,
  setFilterBy,
  deleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {amountOfActiveTodo} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterBy).map(([filterKey, filterValue]) => (
          <a
            key={filterKey}
            href={`#/${filterValue}`}
            className={classNames('filter__link', {
              selected: filterBy === filterValue,
            })}
            data-cy={`FilterLink${filterKey}`}
            onClick={() => setFilterBy(filterValue)}
          >
            {filterKey}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={() => {
          completedTodos.forEach(todo => deleteTodo(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
