import moment from 'moment-timezone';
import { AgentPrefsPayloadType, ChatPrefsPayloadType } from './Models';

interface Session {
  startTime: string;
  endTime: string;
}

interface Interval {
  from: string;
  to: string;
}

export enum DAYS {
  SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY
}

export interface BusinessHour {
  enabledDay: string;
  sessions: Session[];
}

export interface DateOverride {
  dates: string[];
  intervals: Interval[];
}

export interface UserBusinessData {
  timezone: string;
  businessHours: BusinessHour[];
}

export const isUserBusinessHour = (chatprefs: ChatPrefsPayloadType, agentsPrefs: AgentPrefsPayloadType[]): boolean => {
  const liveChatAvailability = chatprefs.meta.liveChatAvailability;

  if ((liveChatAvailability == "ONLINE" && chatprefs.meta.hideOnNonBusiness) || liveChatAvailability == "ONLINE_ONLY_ON_BUSINESS_HOURS") {

    try {
      if(chatprefs.meta.considerUsersBusinessHours)
      return agentsPrefs.some((agentPref: AgentPrefsPayloadType) => {
        const timezone = agentPref.timezone || "UTC";
        const now = moment.tz(timezone);
        const currentTime = now.format('HH:mm');
        if(agentPref.date_overrides?.length > 0) {
          const currentDate = now.format('YYYY-MM-DD');
          const dateOverride = agentPref.date_overrides.find((dateOverride: DateOverride) => dateOverride.dates?.length > 0 && dateOverride.dates.includes(currentDate));
          if(dateOverride?.intervals)
            return dateOverride.intervals?.some((interval: Interval) => {
              const startTime = interval.from, endTime = interval.to;
              return currentTime >= startTime && currentTime <= endTime;
            }) || false;
        }
        if (!agentPref.business_hours || agentPref.business_hours.length === 0) return false;
        const currentDay = now.day(); // 0 (Sunday) to 6 (Saturday)
        const todayBusinessHours = agentPref.business_hours.find((currentBusinessHours: any) => currentBusinessHours.day === DAYS[currentDay].toLowerCase()) as any;
        const timeFrom = todayBusinessHours?.timeFrom.split(',') || [];
        const timeTill = todayBusinessHours?.timeTill.split(',') || [];

        if (todayBusinessHours && todayBusinessHours.isActive && todayBusinessHours.isActive == "true") {
          return timeFrom.some((currTimeFrom: string, index: number) => {
            const  startTime = currTimeFrom, endTime = timeTill[index];
            return currentTime >= startTime && currentTime <= endTime;
          });
        }
        return false;
      })
      else {
        const timezone = chatprefs.meta.timezone || "UTC";
        const now = moment.tz(timezone);
        const currentDay = now.day(); // 0 (Sunday) to 6 (Saturday)
        const currentTime = now.format('HH:mm');
        const todayBusinessHours = chatprefs.meta.businessHours[DAYS[currentDay] as any];

        if (todayBusinessHours && todayBusinessHours.enabledDay && todayBusinessHours.sessions?.length > 0) {
          return todayBusinessHours.sessions.some(session => {
            const { startTime, endTime } = session;
            return currentTime >= startTime && currentTime <= endTime;
          });
        }
        return false;
      }

    } catch (error) {

    }
    
  }
  if (liveChatAvailability == "ONLINE") 
    return true;
  return false;
};