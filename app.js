'use strict'

const electron = require('electron')
const window = require('./config/electron/window')
const app = electron.app // Module to control application life.

/* This method will be called when Electron has finished 
initialization and is ready to create browser windows. 
Call the function imported from window.js*/
app.on('ready', window.createWindow)

/* Quit when all windows are closed. */
app.on('window-all-closed', function () {
  /* On OS X it is common for applications and their menu bar
  to stay active until the user quits explicitly with Cmd + Q. */
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  /* On OS X it's common to re-create a window in the app when the
  dock icon is clicked and there are no other windows open.*/
  if (window === null) {
    createWindow()
  }
})

