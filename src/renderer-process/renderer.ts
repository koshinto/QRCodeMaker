import { remote, ipcRenderer, Remote, BrowserWindow } from "electron"
import * as path from "path"


const genbtn = document.getElementById('genbtn')

let win:BrowserWindow

genbtn.addEventListener('click', (event) => {
	const modalPath: string = path.resolve(__dirname, `../../src/modal-window.html`)
	let url = (<HTMLInputElement>document.getElementById('url')).value
	// ipcRenderer.sendSync('qrcode', url)

	win = new remote.BrowserWindow ({
		width: 400,
		height: 320,
		titleBarStyle: "hidden",
	})


	win.on('close', () => { win = null })
	win.loadFile(modalPath)
	win.show()
})


console.log('renderer ready.')