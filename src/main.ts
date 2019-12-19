import { BrowserWindow, app, App, ipcMain, dialog } from 'electron'
import { resolve } from 'path'


class CreateWindow {
	private win: BrowserWindow
	private app: App
	private mainURL:string = resolve(__dirname, '../src/index.html')

	constructor(app: App) {
		this.app = app   
		this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))  
		this.app.on('ready', this.onReady.bind(this))
		this.app.on('activate', this.onActivated.bind(this))
	}

	private onWindowAllClosed() {
		if (process.platform !== 'darwin') {
			this.app.quit()
		}
	}

	private onReady() {
		this.win = new BrowserWindow ({
			width: 800,
			height: 600,
			titleBarStyle: "hidden",
			webPreferences: {
				nodeIntegration: true,
			}
		})

		this.win.webContents.openDevTools()
		this.win.loadFile(this.mainURL)
		this.win.on('closed', () => {
			this.win = null
		})
	}

	private  onActivated() {
		if (this.win === null) {
			this.onReady()
		}
	}
}

const Window: CreateWindow = new CreateWindow(app)

ipcMain.on('message', (event, args) => {
	console.log(args)
	event.returnValue = `Already started on your system. Electron ${process.versions.electron}, Chromium ${process.versions.chrome}.`
})

ipcMain.on('save-dialog',(event, extension) => {
	const options = {
		title: "Save an Image",
		filters: [
			{ name: "Images", extensions: [extension] },
		]
	}
	dialog.showSaveDialog(options).then(function (filepath) {
		event.sender.send('saved', filepath)
	})
})