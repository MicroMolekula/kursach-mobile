import * as Notifications from 'expo-notifications';

export const scheduleBudgetNotification = async (budget) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Напоминание о бюджете',
      body: `Вы превысили ваш месячный бюджет: ${budget} ₽`,
    },
    trigger: {
      seconds: 10,
    },
  });
};
