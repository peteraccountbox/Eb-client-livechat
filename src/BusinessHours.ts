import moment from 'moment-timezone';
import { AgentPaylodObj, AgentPrefsPayloadType, ChatPrefsPayloadType } from './Models';

interface Session {
  startTime: string;
  endTime: string;
}

export enum DAYS {
  SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY
}

export interface BusinessHour {
  enabledDay: string;
  sessions: Session[];
}

export interface UserBusinessData {
  timezone: string;
  businessHours: BusinessHour[];
}

export const isUserBusinessHour = (chatprefs: ChatPrefsPayloadType, agentsPrefs: AgentPrefsPayloadType[]): boolean => {
  const liveChatAvailability = chatprefs.meta.liveChatAvailability;
  // if (liveChatAvailability == "liveChat") {
  //   return agentsPrefs.some((agentPref) => (agentPref.availability && agentPref.availability == "ONLINE"));
  // }
  if (liveChatAvailability == "liveChatBusiness") {

    try {
      if(chatprefs.meta.disableCustomBusinessHours)
      return agentsPrefs.some((agentPref: AgentPrefsPayloadType) => {
        const timezone = agentPref.timezone;
        const now = moment.tz(timezone);
        const currentDay = now.day(); // 0 (Sunday) to 6 (Saturday)
        const currentTime = now.format('HH:mm');
        const todayBusinessHours = agentPref.business_hours.find((currentBusinessHours: any) => currentBusinessHours.day === DAYS[currentDay].toLowerCase()) as any;
        const timeFrom = todayBusinessHours.timeFrom.split(',')
        const timeTill = todayBusinessHours.timeTill.split(',')

        if (todayBusinessHours.isActive && todayBusinessHours.isActive == "true") {
          return timeFrom.some((currTimeFrom: string, index: number) => {
            const  startTime = currTimeFrom, endTime = timeTill[index];
            return currentTime >= startTime && currentTime <= endTime;
          });
        }
        return false;
      })
      else {
        const timezone = chatprefs.meta.timezone;
        const now = moment.tz(timezone);
        const currentDay = now.day(); // 0 (Sunday) to 6 (Saturday)
        const currentTime = now.format('HH:mm');
        const todayBusinessHours = chatprefs.meta.businessHours[DAYS[currentDay] as any];

        if (todayBusinessHours.enabledDay) {
          return todayBusinessHours.sessions.some(session => {
            const { startTime, endTime } = session;
            return currentTime >= startTime && currentTime <= endTime;
          });
        }
        return false;
      }

    } catch (error) {

    }

    return true;
  }
  if (liveChatAvailability == "liveChatOnline") 
    return true;
  return false;
};