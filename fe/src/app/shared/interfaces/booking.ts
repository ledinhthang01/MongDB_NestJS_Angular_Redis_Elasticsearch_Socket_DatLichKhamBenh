interface IUserBooking {
  idSubscriber: string;
  idSchedule: string;
}

interface IUserGetAll {
  page: string;
  size: string;
}

interface IScheduleByUser {
  page: string;
  size: string;
  idUser: string;
  done: string;
}

interface IScheduleBooking {
  idParent: string;
  idDoctor: string;
  date: string;
}

interface IScheduleByDoctor {
  page: string;
  size: string;
  idDoctor: string;
  done: string;
}

export {
  IUserBooking,
  IUserGetAll,
  IScheduleByUser,
  IScheduleByDoctor,
  IScheduleBooking,
};
