import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';

export default function LogoutPage({ navigation }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Удаляем токен пользователя
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вы уверены, что хотите выйти?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Выйти" onPress={handleLogout} color="#ff0000" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
});
