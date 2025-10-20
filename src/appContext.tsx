import {
  Component,
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useState,
} from "react";
import { PromtWidth, widgetFooterTabs } from "./App";
import {
  AgentPaylodObj,
  AgentPrefsPayloadType,
  ChatFlowsPayloadObj,
  ChatPrefsPayloadType,
  ChatSessionPaylodObj,
  EventPayloadObj,
} from "./Models";

export function createCtx<A>(defaultValue: A) {
  type UpdateType = Dispatch<SetStateAction<typeof defaultValue>>;
  const defaultUpdate: UpdateType = () => defaultValue;
  const ctx = createContext({
    state: defaultValue,
    update: defaultUpdate,
  });

  function Provider(props: PropsWithChildren<{}>) {
    const [state, update] = useState(defaultValue);
    return <ctx.Provider value={{ state, update }} {...props} />;
  }
  return [ctx, Provider] as const; // alternatively, [typeof ctx, typeof Provider]
}

const [ctx, TextProvider] = createCtx("someText");

export const TextContext = ctx;
export function App() {
  return (
    <TextProvider>
      <Component />
    </TextProvider>
  );
}

interface AppContextPayload {
  agentsPrefs: AgentPrefsPayloadType[];
  setAgentsPrefs: (prefs: AgentPrefsPayloadType[]) => void;
  agents: AgentPaylodObj[];
  setAgents: (prefs: AgentPaylodObj[]) => void;
  sessions: ChatSessionPaylodObj[];
  setSessions: (prefs: ChatSessionPaylodObj[]) => void;
  chatFlows: ChatFlowsPayloadObj[];
  setChatFlows: (prefs: ChatFlowsPayloadObj[]) => void;
  chatPrefs: ChatPrefsPayloadType;
  setChatPrefs: (prefs: ChatPrefsPayloadType) => void;
  chatBubbleClicked: () => void;
  activeTab: widgetFooterTabs;
  changeActiveTab: (tab: widgetFooterTabs) => void;
  promtWidth: PromtWidth;
  setPromtWidth: (tab: PromtWidth) => void;
  createSessionData: any;
}

export const AppContext = createContext({
  agentsPrefs: [] as AgentPrefsPayloadType[],
  setAgentsPrefs: (prefs: AgentPrefsPayloadType[]) => {},
  agents: [] as AgentPaylodObj[],
  setAgents: (prefs: AgentPaylodObj[]) => {},
  sessions: [] as ChatSessionPaylodObj[],
  setSessions: (prefs: ChatSessionPaylodObj[]) => {},
  chatFlows: [] as ChatFlowsPayloadObj[],
  setChatFlows: (prefs: ChatFlowsPayloadObj[]) => {},
  chatPrefs: {} as ChatPrefsPayloadType,
  chatBubbleClicked: () => {},
  setChatPrefs: (prefs: ChatPrefsPayloadType) => {},
  activeTab: "" as widgetFooterTabs,
  changeActiveTab: (tab: widgetFooterTabs) => {},
  promtWidth: "" as PromtWidth,
  setPromtWidth: (tab: PromtWidth) => {},
  createSessionData: {
    messageList: [] as EventPayloadObj[],
    sessionDetails: {} as any,
    force: false as boolean,
  },
} as AppContextPayload);
