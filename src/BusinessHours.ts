import moment from 'moment-timezone';

interface Session {
  startTime: string;
  endTime: string;
}

interface BusinessHour {
  day: number;
  sessions: Session[];
}

export interface UserBusinessData {
  timezone: string;
  businessHours: BusinessHour[];
}

export const isUserBusinessHour = (timezone: string, businessHours: BusinessHour[]): boolean => {
  const now = moment.tz(timezone);
  const currentDay = now.day(); // 0 (Sunday) to 6 (Saturday)
  const currentTime = now.format('HH:mm');

  const todayBusinessHours = businessHours.find(bh => bh.day === currentDay);

  if (todayBusinessHours) {
    return todayBusinessHours.sessions.some(session => {
      const { startTime, endTime } = session;
      return currentTime >= startTime && currentTime <= endTime;
    });
  }
  return false;
};