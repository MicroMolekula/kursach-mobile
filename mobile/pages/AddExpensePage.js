import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { addExpense, getCategories } from '../services/api';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function AddExpensePage({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getCategories().then(data => {
        setCategories(data)
        if (data.length > 0) {
          setSelectedCategory(data[0].name)
        }
    });
  }, []);

  const handleAddExpense = async () => {
    if (!selectedCategory || !amount || isNaN(parseFloat(amount))) {
      Alert.alert('Ошибка', 'Введите корректные данные.');
      return;
    }

    try {
      addExpense({
        category: selectedCategory,
        amount: parseFloat(amount),
        note,
        date: date.toISOString().split('T')[0], // Форматируем дату в YYYY-MM-DD
      })
      Alert.alert('Успех', 'Расход добавлен!');
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка при добавлении расхода:', error);
      Alert.alert('Ошибка', 'Не удалось добавить расход.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <Text style={styles.title}>Добавить расход</Text>

      {/* Сумма */}
      <Text style={styles.label}>Сумма</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите сумму"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Заметка */}
      <Text style={styles.label}>Заметка</Text>
      <TextInput
        style={styles.input}
        placeholder="Добавьте заметку (необязательно)"
        value={note}
        onChangeText={setNote}
      />

      {/* Категория */}
      <Text style={styles.label}>Категория</Text>
      <View style={styles.pickerContainer}>
        {categories.length > 0 ? (
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.name} />
            ))}
          </Picker>
        ) : (
          <Text>Загрузка категорий...</Text>
        )}
      </View>

      {/* Дата */}
      <Text style={styles.label}>Дата</Text>
      <Button title={`Выбрать дату: ${date.toLocaleDateString()}`} onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Кнопка добавления */}
      <Button title="Добавить расход" onPress={handleAddExpense} color="#2196F3" />
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      overflow: 'hidden', // Убирает лишнее, если что-то выходит за рамки
      backgroundColor: '#f9f9f9',
      marginBottom: 20,
      height: 150,
    },
    picker: {
      padding: 0,
      margin: 0,
      height: 20,
      width: '100%',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
    },
    pickerItem: {
        fontSize: 30,
      },
  });
  
