import { getRequest, postJsonRequest, postRequest } from '@/utils/request'

// 高级数据库接口
export function search_by_userid(data) {
  return postJsonRequest('/search_by_userid',data)
}
export function rec_by_userid(data) {
  return postJsonRequest('/rec_by_userid',data)
}
export function search_by_all(data) {
  return postJsonRequest('/search_by_all',data)
}
export function getallgenre() {
  return getRequest('/get_genre_all')
}
// 登录 注册 获取验证码
export function RetrieveCaptcha(data){
  return postRequest('/captcha', data)
}
export function Login(params) {
  return postJsonRequest('/login', params)
}
export function Register(params) {
  return postJsonRequest('/register', params)
}
export function Logout(data) {
  return postJsonRequest('/logout',data)
}
export function getPubKey() {
  return getRequest('/api')
}


export function uploadComment(data) {
  return postJsonRequest('/uploadComment',data)
}
export function upload(data) {
  return postRequest('/upload', data)
}
export function getallimg() {
  return getRequest('/getallimg')
}
export function setfavourite(data) {
  return postJsonRequest('/setfavourite',data)
}
export function updateinfo(data) {
  return postRequest('/updateinfo', data)
}
export function getinfo() {
  return postJsonRequest('/getinfo')
}


export function upload_img(data) {
  return postRequest('/upload-img', data)
}
export function upload_video(data) {
  return postRequest('/upload-video', data)
}


export function getCourseAll() {
  return postJsonRequest('/course-info-hot')
}
export function uploadCourse(data) {
  return postRequest('/course-upload', data)
}
export function updateCourse(data) {
  return postRequest('/course-update',data)
}
export function deleteCourse(data) {
  return postJsonRequest('/course-delete',data)
}


export function getTeacherAll() {
  return postJsonRequest('/teacher-info-all')
}
export function uploadTeacher(data) {
  return postRequest('/teacher-upload', data)
}
export function updateTeacher(data) {
  return postRequest('/teacher-update',data)
}
export function deleteTeacher(data) {
  return postJsonRequest('/teacher-delete',data)
}

export function getInfoAll() {
  return postJsonRequest('/article-info-all')
}
export function uploadInfo(data) {
  return postRequest('/article-upload', data)
}
export function updateInfo(data) {
  return postRequest('/article-update',data)
}
export function deleteInfo(data) {
  return postJsonRequest('/article-delete',data)
}



// export function getTopBg() {
//   return postRequest('/top-bg')
// }
// export function uploadTopBg(data) {
//   return postRequest('/top-bg-upload', data)
// }
// export function deleteTopBg(data) {
//   return postJsonRequest('/top-bg-delete',data)
// }

export function getTopBg() {
  return postJsonRequest('/headpic-info-all')
}
export function uploadTopBg(data) {
  return postRequest('/headpic-upload', data)
}
export function deleteTopBg(data) {
  return postJsonRequest('/headpic-delete',data)
}


export function getUserInfo() {
  return getRequest('/user-info')
}

export function UploadWork(data) {
  return postRequest('/work-upload', data)
}
export function getWorkByAuthor() {
  return postJsonRequest('/work-info-by-author-all')
}
export function getAllWorks() {
  return postJsonRequest('/work-info-all')
}
export function updateWork(data) {
  return postRequest('/work-update',data)
}
export function deleteWork(data) {
  return postJsonRequest('/work-delete',data)
}



export function getSections() {
  return postRequest('/sections')
}
export function getSection(data) {
  return postJsonRequest('/section',data)
}
export function getSectionsFrontLimit() {
  return postRequest('/sections-front-limit')
}
export function uploadSection(data) {
  return postJsonRequest('/section-upload',data)
}
export function updateSection(data) {
  return postJsonRequest('/section-update',data)
}
export function deleteSection(data) {
  return postJsonRequest('/section-delete',data)
}

export function getItemBySection(data) {
  return postJsonRequest('/item-info-by-section',data)
}
export function uploadItem(data) {
  return postJsonRequest('/item-upload',data)
}
export function deleteItem(data) {
  return postJsonRequest('/item-delete',data)
}