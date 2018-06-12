function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : false
}
function setCookie(name, value, days) {
  var d = new Date()
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
  document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
}
function deleteCookie(name) {
  setCookie(name, '', -1)
}

function switchCookiePanel(state) {
  let display = state ? 'block' : 'none'
  document.getElementById('acceptCookies').style.display = display
}
function acceptCookies() {
  setCookie('acceptCookies', true, 30)
  switchCookiePanel(false)
}
if (getCookie('acceptCookies')) {
  switchCookiePanel(false)
}
