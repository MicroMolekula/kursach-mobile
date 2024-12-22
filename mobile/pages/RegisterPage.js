import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerRequest } from '../services/api'; // Импортируем функцию

export default function RegisterPage({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Ошибка', 'Введите имя пользователя и пароль');
      return;
    }

    try {
      await registerRequest(username, password);
      Alert.alert('Успех', 'Регистрация успешна!');
      navigation.navigate('Войти');
    } catch (error) {
      Alert.alert('Ошибка', error.response?.data?.error || 'Не удалось зарегистрироваться');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>
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
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <Button title="Назад к входу" onPress={() => navigation.navigate('Войти')} />
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
