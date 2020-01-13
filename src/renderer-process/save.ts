import { ipcRenderer, remote } from "electron"
import { writeFile } from "fs"

const saveButton = <HTMLInputElement>document.getElementById('save')


saveButton.addEventListener('click', (event) => {
  const extension: string = getChooseExtension()
  ipcRenderer.send('save-dialog', extension)
})

ipcRenderer.on('saved', (event, filepath) =>{
  if (!filepath.canceled) {
    const canvas = document.getElementsByTagName('canvas')[0]
    if (canvas) {
      let dataType: string = getChooseExtension()
      const dataURL = canvas.toDataURL(`image/${dataType}`)
      const dataURI = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "")
      let path = filepath.filePath.replace(/jpeg/, "jpg")
      writeFile(path, dataURI, 'base64', (error) => {
        if (error) {
          console.log(error)
        }
      })
    }
  } else {
    console.log('Processing was interruption')
  }
})

function getChooseExtension() {
  let dataType: HTMLInputElement = null
  let extension: string = 'png'
  const dataTypeElements = document.getElementsByName('extension')
  dataTypeElements.forEach(dataTypeElement => {
    dataType = (dataTypeElement as HTMLInputElement)
    if (dataType.checked) {
      extension = dataType.value
    }
  });
  return extension
}