import { createContext, useState } from "react";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const USER_KEY = "user";
  const [user, userSetter] = useState(
    localStorage.getItem(USER_KEY)
      ? JSON.parse(localStorage.getItem(USER_KEY))
      : null);

  const setUser = (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    userSetter(userData);
  };

  const clearUser = () => {
    localStorage.removeItem(USER_KEY);
    userSetter(null);
  };

  return (
    <AuthenticationContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

