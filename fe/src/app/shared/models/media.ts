interface MMedia {
  url: string;
  type: string;
  idParent: string;
  _id: string;
}

interface MGetAll {
  message: string;
  data: Array<MMedia>;
}

interface MDelete {
  message: string;
  data: MMedia;
}

export { MMedia, MGetAll, MDelete };
