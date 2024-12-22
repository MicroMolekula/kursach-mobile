import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { getExpenses } from '../services/api';

const screenWidth = Dimensions.get('window').width;

export default function ExpenseChartPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const expenses = await getExpenses();
      setData(expenses);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setData([]); // В случае ошибки устанавливаем пустые данные
    }
  };

  const calculateCategoryData = () => {
    const categories = {};

    // Группируем данные по категориям
    data.forEach((expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories).map((value) => (isNaN(value) ? 0 : value));

    // Проверка на наличие данных
    if (labels.length === 0 || values.length === 0) {
      return {
        labels: ['Нет данных'],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels,
      datasets: [{ data: values }],
    };
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Расходы по категориям</Text>
      <BarChart
        data={calculateCategoryData()}
        width={screenWidth - 30}
        height={200}
        chartConfig={chartConfig}
        style={styles.chart}
      />
    </View>
  );
}

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});
