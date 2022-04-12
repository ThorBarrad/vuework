import Cookies from 'js-cookie'
import Vue from 'vue'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return localStorage.getItem('pro__Access-Token')
}

export function setToken(token) {
  Vue.ls.set('Access-Token', token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  Vue.ls.remove('Access-Token')
  return Cookies.remove(TokenKey)
}
