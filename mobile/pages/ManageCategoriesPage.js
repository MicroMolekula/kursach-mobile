import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getCategories, addCategory, deleteCategory } from '../services/api';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (!newCategory) {
      alert('Введите название категории');
      return;
    }
    await addCategory({ name: newCategory });
    setNewCategory('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Управление категориями</Text>
      <TextInput
        style={styles.input}
        placeholder="Название новой категории"
        value={newCategory}
        onChangeText={setNewCategory}
      />
      <Button title="Добавить категорию" onPress={handleAddCategory} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text>{item.name}</Text>
            <Button title="Удалить" onPress={() => handleDeleteCategory(item.id)} />
          </View>
        )}
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
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});
