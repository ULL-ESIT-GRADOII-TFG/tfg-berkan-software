const electron = require('electron')
const ipcRender = electron.ipcRenderer

function OAuthLogin () {
  ipcRender.send('github-oauth', 'getToken')
  
  ipcRender.on('github-oauth-reply', (event, arg) => {
    window.location.href = '../views/index.pug'; 
  })
}
