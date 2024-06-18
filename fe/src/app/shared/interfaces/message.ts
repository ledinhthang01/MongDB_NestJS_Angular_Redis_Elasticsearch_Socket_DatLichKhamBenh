interface ISendMessage {
  chatId: string;
  content: string;
}

interface IGetAllMessage {
  id: string;
  page: number;
}

interface IMember {
  chatId: string;
  userId: string;
}

interface IGroup {
  chatId: string;
  chatName: string;
}

interface IEditMessage {
  messageId: string;
  content: string;
}

export { ISendMessage, IGetAllMessage, IMember, IGroup, IEditMessage };
