'use strict'

const electron = require('electron')
const app = electron.app // Module to control application life.
const ipc = electron.ipcMain
const mainwindow = require('./config/electron/window')
const topsidemenu = require('./config/electron/menu')

/// /// OAUTH
const oauthConfig = require('./config/electron/oauth').oauth
const electronOauth2 = require('electron-oauth2')
const windowParams = {
  alwaysOnTop: true,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: false
  }
}
const githubOAuth = electronOauth2(oauthConfig, windowParams)
/// /// OAUTH

/* This method will be called when Electron has finished
initialization and is ready to create browser windows.
Call the function imported from window.js */
app.on('ready', mainwindow.createWindow)

/* Quit when all windows are closed. */
app.on('window-all-closed', function () {
  /* On OS X it is common for applications and their menu bar
  to stay active until the user quits explicitly with Cmd + Q. */
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

/* Set topside menu with Electron Menu Functions. */
app.on('ready', topsidemenu.createMenu)

/* Function called from ipc.renderer to githuboauth in login. */
ipc.on('github-oauth', (event, arg) => {
  githubOAuth.getAccessToken({})
    .then(token => {
      event.sender.send('github-oauth-reply', token)
    }, err => {
      console.log('Error while getting token', err)
    })
})
