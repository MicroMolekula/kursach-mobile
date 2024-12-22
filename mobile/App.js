import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext, AuthProvider } from './AuthContext';

// Ваши страницы
import AddExpensePage from './pages/AddExpensePage';
import ExpenseListPage from './pages/ExpenseListPage';
import ExpenseChartPage from './pages/ExpenseChartPage';
import SetBudgetPage from './pages/SetBudgetPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from './pages/LogoutPage';

// Создаем навигацию
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Компонент для панели вкладок
function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Главная') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Добавить') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Список') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Графики') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Бюджет') {
            iconName = focused ? 'cash' : 'cash-outline';
          } else if (route.name === 'Категории') {
            iconName = focused ? 'archive' : 'archive-outline';
          } else if (route.name === 'Выйти') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          // Возвращаем иконку
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Главная" component={ExpenseListPage} />
      <Tab.Screen name="Добавить" component={AddExpensePage} />
      <Tab.Screen name="Категории" component={ManageCategoriesPage} />
      <Tab.Screen name="Графики" component={ExpenseChartPage} />
      <Tab.Screen name="Выйти" component={LogoutPage} />
    </Tab.Navigator>
  );
}

// Главная навигация
function AppNavigation() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Если пользователь авторизован */}
        {userToken ? (
          <Stack.Screen
            name="Main"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
        ) : (
          // Если пользователь не авторизован
          <>
            <Stack.Screen name="Войти" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Регистрация" component={RegisterPage} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
