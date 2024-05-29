import { MChat } from './chat';

interface MMessage {
  _id: string;
  sender: MChat;
  content: string;
  chat: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: Array<MChat>;
    groupAdmin: string;
    createdAt: Date;
    updatedAt: Date;
    latestMessage: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface MGetAllMessages {
  message: string;
  data: Array<MMessage>;
}

interface MSendMessage {
  message: string;
  data: Array<MMessage>;
}

export { MMessage, MGetAllMessages, MSendMessage };
