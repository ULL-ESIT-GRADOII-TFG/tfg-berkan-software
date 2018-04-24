const electron = require('electron')
const ipc = electron.ipcRenderer

function OAuthLogin () {
  ipc.send('github-oauth', 'getToken')
}
