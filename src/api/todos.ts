import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// export const getTodos = () => {
//   return client.get<Todo[]>(`/todos`);
// };
export interface TodosResponse {
  todos: Todo[];
  stats: {
    total: number;
    completed: number;
  };
}

export const getTodos = (filter?: 'all' | 'active' | 'completed') => {
  let endpoint = '/todos';

  if (filter && filter !== 'all') {
    endpoint += `?filter=${filter}`;
  }

  return client.get<TodosResponse>(endpoint);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, data);
};
