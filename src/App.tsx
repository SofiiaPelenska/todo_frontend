/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useMemo } from 'react';
import { LoginPage } from './pages/LoginPage';
import { getUserIdFromToken } from './utils/getUserIdFromToken';
import { TodoPage } from './pages/TodoPage';

export const App: React.FC = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const userId = useMemo(
    () => (token ? getUserIdFromToken(token) : null),
    [token],
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  if (userId === null) {
    return;
  }

  return (
    <>
      <div
        style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000 }}
      >
        <button
          onClick={handleLogout}
          className="button is-danger is-light is-small"
        >
          Logout
        </button>
      </div>

      <TodoPage token={token} />
    </>
  );
};
