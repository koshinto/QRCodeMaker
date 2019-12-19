import { ipcRenderer, remote } from "electron"
import { writeFile } from "fs"

const saveButton = <HTMLInputElement>document.getElementById('save')


saveButton.addEventListener('click', (event) => {
  const extension: string = (<HTMLInputElement>document.getElementById('save-option')).value
  ipcRenderer.send('save-dialog', extension)
})

ipcRenderer.on('saved', (event, filepath) =>{
  if (typeof filepath.Canceled !== 'undefined') {
    console.log(`Save to ${filepath.filePath}`)
    const canvas = document.getElementsByTagName('canvas')[0]
    if (canvas) {
      const dataType = <HTMLInputElement>document.getElementById('save-option')
      const dataURL = canvas.toDataURL(`image/${dataType.value}`)
      console.log(dataURL)
      const dataURI = dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
      writeFile(filepath.filePath, dataURI, 'base64', (error) => {
        if (error) {
          console.log(error)
        }
      })
    }
  } else {
    console.log('Processing was interruption')
  }
})