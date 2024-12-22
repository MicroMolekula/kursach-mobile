import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  // Проверяем, есть ли токен в AsyncStorage при запуске
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
    };
    checkToken();
  }, []);

  const login = async (token) => {
    setUserToken(token);
    await AsyncStorage.setItem('userToken', token); // Сохраняем токен
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken'); // Удаляем токен
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
