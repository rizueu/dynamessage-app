import http from './http';

class Services {
  login(credentials) {
    return http(null).post('/auth/login', credentials);
  }
  register(credentials) {
    return http(null).post('/auth/register', credentials);
  }
  activate(id) {
    return http(null).patch('/auth/activate', {id});
  }
  getUser(token) {
    return http(token).get('/auth/user');
  }
  editUser(token, data) {
    return http(token).patch('/auth/edit/profile', data);
  }
  editPassword(token, newPassword) {
    return http(token).patch('/auth/edit/password', newPassword);
  }
  upload(token, data) {
    return http(token).patch('/auth/edit/photo', data);
  }
  getContact(token, url = '/friends') {
    return http(token).get(url);
  }
  getAllContact(token, keyword = '') {
    return http(token).get(`/contact?search=${keyword}`);
  }
  getFriendById(token, id) {
    return http(token).get(`/friends/${id}`);
  }
  deleteFriend(token, id) {
    return http(token).delete(`/friends/delete?id=${id}`);
  }
  getChatLists(token) {
    return http(token).get('/chat');
  }
}

export default new Services();
