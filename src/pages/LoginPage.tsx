/* eslint-disable */
import { useState } from 'react';
import { login, register } from '../api/auth';

export const LoginPage = ({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      setError('Password must be at least 6 characters');

      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      return;
    }

    try {
      if (isRegister) {
        await register(email, password);

        const { token } = await login(email, password);

        localStorage.setItem('token', token);
        onLogin(token);
      } else {
        const { token } = await login(email, password);

        localStorage.setItem('token', token);
        onLogin(token);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <section
      className="section is-flex is-justify-content-center is-align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="box" style={{ width: '100%', maxWidth: '700px' }}>
        <div className="auth-form">
          <h2 className="title is-4 has-text-centered">
            {isRegister ? 'Register' : 'Login'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope" />
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  minLength={6}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock" />
                </span>
                <button
                  type="button"
                  className="button is-small is-light"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="field is-grouped is-grouped-centered mt-5">
              <div className="control">
                <button
                  type="submit"
                  className="button is-primary"
                  style={{ minWidth: '120px' }}
                >
                  {isRegister ? 'Register' : 'Login'}
                </button>
              </div>
              <div className="control">
                <button
                  type="button"
                  className="button is-light"
                  style={{ minWidth: '180px' }}
                  onClick={() => {
                    setIsRegister(p => !p);
                    setError('');
                  }}
                >
                  {isRegister ? 'Switch to Login' : 'Switch to Register'}
                </button>
              </div>
            </div>

            {error && (
              <p className="help is-danger has-text-centered mt-">{error}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
