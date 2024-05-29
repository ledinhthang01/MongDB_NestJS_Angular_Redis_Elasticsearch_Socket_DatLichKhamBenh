import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, concatMap, map, of, tap } from 'rxjs';
import {
  AUTH_SCHEDULE,
  CREATE_NEW_CENTER,
  CREATE_NEW_DOCTOR,
  CREATE_NEW_EMPLOYEE,
  DELETE_CENTER,
  DELETE_DOCTOR,
  DELETE_EMPLOYEE,
  DELETE_SCHEDULE,
  EDIT_INFOR_CENTER,
  EDIT_INFOR_DOCTOR,
  EDIT_INFOR_EMPLOYEE,
  EDIT_SCHEDULE,
  GET_ALL_CENTERS,
  GET_ALL_DOCTORS,
  GET_ALL_EMPLOYEES,
  GET_ALL_WORKING_SCHEDULE,
  GET_DETAIL_INFOR_CENTER,
  GET_DETAIL_INFOR_DOCTOR,
  GET_DETAIL_INFOR_EMPLOYEE,
  GET_SCHEDULE_BY_ADMIN,
  GET_SCHEDULE_BY_DOCTOR,
  LOGOUT,
  REFRESH_TOKEN,
  REGISTER_SCHEDULE,
  SIGN_IN,
  SIGN_UP,
  GET_BOOKING,
  GET_DETAIL_INFOR_DOCTOR_BY_USER,
  GET_SCHEDULE_BOOKING,
  GET_INFO_CENTER_BY_USER,
  GET_INFO,
  USER_BOOKING,
  GET_DATE_AUTHED,
  GET_SCHEDULE_BY_USER,
  GET_SCHEDULES_BY_DOCTOR,
  DONE_SCHEDULE,
  CREATE_POST,
  GET_POST,
  GET_DETAIL_POST_BY_ID,
  GET_LASTEST_POST,
  UPDATE_POST,
  DELETE_POST,
  UPLOAD_MEDIA,
  GET_ALL_IMAGES,
  DELETE_IMAGE,
  FIND_USER,
  CREATE_GROUP_CHAT,
  ACCESS_AND_FETCH_CHAT,
  DELETE_CHAT,
  GET_ALL_MESSAGES,
  SEND_MESSAGE,
  ADD_MEMBER,
  GET_ALL_MEMBER,
  REMOVE_MEMBER,
  RENAME_GROUP_CHAT,
} from 'src/app/shared/contant/urls';
import { ISignIn, ISignUp } from 'src/app/shared/interfaces/user';
import { MSignIn, MSignUp, MUser } from 'src/app/shared/models/user';
import { StorageService } from '../storage/storage.service';
import {
  ICreateNewEmployee,
  IEditInforEmployee,
  IGetAllEmployees,
} from 'src/app/shared/interfaces/employee';
import {
  MDeleteEmployee,
  MGetAllEmployees,
  MResultOfEmployee,
} from 'src/app/shared/models/employee';
import {
  ICreateNewCenter,
  IEditInforCenter,
  IGetAllCenters,
} from 'src/app/shared/interfaces/center';
import {
  MDeleteCenter,
  MGetAllCenters,
  MInfoCenterByUser,
  MResultOfCenter,
} from 'src/app/shared/models/center';
import {
  ICreateNewDoctor,
  IEditInforDoctor,
  IGetAllDoctors,
} from 'src/app/shared/interfaces/doctor';
import {
  MDeleteDoctor,
  MGetAllDoctors,
  MResultOfDoctor,
  MResultOfDoctorByUser,
} from 'src/app/shared/models/doctor';
import {
  IGetAllSchedule,
  ISchedule,
  IWorkingSchedules,
} from 'src/app/shared/interfaces/schedule';
import {
  MBookingSchedule,
  MEditSchedule,
  MGetAllSchedule,
  MGetAllScheduleForAd,
  MGetAllWorkingSchedule,
  MSchedule,
} from 'src/app/shared/models/schedule';
import {
  MBooking,
  MDatesAuthed,
  MDoneSchedule,
  MScheduleByDoctor,
  MScheduleByUser,
  MUserBooking,
} from 'src/app/shared/models/booking';
import {
  IScheduleBooking,
  IScheduleByDoctor,
  IScheduleByUser,
  IUserBooking,
  IUserGetAll,
} from 'src/app/shared/interfaces/booking';
import {
  MCreatePost,
  MDetailPost,
  MGetPosts,
  MLatestPost,
  MUpdatePost,
} from 'src/app/shared/models/post';

