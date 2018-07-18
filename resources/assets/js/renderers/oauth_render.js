const electron = require('electron')
const ipcRender = electron.ipcRenderer

function OAuthLogin () {
  ipcRender.send('github-oauth', 'getToken')
}
