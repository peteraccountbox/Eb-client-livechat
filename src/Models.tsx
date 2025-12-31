import { type } from "node:os";
import { BusinessHour } from "./BusinessHours";

// export type ChatPrefsWidgetType = {
//   position: string;
//   colorCode: string;
//   colorCode2: string;
//   title: string;
//   default_profile_image: string;
//   empty_chat_list_message: string;
//   header_message: string;
//   hideOnMobile: boolean;
//   new_conversation_btn_text: string;
//   showOnlyOnManualTrigger: boolean;
//   welcomeGreetingEnabled: boolean;
//   welcome_message: string;
//   welcome_message_placeholder: string;
//   chatEnabled: boolean;
//   ticketEnabled: boolean;
//   homeEnabled: boolean;
//   helpEnabled: boolean;
//   chat_footer_settings: ChatFooterDataPayload[];
//   home_page_welcome_message: string;
//   logo_url: string;
// };

export type ChatFooterDataPayload = {
  tab: string;
  enable: boolean;
};
// export enum FormFieldTypes {
//     EMAIL, TEXT, DATE, LIST, CHECKBOX, TEXTAREA, NUMBER, FORMULA, MULTICHECKBOX, URL, CURRENCY, PHONE, TODAY_DATE, TAX, FILE, PASSWORD
// }

export type ChatFromFieldDataPayLoad = {
  name: string;
  type: string;
  required: boolean;
  visible?: boolean;
  error: string;
  pattern?: string;
  field_type: string;
  placeholder?: string;
  options?: string;
  value: string | string[];
  valueArr: string[];
  is_valid: boolean;
  label?: string;
  field_label?: string;
};

export type TicketFromFieldDataPayLoad = {
  type: string;
  required: boolean;
  name: string;
  value: string;
  placeholder: string;
  error?: string;
  is_valid: boolean;
};

export type ChatPrefsPreChatType = {
  button_text?: string;
  enabled: boolean;
  formData: ChatFromFieldDataPayLoad[];
  title?: string;
};

export type ChatPrefsSystemMessageType = {
  ASK_USER_DETAILS_TO_AGENT?: string;
  ASK_USER_DETAILS_TO_VISITOR?: string;
  CHAT_MESSAGE_OFFLINE_STATUS_MESSAGE?: string;
  CHAT_MESSAGE_OFFLINE_STATUS_MESSAGE_ENABLED?: string;
  CHAT_SESSION_CLOSED_TO_AGENT?: string;
  CHAT_SESSION_CLOSED_TO_VISITOR?: string;
};

export interface ChatChannelMeta {
  deactivated: boolean;
  hideOnMobile: boolean;
  newConversationBtnText: string;
  hideOnOutsideBusinessHours: boolean;
  decoration: Decoration;
  liveChatAvailability: "ONLINE_ONLY_ON_BUSINESS_HOURS" | "OFFLINE" | "ONLINE";
  storeId: string;
  chatMessageOfflineStatusMessage?: string;
  chatMessageOfflineStatusMessageEnabled?: boolean;
  sendChatTranscript: boolean;
  flowIds?: string[];
  installedDomains?: string[];
  chatFooterSettings: ChatFooterDataPayload[];
  fields: ChatFromFieldDataPayLoad[];
  title: string;
  btnText: string;
  considerUsersBusinessHours: ConstrainBooleanParameters;
  timezone: string;
  businessHours: BusinessHour[];
  hideOnNonBusiness: boolean;
  messagePlaceholder: string;
  requiredContactInformation: string;
}

export interface Decoration {
  headerPictureUrl: string;
  fontFamily: string;
  mainColor: string;
  gradientColor: string;
  useMainColorOutsideBusinessHour: boolean;
  conversationColor: string;
  backgroundStyle: string;
  introductionText: string;
  offlineIntroductionText: string;
  avatarType: string;
  widgetAlignment: string;
  widgetAlignmentOffsetX: number;
  widgetAlignmentOffsetY: number;
  launcherType: string;
  agentAvatarImageType: string;
  agentAvatarNameType: string;
  botAvatarImage: string;
}

export type ChatPrefsPayloadType = {
  id: string;
  meta: ChatChannelMeta;
  aiAgentId?: string;
  flows: ChatFlowsPayloadObj[];
  name: string;
  tenantId: string;
  // widget: ChatPrefsWidgetType;
  // prechat: ChatPrefsPreChatType;
  systemMessage: ChatPrefsSystemMessageType;
  botPrefs?: AIBotPrefPayloadType;
  matchedBotPrefs?: AIBotPrefPayloadType;
  isWhiteLabelEnabled?: boolean;
};

export enum AIBotPromptActionEnum {
  CONNECT_TO_AGENT = "CONNECT_TO_AGENT",
  MESSAGE = "MESSAGE",
}

export type AIBotPromptsPayloadType = {
  action: AIBotPromptActionEnum;
  message: string;
  description: string;
  label: string;
};

