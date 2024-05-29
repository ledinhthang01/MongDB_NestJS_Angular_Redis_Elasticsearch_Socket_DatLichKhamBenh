interface ICreateGroupChat {
  name: string;
  users: string;
}

interface IAccessChat {
  userId: string;
}

export { ICreateGroupChat, IAccessChat };
