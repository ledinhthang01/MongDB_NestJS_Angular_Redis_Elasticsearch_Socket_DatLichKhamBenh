import { MChat } from './chat';

interface MMessage {
  _id: string;
  sender: MChat;
  content: string;
  chat: {
    _id: string;
    groupAdmin: string;
  };
  status: string;
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

interface MDelEditMessage {
  message: string;
  data: {
    _id: string;
    sender: string;
    content: string;
    chat: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export { MMessage, MGetAllMessages, MSendMessage, MDelEditMessage };
