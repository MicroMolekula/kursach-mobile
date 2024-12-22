import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';

export default function HomePage({ navigation }) {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Умный дневник расходов</Text>
        <Button title="Добавить расход" onPress={() => navigation.navigate('AddExpense')} />
        <Button title="Посмотреть расходы" onPress={() => navigation.navigate('ExpenseList')} />
        <Button title="Графики расходов" onPress={() => navigation.navigate('ExpenseChart')} />
        <Button title="Добавит категерию" onPress={() => navigation.navigate('ManageCategories')} />
        <Button title="Установить бюджет" onPress={() => navigation.navigate('SetBudget')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
