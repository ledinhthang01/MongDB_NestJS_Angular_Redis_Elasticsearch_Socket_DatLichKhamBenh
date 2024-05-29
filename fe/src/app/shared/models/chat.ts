interface MChat {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

interface MFindUser {
  message: string;
  keyword: string;
  data: Array<MChat>;
}

interface MCreateGroupChat {
  message: string;
  data: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: Array<MChat>;
  };
}

interface MFetchChat {
  message: string;
  data: Array<{
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: Array<MChat>;
    groupAdmin?: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
    createdAt: Date;
    updatedAt: Date;
    latestMessage?: {
      _id: string;
      sender: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
      };
      content: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
}

interface MMemberToGroup {
  message: string;
  data: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: Array<MChat>;
    groupAdmin: string;
    createdAt: string;
    updatedAt: string;
    latestMessage: string;
  };
}

interface MGetAllMemberInGroupChat {
  message: string;
  data: Array<MChat>;
}

interface MRenameGroupChat {
  message: string;
  data: string;
}

export {
  MChat,
  MFindUser,
  MCreateGroupChat,
  MFetchChat,
  MGetAllMemberInGroupChat,
  MMemberToGroup,
  MRenameGroupChat,
};
