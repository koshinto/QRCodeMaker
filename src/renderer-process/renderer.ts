import { remote, ipcRenderer, BrowserWindow } from "electron"
import * as path from "path"


const genbtn = document.getElementById('genbtn')
let win:BrowserWindow

genbtn.addEventListener('click', (event) => {
	const modalPath: string = path.resolve(__dirname, `../../src/modal-window.html`)
	let url = (<HTMLInputElement>document.getElementById('url')).value

	if (url !== '') {
		// ipcRenderer.sendSync('qrcode', url)
	
		win = new remote.BrowserWindow ({
			width: 400,
			height: 320,
			titleBarStyle: "hidden",
		})
	
		win.on('close', () => { win = null })
		win.loadFile(modalPath)
		win.show()
	} else {
		// テキストが入力されていない場合、エラーメッセージを表示
		const message: string = 'Error! URL is blank.'
		let el = (<HTMLInputElement>document.getElementById('notice'))
		el.innerHTML = `<p>${message}</p>`
	}
})


console.log('renderer ready.')