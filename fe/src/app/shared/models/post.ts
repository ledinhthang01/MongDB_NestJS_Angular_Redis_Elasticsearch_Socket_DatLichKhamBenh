interface MPost {
  avatar: string;
  title: string;
  preview: string;
  content: string;
  done: boolean;
  idAuthor: string;
  _id: string;
  createTime: Date;
  updateTime: Date;
}

interface MUpdatePost {
  message: string;
  data: MPost;
}

interface MCreatePost {
  message: string;
  data: string;
}

interface previewPost {
  _id: string;
  avatar: string;
  title: string;
  preview: string;
  createTime: string;
}

interface MGetPosts {
  message: string;
  size: number;
  page: number;
  total: number;
  keyword: string;
  data: Array<previewPost>;
}

interface MDetailPost {
  message: string;
  data: MPost;
}

interface MLatestPost {
  message: string;
  data: {
    _id: string;
    title: string;
    preview: string;
    avatar: string;
  };
}

export {
  MCreatePost,
  MGetPosts,
  MDetailPost,
  MLatestPost,
  MUpdatePost,
  previewPost,
};
