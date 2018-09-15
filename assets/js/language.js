const language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || navigator.browserLanguage || 'en'
let multilangElements = document.querySelectorAll('[data-de]')
for (const elem of multilangElements) {
  if (language.toLowerCase().includes('de') > -1) {
    switch (elem.nodeName) {
      case 'INPUT':
      case 'TEXTAREA':
        elem.placeholder = elem.dataset.de
        break
      default:
        elem.innerHTML = elem.dataset.de
        break
    }
  }
}
