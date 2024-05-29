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
  name: string;
}

export { ISendMessage, IGetAllMessage, IMember, IGroup };
