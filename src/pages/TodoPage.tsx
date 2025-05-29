/* eslint-disable */
import React, { useRef, useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { TodoList } from '../components/TodoList';
import { Todo } from '../types/Todo';
import { addTodo, getTodos, deleteTodo, updateTodo } from '../api/todos';
import { Errors } from '../types/Errors';
import { Footer } from '../components/Footer';
import { ErrorModal } from '../components/ErrorModal';
import { FilterBy } from '../types/FilterBy';

export const TodoPage: React.FC<{ token: string }> = ({ token }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(Errors.DEFAULT);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTodoIds, setLoadedTodoIds] = useState<number[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const amountOfActiveTodo = stats.total - stats.completed;

  const shouldFocusCreationForm = useRef(false);

  const handleError = (message: Errors) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const refreshTodos = () => {
    getTodos(filterBy)
      .then(response => {
        setTodos(response.todos);
        setStats(response.stats);
      })
      .catch(() => {
        handleError(Errors.LOAD);
      });
  };

  const withLoading = async (
    todoId: number,
    asyncCallback: () => Promise<void>,
    errorText: Errors,
    options: { focusAfter?: boolean } = {},
  ) => {
    setLoadedTodoIds(current => [...current, todoId]);

    try {
      await asyncCallback();
    } catch (error) {
      handleError(errorText);
      throw error;
    } finally {
      setLoadedTodoIds(current => current.filter(id => id !== todoId));
      if (options.focusAfter) {
        shouldFocusCreationForm.current = true;
      }
    }
  };

  const updateTodoFields = async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    await updateTodo(todoId, fieldsToUpdate);
    setTodos(current =>
      current.map(todo =>
        todo.id === todoId ? { ...todo, ...fieldsToUpdate } : todo,
      ),
    );
  };

  const removeTodoById = async (todoId: number) => {
    await deleteTodo(todoId);
    setTodos(current => current.filter(todo => todo.id !== todoId));
  };

  const handleCreateTodo = async (title: string) => {
  if (!title.trim()) {
    handleError(Errors.EMPTY);
    return;
  }

  setIsLoading(true);

  const newTodo = {
    id: 0,
    title: title.trim(),
    completed: false,
  };

  setTempTodo(newTodo);

  try {
    const todo = await addTodo(newTodo);

    setTodos(currentTodos => {
      const updatedTodos = [...currentTodos];

      const shouldInclude = (
        filterBy === FilterBy.All ||
        (filterBy === FilterBy.Active && !todo.completed) ||
        (filterBy === FilterBy.Completed && todo.completed)
      );

      if (shouldInclude) {
        updatedTodos.push(todo);
      }

      return updatedTodos;
    });

    setStats(prevStats => ({
      total: prevStats.total + 1,
      completed: prevStats.completed,
    }));

    setNewTodoTitle('');
  } catch {
    handleError(Errors.ADD);
  } finally {
    setIsLoading(false);
    setTempTodo(null);
    shouldFocusCreationForm.current = true;
  }
};


  const handleDeleteTodo = (todoId: number) =>
    withLoading(todoId, () => removeTodoById(todoId), Errors.DELETE, {
      focusAfter: true,
    });

  const handleToggleTodo = (todoId: number, completed: boolean) =>
    withLoading(
      todoId,
      () => updateTodoFields(todoId, { completed }),
      Errors.UPDATE,
    );

  const handleUpdateTodoTitle = (
    todoId: number,
    title: string,
  ): Promise<void> => {
    if (title.length === 0) {
      return handleDeleteTodo(todoId);
    }

    return withLoading(
      todoId,
      () => updateTodoFields(todoId, { title }),
      Errors.UPDATE,
    );
  };

  useEffect(() => {
    refreshTodos();
  }, [filterBy, stats.completed]);

  useEffect(() => {
    shouldFocusCreationForm.current = false;
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          createTodo={handleCreateTodo}
          isLoading={isLoading}
          handleToggleTodo={handleToggleTodo}
          shouldFocusCreationForm={shouldFocusCreationForm.current}
        />

        <TodoList
          todos={todos}
          deleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          loadedTodoIds={loadedTodoIds}
          handleToggleTodo={handleToggleTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
        />

          <Footer
            completedTodos={todos.filter(todo => todo.completed)}
            amountOfActiveTodo={amountOfActiveTodo}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            deleteTodo={handleDeleteTodo}
          />
      </div>

      <ErrorModal
        errorMessage={errorMessage}
        onClearError={() => setErrorMessage(Errors.DEFAULT)}
      />
    </div>
  );
};
