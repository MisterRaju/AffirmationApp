import notifee, { AndroidImportance, RepeatFrequency, TriggerType } from '@notifee/react-native';
import { flattenAffirmations } from './affirmations';

const CHANNEL_ID = 'affirmations-reminders';
const HOURLY_TRIGGER_ID = 'hourly-affirmation-reminder';

const pickRandomAffirmation = () => {
  if (!Array.isArray(flattenAffirmations) || flattenAffirmations.length === 0) {
    return 'Take a deep breath. You are doing better than you think.';
  }

  const randomIndex = Math.floor(Math.random() * flattenAffirmations.length);
  return flattenAffirmations[randomIndex]?.text || 'You are capable of great things.';
};

const ensureReminderChannel = async () => {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Affirmation Reminders',
    importance: AndroidImportance.HIGH,
  });
};

const buildNotification = notificationId => ({
  ...(notificationId ? { id: notificationId } : null),
  title: 'Affir',
  body: pickRandomAffirmation(),
  android: {
    channelId: CHANNEL_ID,
    smallIcon: 'ic_launcher',
    pressAction: {
      id: 'default',
    },
  },
});

export const enableHourlyReminder = async ({ sendImmediate = true, requestPermission = false } = {}) => {
  if (requestPermission) {
    await notifee.requestPermission();
  }
  await ensureReminderChannel();

  // Avoid duplicate schedules when the setting is toggled repeatedly.
  await notifee.cancelTriggerNotification(HOURLY_TRIGGER_ID);

  if (sendImmediate) {
    await notifee.displayNotification(buildNotification());
  }

  await notifee.createTriggerNotification(buildNotification(HOURLY_TRIGGER_ID), {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 60 * 60 * 1000,
    repeatFrequency: RepeatFrequency.HOURLY,
    alarmManager: {
      allowWhileIdle: true,
    },
  });
};

export const disableHourlyReminder = async () => {
  await notifee.cancelTriggerNotification(HOURLY_TRIGGER_ID);
};
