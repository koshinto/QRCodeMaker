import { ipcRenderer } from "electron"
import * as qrcode from 'qrcode'


const generate = <HTMLInputElement>document.getElementById('generate')

let canvas = document.getElementsByTagName('canvas')[0]
let context = canvas.getContext('2d')
context.fill()

let url: string
let alert = <HTMLInputElement>document.getElementById('alert')

generate.addEventListener('click', (event) => {
	url = (<HTMLInputElement>document.getElementById('url')).value
	alert.textContent = null
	context.clearRect(0, 0, canvas.width, canvas.height)
	if (url !== '') {
		qrcode.toCanvas(canvas, url, function (error) {
			if (error) { 
				console.log(error)
				alert.innerHTML = `<p>Error.</p>`
			}
		})
	} else {
		alert.innerHTML = '<p>URL is Blank.</p>'
	}
})


let message = ipcRenderer.sendSync('message', 'renderer ready')
console.log(message)