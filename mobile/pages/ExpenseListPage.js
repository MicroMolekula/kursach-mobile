import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getExpenses } from '../services/api';
import ExpenseItem from '../components/ExpenseItem';
import {useFocusEffect} from '@react-navigation/native';

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchExpenses = async () => {
        try {
          const data = await getExpenses();
          setExpenses(data);
        } catch (error) {
          console.error('Failed to fetch expenses:', error);
        }
      };

      fetchExpenses();
    }, [])
  );

  const fetchExpenses = async () => {
    const data = await getExpenses();
    setExpenses(data);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});
