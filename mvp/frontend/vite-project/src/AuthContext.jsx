import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken, setUnauthorizedHandler } from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());
  console.log("User");
  const logout = useCallback(() => {
    console.log('LOGOUT CALLED');
    setToken(null);
    setUser(null);
  }, []);

  // useEffect(() => {
  //   setUnauthorizedHandler(logout);
  // }, [logout]);
useEffect(() => {
  setUnauthorizedHandler(() => {
    console.error('Server rejected authentication. Token preserved for debugging.');
  });
}, []);
  // useEffect(() => {
  //   if (!getToken()) return;
  //   api
  //     .get('/auth/me')
  //     .then((d) => setUser(d.user))
  //     .catch(() => setToken(null))
  //     .finally(() => setLoading(false));
  // }, []);

  // const authenticate = async (path, body) => {
  // const data = await api.post(path, body);
    
  // console.log('Login response:', data);
  // console.log('Token received:', data.token);
  // console.log(
  //   'Token saved:',
  //   !!localStorage.getItem('stockflow_token')
  // );
  //   setToken(data.token);
  //   setUser(data.user);
  // };
  const authenticate = async (path, body) => {
  try {
    const response = await api.post(path, body);

    console.log('Full login response:', response);

    const token = response.token; // Adjust after checking the response


    if (!token) {
      console.error('No token found in the backend response!');
      return;
    }

    setToken(token);
    setUser(response.user);

    
    return data;
  } catch (error) {
    console.error(
      'Authentication error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

  const value = {
    user,
    loading,
    login: (email, password) => authenticate('/auth/login', { email, password }),
    signup: (form) => authenticate('/auth/signup', form),
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