export type AIBotPrefPayloadType = {
  id: number;
  name: string;
  botPrompts: AIBotPromptsPayloadType[];
  settings: {
    showChatFormBeforeConnectToAgent: boolean;
    chatBotIconURL: string;
    newConversationBtnText: string;
    welcomeMessage: string;
    placeHolderText: string;
  };
};

export type AIBotPayloadType = {
  id?: string; // ObjectId as string
  name?: string;
  description?: string;
  role?: string;
  indexName?: string;
  position?: number;

  settings?: Record<string, any>; // Document equivalent
  rules?: Record<string, any>[];
  or_rules?: Record<string, any>[];
  botStats?: Record<string, any>;
  botPrompts?: AIBotPromptsPayloadType[];

  syncKB?: boolean;
  syncKBIds?: string[];
  isEnabled?: boolean;

  lastUpdatedTime?: number;
  createdTime?: number;
  ownerID?: number;
  namespace?: number;

  createAPIResponse?: string;
  developmentMode?: boolean;
  userEmail?: string;
};

export type WebActionType = {
  action: string;
  delay_timer: number;
  popup_pattern: string;
  position: string;
  redirect_on_subscribe: boolean;
  scroll_percentage: number;
};

export type WebRulesPayloadType = {
  actionType: string;
  createdTime: number;
  customData: string;
  disabled: boolean;
  force: boolean;
  id: number;
  name: string;
  or_rules: [];
  ownerId: number;
  rules: [];
  scope: string;
  updatedTime: number;
  waitTime: number;
  web_action: WebActionType;
};

export type AgentPaylodObj = {
  id: number | string;
  tenantId?: string;
  name: string;
  email: string;
  userPicURL?: any;
  profile_image_url?: string;
  profile_img_url?: string;
};

export type AgentPrefsPayloadType = {
  availability: string;
  business_hours: BusinessHour[];
  timezone: string;
  id: string;
  tenantId: string;
  userId: string;
  setCustomDateOverrides: any[];
  updatedTime: number[];
  createdTime: number[];
};

export type ChatFlowsPayloadObj = {
  name: string;
  id: string;
  [x: string]: any;
};

export type ChatSessionPaylodObj = {
  updatedTime: any;
  id: number | string;
  visitorId: string;
  agentId?: string;
  createdBy: "CUSTOMER";
  createdSource?: "WEBSITE";
  channelType: "CHAT";
  channelId: string;
  customerEmail: string;
  customerName: string;
  subject: string;
  meta: any;
  lastMessage: string;

  messageList: EventPayloadObj[];

  identifiers: any;
  newTicket?: boolean;
  messagesCount: number;

  customerUnreadMessagesCount: number;

  bot_conversation_id: string;
  gpt_bot_id?: number;
  conversationId: string;
  contact_id: number;
  status: string;
  connected_with: ChatSessionConnectedWithEnum;
  created_time: number;
  // updated_time: number;
  first_answered_by_user_id: number;
  agent_involved: boolean;
  participant_user_ids: number[];
  closed_by: string;
  type: string;
  unRead: number;
  typing: boolean;
  typing_alert: number;
  connect_to_agent_on_demand?: boolean;
  lastMessageAt: string;
  lastAgentMessageAt?: string;
  lastCustomerMessageAt?: string;
  formData?: string;
  lastConnectionWith?: ChatSessionConnectedWithEnum;
  initialConnectionWith?: ChatSessionConnectedWithEnum;
  aiAgentId?: string;
};

export type BotDetails = {
  botId: string;
  messageList: BotMessageList[];
  replyButtonList: [];
  triggerDialogueId: string;
  currentDialogueId: string;
  conversationId: string;
  loadingBot: boolean;
};

export enum MessageByTypeEnum {
  AGENT = "AGENT",
  AI_AGENT = "AI_AGENT",
  CUSTOMER = "CUSTOMER",
  SYSTEM = "SYSTEM",
  GPT = "GPT",
}

export enum ChatSessionConnectedWithEnum {
  AGENT = "AGENT",
  AI_AGENT = "AI_AGENT",
}

export type AttachmentType = {
  url: string;
  fileName: string;
  name: string;
};

export type ChatMessagePayloadObj = {
  [x: string]: any;
  progressingMode?: boolean;
  id?: string;
  ticketId?: string;
  from: MessageByTypeEnum;
  aiInputMessage?: string;
  fromName: string;
  fromEmail: string;
  bodyHTML: string;
  bodyText: string;
  format: MessageFormatType;

  sources?: string;
  user_id?: number;
  created_time: number;
  attachments?: AttachmentType[];
  misc_info?: string;
  meta_data?: string;
  gpt_relavance_score?: number;
  gpt_bot_id?: number;
  system_message_type?: string;
  session_id?: number;
};

