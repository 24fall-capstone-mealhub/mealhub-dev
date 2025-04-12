// hooks/useLogin.js

import { useState } from 'react';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (id, pwd) => {
    setLoading(true);
    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({ id, pwd }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;