import { IGetPosts } from 'src/app/shared/interfaces/post';
import { MDelete, MGetAll, MMedia } from 'src/app/shared/models/media';
import {
  MCreateGroupChat,
  MFetchChat,
  MFindUser,
  MGetAllMemberInGroupChat,
  MMemberToGroup,
  MRenameGroupChat,
} from 'src/app/shared/models/chat';
import { IAccessChat, ICreateGroupChat } from 'src/app/shared/interfaces/chat';
import { MGetAllMessages, MSendMessage } from 'src/app/shared/models/message';
import {
  IGetAllMessage,
  IGroup,
  IMember,
  ISendMessage,
} from 'src/app/shared/interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  auth = {
    SignIn: (command: Partial<ISignIn>) =>
      this.http.post<MSignIn>(SIGN_IN, command).pipe(
        tap((res) => {
          this.storageService.cookie.delete('id');
          this.storageService.cookie.delete('name');
          this.storageService.cookie.delete('email');
          this.storageService.cookie.removeAll();
          this.storageService.local.removeAll();
          this.storageService.cookie.set('id', res.data._id);
          this.storageService.cookie.set('name', res.data.name);
          this.storageService.cookie.set('email', res.data.email);
          this.storageService.local.set('accessToken', res.data.accessToken);
          this.storageService.local.set('refreshToken', res.data.refreshToken);
          this.storageService.local.set('avatar', res.data.avatar);
        })
      ),
    SignUp: (command: Partial<ISignUp>) =>
      this.http.post<MSignUp>(SIGN_UP, command),
    refreshToken: () =>
      this.http.post(REFRESH_TOKEN, null, {
        headers: new HttpHeaders({
          refreshtoken: `${this.storageService.local.get('refreshToken')}`,
        }),
      }),
    logOut: (command: Partial<string>) =>
      this.http.put<string>(LOGOUT + command, null),
    getInfo: (command: Partial<string>) =>
      this.http.get<MUser>(GET_INFO + command),
  };

  admin = {
    CreateNewEmployee: (command: Partial<ICreateNewEmployee>) =>
      this.http.post<MResultOfEmployee>(CREATE_NEW_EMPLOYEE, command),
    getAllEmployees: (command: IGetAllEmployees) => {
      let params = new HttpParams();
      params = params.set('page', command.page?.toString());
      params = params.set('size', command.size.toString());
      params = params.set('gender', command.gender);
      params = params.set('active', command.active);
      params = params.set('searchString', command.searchString);
      return this.http.get<MGetAllEmployees>(GET_ALL_EMPLOYEES, { params });
    },
    GetDetailInforEmployee: (command: Partial<string>) =>
      this.http.get<MResultOfEmployee>(GET_DETAIL_INFOR_EMPLOYEE + command),
    EditInforEmployee: (command: Partial<IEditInforEmployee>) =>
      this.http.put<MResultOfEmployee>(EDIT_INFOR_EMPLOYEE, command),
    DeleteEmployee: (command: Partial<string>) =>
      this.http.delete<MDeleteEmployee>(DELETE_EMPLOYEE + command),

    //center
    createNewCenter: (command: Partial<ICreateNewCenter>) =>
      this.http.post<MResultOfCenter>(CREATE_NEW_CENTER, command),
    getAllCenters: (command: IGetAllCenters) => {
      let params = new HttpParams();
      params = params.set('page', command.page?.toString());
      params = params.set('size', command.size.toString());
      params = params.set('active', command.active);
      params = params.set('searchString', command.searchString);
      return this.http.get<MGetAllCenters>(GET_ALL_CENTERS, { params });
    },
    getDetailInforCenter: (command: Partial<string>) =>
      this.http.get<MResultOfCenter>(GET_DETAIL_INFOR_CENTER + command),
    editInforCenter: (command: Partial<IEditInforCenter>) =>
      this.http.put<MResultOfCenter>(EDIT_INFOR_CENTER, command),
    deleteCenter: (command: Partial<string>) =>
      this.http.delete<MDeleteCenter>(DELETE_CENTER + command),
  };

  doctor = {
    createNewDoctor: (command: Partial<ICreateNewDoctor>) =>
      this.http.post<MResultOfDoctor>(CREATE_NEW_DOCTOR, command),
    getAllDoctors: (command: IGetAllDoctors) => {
      let params = new HttpParams();
      params = params.set('page', command.page?.toString());
      params = params.set('size', command.size.toString());
      params = params.set('active', command.active);
      params = params.set('searchString', command.searchString);
      return this.http.get<MGetAllDoctors>(
        GET_ALL_DOCTORS + this.storageService.cookie.get('id'),
        { params }
      );
    },
    editInforDoctor: (command: Partial<IEditInforDoctor>) =>
      this.http.put<MResultOfDoctor>(EDIT_INFOR_DOCTOR, command),
    getDetailInforDoctor: (command: Partial<string>) =>
      this.http.get<MResultOfDoctor>(GET_DETAIL_INFOR_DOCTOR + command),
    getDetailInforDoctorByUser: (command: Partial<string>) =>
      this.http.get<MResultOfDoctorByUser>(
        GET_DETAIL_INFOR_DOCTOR_BY_USER + command
      ),
    deleteDoctor: (command: Partial<string>) =>
      this.http.delete<MDeleteDoctor>(DELETE_DOCTOR + command),
  };

  schedule = {
    registerSchedule: (command: Partial<ISchedule>) =>
      this.http.post<MSchedule>(REGISTER_SCHEDULE, command),
    getSchedulesByDoctor: (command: IGetAllSchedule) => {
      let params = new HttpParams();
      params = params.set('page', command.page);
      params = params.set('size', command.size);
      params = params.set('auth', command.auth);
      return this.http.get<MGetAllSchedule>(
        GET_SCHEDULE_BY_DOCTOR + this.storageService.cookie.get('id'),
        { params }
      );
    },
    getSchedulesByAdmin: (command: IGetAllSchedule) => {
      let params = new HttpParams();
      params = params.set('page', command.page);
      params = params.set('size', command.size);
      params = params.set('auth', command.auth);
      return this.http.get<MGetAllScheduleForAd>(
        GET_SCHEDULE_BY_ADMIN + this.storageService.cookie.get('id'),
        { params }
      );
    },
    deleteSchedule: (command: Partial<string>) =>
      this.http.delete<string>(DELETE_SCHEDULE + command),
    editSchedule: (command: Partial<ISchedule>) =>
      this.http.put<MEditSchedule>(EDIT_SCHEDULE, command),
    authSchedule: (command: Partial<String>) =>
      this.http.put<MSchedule>(AUTH_SCHEDULE + command, null),
    getWorkingScheduleByDoctor: (command: IWorkingSchedules) => {
      let params = new HttpParams();
      params = params.set('page', command.page);
      params = params.set('size', command.size);
      params = params.set('subscribed', command.subscribed);
      params = params.set('idDoctor', command.idDoctor);
      params = params.set('idCenter', command.idCenter);
      params = params.set('date', command.date);
      params = params.set('currentTime', command.currentTime);
      return this.http
        .get<MGetAllWorkingSchedule>(GET_ALL_WORKING_SCHEDULE, { params })
        .pipe(
          map((response) => {
            response.data.sort((a, b) => {
              return (
                new Date(a.timeStart).getTime() -
                new Date(b.timeStart).getTime()
              );
            });
            return response;
          })
        );
    },
  };

  booking = {
    getBooking: (command: IUserGetAll) => {
      let params = new HttpParams();
      (params = params.set('page', command.page)),
        (params = params.set('size', command.size));
      return this.http.get<MBooking>(GET_BOOKING, { params });
    },
    getScheduleBooking: (command: IScheduleBooking) => {
      let params = new HttpParams();
      params = params.set('idParent', command.idParent);
      params = params.set('idDoctor', command.idDoctor);
      params = params.set('date', command.date);
      return this.http
        .get<MBookingSchedule>(GET_SCHEDULE_BOOKING, { params })
        .pipe(
          map((response) => {
            response.data.sort((a, b) => {
              return (
                new Date(a.timeStart).getTime() -
                new Date(b.timeStart).getTime()
              );
            });
            return response;
          })
        );
    },
    getInfoCenterByUser: (command: Partial<string>) =>
      this.http.get<MInfoCenterByUser>(GET_INFO_CENTER_BY_USER + command),
    userBooking: (command: Partial<IUserBooking>) =>
      this.http.put<MUserBooking>(USER_BOOKING, command),
    getDatesAuthed: (command: Partial<string>) =>
      this.http.get<MDatesAuthed>(GET_DATE_AUTHED + command).pipe(
        map((res) => {
          res.data.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          return res;
        })
      ),
    getScheduleByUser: (command: IScheduleByUser) => {
      let params = new HttpParams();
      params = params.set('page', command.page);
      params = params.set('size', command.size);
      params = params.set('idUser', command.idUser);
      params = params.set('done', command.done);
      return this.http.get<MScheduleByUser>(GET_SCHEDULE_BY_USER, { params });
    },
    getScheduleByDoctor: (command: IScheduleByDoctor) => {
      let params = new HttpParams();
      params = params.set('page', command.page);
      params = params.set('size', command.size);
      params = params.set('idDoctor', command.idDoctor);
      params = params.set('done', command.done);
      return this.http.get<MScheduleByDoctor>(GET_SCHEDULES_BY_DOCTOR, {
        params,
      });
    },
    doneSchedule: (command: string) =>
      this.http.put<MDoneSchedule>(DONE_SCHEDULE + command, null),
  };

  post = {
    createPost: (command: string) =>
      this.http.post<MCreatePost>(CREATE_POST + command, null),
    updatePost: (command: FormData) =>
      this.http.put<MUpdatePost>(
        UPDATE_POST + this.storageService.local.get('idPost'),
        command
      ),
    getAllPosts: (command: IGetPosts) => {
      let params = new HttpParams();
      params = params.set('page', command.page);
      params = params.set('size', command.size);
      params = params.set('keyword', command.keyword);
      return this.http.get<MGetPosts>(GET_POST, { params });
    },
    getDetailPostById: (command: string) =>
      this.http.get<MDetailPost>(GET_DETAIL_POST_BY_ID + command),
    getlatestPost: () => this.http.get<MLatestPost>(GET_LASTEST_POST),
    deletePost: (command: string) =>
      this.http.delete<MDetailPost>(DELETE_POST + command),
  };

  media = {
    upload: (command: FormData) =>
      this.http.post<MMedia>(UPLOAD_MEDIA, command),
    getAll: (command: string) =>
      this.http.get<MGetAll>(GET_ALL_IMAGES + command),
    delete: (command: string) =>
      this.http.delete<MDelete>(DELETE_IMAGE + command),
  };

  chat = {
    findUser: (command: string) => {
      let params = new HttpParams();
      params = params.set('keyword', command);
      return this.http.get<MFindUser>(FIND_USER, {
        params,
      });
    },

    createGroupChat: (command: ICreateGroupChat) =>
      this.http.post<MCreateGroupChat>(CREATE_GROUP_CHAT, command),

    fetchChats: () => this.http.get<MFetchChat>(ACCESS_AND_FETCH_CHAT),
    accessChat: (command: IAccessChat) =>
      this.http.post<MFetchChat>(ACCESS_AND_FETCH_CHAT, command),
    deleteChat: (command: string) =>
      this.http.delete<string>(DELETE_CHAT + command),
    addMemberToGroup: (command: IMember) =>
      this.http.put<MMemberToGroup>(ADD_MEMBER, command),
    getAllMemberInGroupChat: (command: string) =>
      this.http.get<MGetAllMemberInGroupChat>(GET_ALL_MEMBER + command),
    removeMember: (command: IMember) =>
      this.http.put<MMemberToGroup>(REMOVE_MEMBER, command),
    renameGroupChat: (command: IGroup) =>
      this.http.put<MRenameGroupChat>(RENAME_GROUP_CHAT, command),
  };

  message = {
    getAllMessages: (command: IGetAllMessage) => {
      let params = new HttpParams();
      params = params.set('id', command.id);
      params = params.set('page', command.page);
      return this.http.get<MGetAllMessages>(GET_ALL_MESSAGES, { params }).pipe(
        map((response) => {
          response.data.sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          });
          return response;
        })
      );
    },
    sendMessage: (command: ISendMessage) =>
      this.http.post<MSendMessage>(SEND_MESSAGE, command),
  };
}
