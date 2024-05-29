import { MSchedule } from './schedule';

interface MBooking {
  message: string;
  size: string;
  page: string;
  data: Array<MSchedule>;
}

interface MUserBooking {
  message: string;
}

interface MDatesAuthed {
  message: string;
  data: Array<{
    date: Date;
    idDoctor: string;
    idParent: string;
  }>;
}

interface MQueueBooking {
  _id: string;
  time: string;
  type: string;
  date: Date;
  idDoctor: string;
  idCenter: string;
  price: string;
  nameDoctor: string;
  specialties: string;
  nameCenter: string;
  address: string;
  degree: string;
  academic: string;
}

interface MQueueBookingDoctor {
  _id: string;
  time: string;
  type: string;
  date: Date;
  userName: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
}

interface MScheduleByUser {
  message: string;
  size: string;
  page: string;
  id: string;
  done: string;
  data: Array<MQueueBooking>;
}

interface MScheduleByDoctor {
  message: string;
  size: string;
  page: string;
  id: string;
  done: string;
  data: Array<MQueueBookingDoctor>;
}

interface MDoneSchedule {
  message: string;
  data: string;
}

export {
  MBooking,
  MUserBooking,
  MDatesAuthed,
  MScheduleByUser,
  MScheduleByDoctor,
  MDoneSchedule,
};
