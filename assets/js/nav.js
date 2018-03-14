function openNav() {
  document.getElementById('nav').style.transform = 'translateY(0%)'
  updateURL('#open')
}

function closeNav() {
  document.getElementById('nav').style.transform = 'translateY(-100%)'
  updateURL('')
}
