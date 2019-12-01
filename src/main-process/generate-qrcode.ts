import { ipcMain } from "electron"
const qrcode = require('qrcode')


class QRCodeGenerator {
	private rawURL:string
	private data:string

	constructor () {
		this.data = ''
	}

}

ipcMain.on('qrcode', (event) => {
  
}) 
