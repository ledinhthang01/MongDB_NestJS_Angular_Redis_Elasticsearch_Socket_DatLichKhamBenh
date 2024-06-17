interface ICreateGroupChat {
  chatName: string;
  users: Array<string>;
}

interface IAccessChat {
  userId: string;
}

export { ICreateGroupChat, IAccessChat };
