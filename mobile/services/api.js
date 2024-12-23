import axios from 'axios';

const API_URL = 'http://192.168.0.102:8080';

export const getExpenses = async () => {
  const response = await axios.get(`${API_URL}/expenses`);
  return response.data;
};

export const addExpense = async (expense) => {
  await axios.post(`${API_URL}/expenses`, expense);
};


export const getCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error.message);
      throw error;
    }
};
  
export const addCategory = async (category) => {
  await axios.post(`${API_URL}/categories`, category);
};

export const deleteCategory = async (id) => {
  await axios.delete(`${API_URL}/categories/${id}`);
};
  
  // Запрос на авторизацию
export const loginRequest = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  };
  
  // Запрос на регистрацию
export const registerRequest = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
  return response.data;
};