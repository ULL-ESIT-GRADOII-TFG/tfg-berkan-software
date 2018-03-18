'use strict'

const electron = require('electron')
const mainwindow = require('./config/electron/window')
const menu = require('./config/electron/menu')
const Menu = electron.Menu  
const app = electron.app // Module to control application life.

/* This method will be called when Electron has finished 
initialization and is ready to create browser windows. 
Call the function imported from window.js*/
app.on('ready', mainwindow.createWindow)

/* Quit when all windows are closed. */
app.on('window-all-closed', function () {
  /* On OS X it is common for applications and their menu bar
  to stay active until the user quits explicitly with Cmd + Q. */
  if (process.platform !== 'darwin') {
    app.quit()
  }
})





