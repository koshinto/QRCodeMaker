import { BrowserWindow, app, App, Menu, ipcMain, dialog } from 'electron'
import { resolve } from 'path'
const appName = require('../package.json').name

class CreateWindow {
	private win: BrowserWindow
	private app: App
	private mainURL: string = resolve(__dirname, '../src/index.html')
	private debug: boolean = /--debug/.test(process.argv[2])

	constructor(app: App) {
		this.app = app
		this.override()
		this.app.on('window-all-closed', this.onWindowAllClosed.bind(this))  
		this.app.on('ready', this.onReady.bind(this))
		this.app.on('activate', this.onActivated.bind(this))
	}

	private override() {
		this.app.name = !appName ? 'QRCodeMaker' : appName
		const isMac = process.platform === 'darwin'
		const template: any = [
			// Application Menu
			...(isMac ? [{
				label: this.app.name,
				submenu: [
					{ role: 'about' },
					{ role: 'hide' },
					{ role: 'unhide' },
					{ role: 'quit' }
				]
			}] : []),
			// File Menu
			{
				label: 'File',
				submenu: [
					{ role: 'undo' },
					{ role: 'redo' },
					{ type: 'separator' },
					{ role: 'cut' },
					{ role: 'copy' },
					{ role: 'paste' },
					{ role: 'delete' },
					{ role: 'selectAll' },
					{ type: 'separator' },
					(isMac ? { role: 'close' } : { role: 'quit' })
				]
			},
			// View
			{
				label: 'View',
				submenu: [
					{ role: 'reload' },
					{ role: 'forcereload' },
					{ role: 'toggledevtools' },
					{ type: 'separator' },
					{ role: 'resetzoom' },
					{ role: 'zoomin' },
					{ role: 'zoomout' },
					{ type: 'separator' },
					{ role: 'togglefullscreen' },
					{ role: 'minimize' },
					{ role: 'zoom' },
					...(isMac ? [
						{ type: 'separator' },
						{ role: 'front' },
						{ type: 'separator' },
						{ role: 'window' }
					] : [])
				]
			},
			// Help Menu
			{
				role: 'Help',
				submenu: [
					{
						label: 'Contact',
						click: async () => {
							const { shell } = require('electron')
							await shell.openExternal('https://www.cogitare-de-fun.com/')
						}
					}
				]
			}
		]
		let menu: Menu = Menu.buildFromTemplate(template)
		Menu.setApplicationMenu(menu)
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

		if (this.debug) {
			this.win.webContents.openDevTools()
		}
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
			{ name: "Images", extensions: [replaceExtension(extension)] },
		]
	}
	dialog.showSaveDialog(options).then(function (filepath) {
		event.sender.send('saved', filepath)
	})
})

function replaceExtension(extension: string) {
	let replaced = extension.replace(/jpeg/, 'jpg')
	return replaced
}