const ROOT_URL = 'http://localhost:3003';

// user
const SIGN_IN = ROOT_URL + '/auth/signin';
const SIGN_UP = ROOT_URL + '/auth/signup';
const REFRESH_TOKEN = ROOT_URL + '/auth/refreshToken';
const LOGOUT = ROOT_URL + '/auth/logout/';
const GET_INFO = ROOT_URL + '/auth/getInforUser/';

// employee
const CREATE_NEW_EMPLOYEE = ROOT_URL + '/employee/create-new-employee';
const GET_ALL_EMPLOYEES = ROOT_URL + '/employee/get-all-employee/';
const GET_DETAIL_INFOR_EMPLOYEE =
  ROOT_URL + '/employee/get-detail-infor-employee/';
const EDIT_INFOR_EMPLOYEE = ROOT_URL + '/employee/edit-infor-employee/';
const DELETE_EMPLOYEE = ROOT_URL + '/employee/delete-employee/';

//center
const CREATE_NEW_CENTER = ROOT_URL + '/center/create-new-center';
const GET_ALL_CENTERS = ROOT_URL + '/center/get-all-center/';
const GET_DETAIL_INFOR_CENTER = ROOT_URL + '/center/get-detail-infor-center/';
const EDIT_INFOR_CENTER = ROOT_URL + '/center/edit-infor-center/';
const DELETE_CENTER = ROOT_URL + '/center/delete-center/';

//doctor
const CREATE_NEW_DOCTOR = ROOT_URL + '/doctor/create-new-doctor';
const GET_ALL_DOCTORS = ROOT_URL + '/doctor/get-all-doctor/';
const GET_DETAIL_INFOR_DOCTOR = ROOT_URL + '/doctor/get-detail-infor-doctor/';
const GET_DETAIL_INFOR_DOCTOR_BY_USER =
  ROOT_URL + '/doctor/get-detail-infor-doctor-by-user/';
const EDIT_INFOR_DOCTOR = ROOT_URL + '/doctor/edit-infor-doctor/';
const DELETE_DOCTOR = ROOT_URL + '/doctor/delete-doctor/';

//schedule
const REGISTER_SCHEDULE = ROOT_URL + '/schedule/register-schedule-by-doctor';
const GET_SCHEDULE_BY_DOCTOR =
  ROOT_URL + '/schedule/get-all-schedules-by-doctor/';
const GET_DETAIL_SCHEDULE =
  ROOT_URL + '/schedule/get-detail-schedule-by-doctor/';
const EDIT_SCHEDULE = ROOT_URL + '/schedule/edit-schedule-by-doctor';
const DELETE_SCHEDULE = ROOT_URL + '/schedule/delete-schedule-by-doctor/';
const GET_SCHEDULE_BY_ADMIN = ROOT_URL + '/schedule/get-all-schedules-by-ad/';
const AUTH_SCHEDULE = ROOT_URL + '/schedule/auth-schedule/';
const GET_ALL_WORKING_SCHEDULE = ROOT_URL + '/schedule/get-schedules/';

//booking
const GET_BOOKING = ROOT_URL + '/booking/get-all/';
const GET_SCHEDULE_BOOKING = ROOT_URL + '/booking/scheduleBooking/';
const GET_INFO_CENTER_BY_USER =
  ROOT_URL + '/center/get-detail-infor-center-by-user/';
const USER_BOOKING = ROOT_URL + '/booking/userBooking';
const GET_DATE_AUTHED = ROOT_URL + '/booking/getDatesAuthed/';
const GET_SCHEDULE_BY_USER = ROOT_URL + '/booking/get-schedule-by-user/';
const GET_SCHEDULES_BY_DOCTOR = ROOT_URL + '/booking/get-schedule-by-doctor/';
const DONE_SCHEDULE = ROOT_URL + '/booking/done-schedule/';