export type EventPayloadObj = {
  [x: string]: any;
  tempId?: string;
  id?: string;
  ticketId?: any;
  eventType?: string;
  source?: string;
  from: MessageByTypeEnum;
  agentId?: string;
  message: ChatMessagePayloadObj;
};

export type BotMessageList = {
  id: string;
  message_type: string;
  service: string;
  from: string;
  message: string;
  created_time: number;
  button_status: string;
  status: string;
};

export interface ConversationResponsePayload {
  operators: AgentPaylodObj[];
  sessions: ChatSessionPaylodObj[];
}

export enum AppStateComponentsEnum {
  LOADER,
  CONVERSATIONLIST,
  CONVERSATION,
}

export enum SessionStateEnum {
  NEW_SESSION = "NEW_SESSION",
  DB_SESSION = "DB_SESSION",
}

export type ActiveSessionObjType = {
  session_id?: number;
  session_type?: SessionStateEnum;
  session?: ChatSessionPaylodObj;
};

export type JSONObjectType = {
  [key: string]: string | string[];
};

export type JSONObjectType1 = {
  [key: string]: string | number | object | null;
};

export enum MessageFormatType {
  FILE = "FILE",
  TEXT = "TEXT",
  TEXT_AND_FILE = "TEXT_AND_FILE",
  FETCHING = "FETCHING",
}

export type PermaLinkType = {
  cname_id: number;
  count: number | null;
  created_time: number;
  cursor: string | null;
  id: number;
  link_id: number;
  link_type: string;
  owner_id: number | null;
  updated_time: number | null;
  url: string;
};

export type SectionType = {
  article_ids: number[];
  articles: ArticleType[];
  default_section: boolean;
  name: string;
};

export type CollectionType = {
  article_count: number;
  article_ids: number[];
  articles: ArticleType[];
  authors: AgentPaylodObj[];
  count: number | null;
  created_time: number;
  cursor: string | null;
  description: string;
  entiy_group_name: string;
  id: number;
  img_url: string;
  owner_id: number | null;
  permalinkUrl: string;
  permalinks: PermaLinkType[];
  position: number;
  section_list: SectionType[];
  sections_json_str: string | null;
  status: string;
  title: string;
  updated_time: string | null;
  url: string | null;
};

export type ArticleReactionType = {
  count: number;
  index_1: number;
  index_2: number;
  index_3: number;
};

export type ArticleReactionStatsType = {
  reactionIndex: number;
  count: number;
};

export type ArticleStatsType = {
  created_time: number;
  entityId: number;
  id: number;
  reacted: number;
  reactionStats: ArticleReactionStatsType[];
  updated_time: number;
  views: number;
};
export type ArticleType = {
  collection: CollectionType;
  collection_id: number | null;
  content: string;
  count: number | null;
  created_time: number;
  cursor: string | null;
  description: string | null;
  entiy_group_name: string;
  id: number;
  owner: AgentPaylodObj;
  owner_id: number | null;
  permalink: PermaLinkType | null;
  permalinkUrl: string;
  permalinks: PermaLinkType[];
  reaction: ArticleReactionType;
  stats: ArticleStatsType;
  status: string;
  title: string;
  updated_time: number | null;
  url: string | null;
  views: number;
};

export type AutomationStatusType = {
  addedTime: number;
  automationId: number;
  automationStatus: string;
};

export type SubscriberPartialType = {
  email: string;
  id: number;
  name: string;
};

export type TicketType = {
  assigned_to: string;
  automationStatus: AutomationStatusType[];
  cc_emails: string[];
  count: number;
  agentId?: number;
  created_by: string;
  created_time: number;
  forceUpdate: boolean;
  group_id: number;
  html_body: string;
  id: number;
  is_spam: boolean;
  last_note_id: number;
  priority: number;
  private_notes_count: number;
  properties: any[];
  public_notes_count: number;
  references: string[];
  reopens_count: number;
  requester_email: string;
  requester_first_name: string;
  requester_last_name: string;
  requester_name: string;
  source: string;
  status: number;
  subject: string;
  subscriber: SubscriberPartialType;
  subscriber_id: number;
  tags: any[];
  text_body: string;
  type: number;
  updated_time: number;
  VISITOR_UUID: string;
};

export type RepoAttachmentType = {
  extension: string;
  id: number;
  size: number;
  title: string;
  url: string;
};

export type TicketNoteType = {
  cc_emails: string[];
  created_by: string;
  created_time: number;
  has_mime_object: boolean;
  html_body: string;
  id: number;
  is_first_note: boolean;
  is_mail_opened: boolean;
  text_body: string;
  owner: AgentPaylodObj;
  owner_id: number;
  repository_attachment_ids: number[];
  repository_attachment_list: RepoAttachmentType[];
  status: number;
  ticket_id: number;
  type: string;
};

export interface HelpCenterItemSchema {
  id: string;
  title: string;
  description?: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  status?: string;
  type: "COLLECTION" | "ARTICLE";
  position?: number;
  pageViews?: number;
  articles_length?: number;
}
