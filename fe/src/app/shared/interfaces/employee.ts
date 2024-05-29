import { Observable } from 'rxjs';

interface ICreateNewEmployee {
  name: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  nationality: string;
  joiningDate: Date;
  active: string;
}

interface IGetAllEmployees {
  page: number;
  size: number;
  gender: string;
  active: string;
  searchString: string;
}

interface IEditInforEmployee {
  id: string;
  name: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  nationality: string;
  joiningDate: Date;
  active: string;
}

interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export {
  ICreateNewEmployee,
  IGetAllEmployees,
  IEditInforEmployee,
  CanComponentDeactivate,
};