//post
const CREATE_POST = ROOT_URL + '/post/create-post/';
const UPDATE_POST = ROOT_URL + '/post/update-post/';
const GET_POST = ROOT_URL + '/post/get-all-posts';
const GET_DETAIL_POST_BY_ID = ROOT_URL + '/post/get-detail-post/';
const GET_LASTEST_POST = ROOT_URL + '/post/get-latest-post';
const DELETE_POST = ROOT_URL + '/post/delete-post/';

//Media
const UPLOAD_MEDIA = ROOT_URL + '/media/upload-media-in-post';
const GET_ALL_IMAGES = ROOT_URL + '/media/get-all-images-in-post/';
const DELETE_IMAGE = ROOT_URL + '/media/delete-image-in-post-by-id/';

//chat
const FIND_USER = ROOT_URL + '/chat/find-member';
const CREATE_GROUP_CHAT = ROOT_URL + '/chat/create-group-chat';
const ACCESS_AND_FETCH_CHAT = ROOT_URL + '/chat';
const DELETE_CHAT = ROOT_URL + '/chat/delete-chat/';
const GET_ALL_MEMBER = ROOT_URL + '/chat/get-all-member-in-group-chat/';
const ADD_MEMBER = ROOT_URL + '/chat/add-member-to-group';
const REMOVE_MEMBER = ROOT_URL + '/chat/remove-member-in-group';
const RENAME_GROUP_CHAT = ROOT_URL + '/chat/rename-group-chat';

//Message
const GET_ALL_MESSAGES = ROOT_URL + '/message/get-all-message/';
const SEND_MESSAGE = ROOT_URL + '/message/send-message';

export {
  GET_INFO,
  RENAME_GROUP_CHAT,
  REMOVE_MEMBER,
  GET_ALL_MEMBER,
  ADD_MEMBER,
  GET_ALL_MESSAGES,
  SEND_MESSAGE,
  DELETE_CHAT,
  ACCESS_AND_FETCH_CHAT,
  FIND_USER,
  CREATE_GROUP_CHAT,
  UPLOAD_MEDIA,
  DELETE_IMAGE,
  GET_ALL_IMAGES,
  GET_POST,
  DELETE_POST,
  CREATE_POST,
  GET_LASTEST_POST,
  GET_DETAIL_POST_BY_ID,
  ROOT_URL,
  SIGN_IN,
  SIGN_UP,
  LOGOUT,
  CREATE_NEW_EMPLOYEE,
  GET_ALL_EMPLOYEES,
  GET_DETAIL_INFOR_EMPLOYEE,
  EDIT_INFOR_EMPLOYEE,
  DELETE_EMPLOYEE,
  REFRESH_TOKEN,
  CREATE_NEW_CENTER,
  GET_ALL_CENTERS,
  GET_DETAIL_INFOR_CENTER,
  EDIT_INFOR_CENTER,
  DELETE_CENTER,
  CREATE_NEW_DOCTOR,
  GET_ALL_DOCTORS,
  GET_DETAIL_INFOR_DOCTOR,
  EDIT_INFOR_DOCTOR,
  DELETE_DOCTOR,
  REGISTER_SCHEDULE,
  GET_DETAIL_SCHEDULE,
  GET_SCHEDULE_BY_DOCTOR,
  EDIT_SCHEDULE,
  DELETE_SCHEDULE,
  GET_SCHEDULE_BY_ADMIN,
  AUTH_SCHEDULE,
  GET_ALL_WORKING_SCHEDULE,
  GET_BOOKING,
  GET_DETAIL_INFOR_DOCTOR_BY_USER,
  GET_SCHEDULE_BOOKING,
  GET_INFO_CENTER_BY_USER,
  USER_BOOKING,
  GET_DATE_AUTHED,
  GET_SCHEDULE_BY_USER,
  GET_SCHEDULES_BY_DOCTOR,
  DONE_SCHEDULE,
  UPDATE_POST,
};
