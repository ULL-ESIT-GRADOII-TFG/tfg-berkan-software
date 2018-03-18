'use strict'

const electron = require('electron') 
const path = require('path')
const url = require('url')
const app = electron.app // Module to control application life.
const BrowserWindow = electron.BrowserWindow // Module to create native browser window.

let win // Necessary Keep a global reference of the window object.

/* Function to create the mainwindow of the electron app
The function is exported to use when electron is inicializate in app.js. */
function createWindow() {
  win = new BrowserWindow({ // Create the window.
    title: "App Title",
    width: 1281,
    height: 800, 
    minWidth: 1281,
    minHeight: 800,
    backgroundColor: '#312450'
  //  icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })
  // Load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
  
app.on('activate', function () {
  /* On OS X it's common to re-create a window in the app when the
  dock icon is clicked and there are no other windows open. */
  if (win === null) {
    createWindow()
  }
})
  
module.exports.createWindow = createWindow