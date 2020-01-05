import { ipcRenderer } from "electron"
import * as qrcode from 'qrcode'


const generate = <HTMLInputElement>document.getElementById('generate')
let notice = <HTMLInputElement>document.getElementById('notice')
let alert: Array<string> = null

let canvas = document.getElementsByTagName('canvas')[0]
let context = canvas.getContext('2d')
context.fill()

let url: string
let saveButton = <HTMLButtonElement>document.getElementById('save')

generate.addEventListener('click', (event) => {
	initialize()
	url = (<HTMLInputElement>document.getElementById('url')).value
	if (url !== '') {
		qrcode.toCanvas(canvas, url, function (error) {
			if (error) { 
				console.log(error)
				alert = ['Unexpected error.']
				setNotice(alert)
			}
		})
		saveButton.style.display = 'block' 
	} else {
		alert = ['URL is blank.', 'Please put value in the textbox.']
		setNotice(alert)
	}
})

function initialize() {
	notice.innerHTML = null
	alert = null
	context.clearRect(0, 0, canvas.width, canvas.height)
	saveButton.style.display = 'none'
}

function setNotice(alert: Array<string>) {
	if (alert) {
		for (const i in alert) {
			if (alert.hasOwnProperty(i)) {
				notice.innerHTML += `<li class="notice-message">${alert[i]}</li>`;
			}
		}
	}
}

let message = ipcRenderer.sendSync('message', 'renderer ready')
console.log(message)