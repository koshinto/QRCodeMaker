import { remote } from "electron"
const { Menu, MenuItem } = remote
const textArea = document.getElementById('url')

let menu = new Menu()
menu.append(new MenuItem({ role: 'copy' }))
menu.append(new MenuItem({ role: 'cut' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ role: 'selectAll' }))

window.addEventListener('contextmenu', (error) => {
  error.preventDefault()
  menu.popup({ window: remote.getCurrentWindow() })
}, false)