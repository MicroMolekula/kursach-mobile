import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExpenseItem({ expense }) {
  return (
    <View style={styles.item}>
      <Text style={styles.category}>{expense.category}: {expense.amount} ₽</Text>
      <Text style={styles.note}>{expense.note}</Text>
      <Text style={styles.note}>{expense.date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    color: '#666',
  },
});
