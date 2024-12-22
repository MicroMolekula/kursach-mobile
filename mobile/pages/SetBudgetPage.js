import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { scheduleBudgetNotification } from '../services/notifications';

export default function SetBudgetPage() {
  const [budget, setBudget] = useState('');

  const handleSetBudget = async () => {
    if (!budget || isNaN(budget)) {
      alert('Введите корректный бюджет');
      return;
    }
    await scheduleBudgetNotification(parseFloat(budget));
    alert('Бюджет установлен, уведомления настроены');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Установить месячный бюджет</Text>
      <TextInput
        style={styles.input}
        placeholder="Сумма бюджета"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
      />
      <Button title="Установить бюджет" onPress={handleSetBudget} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
