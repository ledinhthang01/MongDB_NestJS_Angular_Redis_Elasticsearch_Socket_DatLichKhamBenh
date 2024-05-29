interface ISchedule {
  id: string;
  idDoctor?: string;
  type: string;
  dateStart: string;
  dateEnd: string;
}

interface IGetAllSchedule {
  page: string;
  size: string;
  auth: string;
}

interface IWorkingSchedules {
  page: string;
  size: string;
  subscribed: string;
  idDoctor: string;
  idCenter: string;
  date: string;
  currentTime: string;
}

export { ISchedule, IGetAllSchedule, IWorkingSchedules };
