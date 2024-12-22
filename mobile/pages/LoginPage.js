import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../AuthContext';
import { loginRequest } from '../services/api'; // Импортируем функцию

export default function LoginPage({ navigation }) {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Введите имя пользователя и пароль');
      return;
    }

    try {
      const data = await loginRequest(username, password);
      login(data.token); // Сохраняем токен через AuthContext
      console.log(data.token)
      Alert.alert('Успех', 'Вы вошли в систему!');
    } catch (error) {
      Alert.alert('Ошибка', error.response?.data?.error || 'Неверное имя пользователя или пароль');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Войти</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} />
      <Button title="Регистрация" onPress={() => navigation.navigate('Регистрация')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
