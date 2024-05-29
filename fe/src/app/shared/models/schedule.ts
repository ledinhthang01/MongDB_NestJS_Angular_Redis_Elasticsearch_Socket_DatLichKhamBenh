interface MSchedule {
  type: string;
  dateStart: Date;
  dateEnd: Date;
  idDoctor: string;
  idCenter: string;
  auth: boolean;
  _id: string;
  createTime: Date;
  updateTime: Date;
}

interface MScheduleForAd {
  type: string;
  dateStart: Date;
  dateEnd: Date;
  idDoctor: string;
  idCenter: string;
  auth: boolean;
  _id: string;
  createTime: Date;
  updateTime: Date;
  name: string;
  email: string;
  specialties: string;
  phoneNumber: string;
}

interface MGetAllSchedule {
  message: string;
  size: number;
  page: number;
  auth: boolean;
  total: boolean;
  data: Array<MSchedule>;
}

interface MGetAllScheduleForAd {
  message: string;
  size: number;
  page: number;
  auth: boolean;
  total: boolean;
  data: Array<MScheduleForAd>;
}

interface MEditSchedule {
  message: string;
  data: MSchedule;
}

interface MWorkingSchedule {
  _id: string;
  time: string;
  type: string;
  date: Date;
  timeStart: Date;
  timeEnd: Date;
  idParent: string;
  idDoctor: string;
  idCenter: string;
  Subscribed: boolean;
  price: string;
  createTime: Date;
  updateTime: Date;
  idSubscriber: string;
}

interface MBookingSchedule {
  message: string;
  data: Array<MWorkingSchedule>;
}

interface MGetAllWorkingSchedule {
  message: string;
  size: number;
  page: number;
  subscribed: boolean;
  idDoctor: string;
  idCenter: string;
  date: string;
  total: boolean;
  data: Array<MWorkingSchedule>;
}

export {
  MSchedule,
  MGetAllSchedule,
  MEditSchedule,
  MGetAllScheduleForAd,
  MScheduleForAd,
  MGetAllWorkingSchedule,
  MWorkingSchedule,
  MBookingSchedule,
};
