'use strict'

const electron = require('electron')
const app = electron.app // Module to control application life.
const ipcMain = electron.ipcMain
const topsidemenu = require('./config/electron/menu')
const path = require('path')
const url = require('url')
const BrowserWindow = electron.BrowserWindow // Module to create native. browser window.
const ElectronViewRenderer = require('electron-view-renderer')

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
const options = {
  scope: ['read:user', 'repo', 'admin:org', 'admin:org_hook', 'delete_repo']
}
const githubOAuth = electronOauth2(oauthConfig, windowParams)
/// /// OAUTH

/// /// RENDERER
const viewRenderer = new ElectronViewRenderer({
  viewPath: 'resources/views',          
  viewProtcolName: 'view',     
  useAssets: true,               
  assetsPath: 'resources/assets',          
  assetsProtocolName: 'asset'   
})
viewRenderer.use('ejs')
/// /// RENDERER

let win // Necessary Keep a global reference of the window object.
let usertoken // Variable who got the user access token.

/* Function to create the mainwindow of the electron app
The function is exported to use when electron is inicializate in app.js. */
function createWindow () {
  win = new BrowserWindow({ // Create the window.
    title: 'AutoCheck',
    width: 1281,
    height: 800,
    minWidth: 1281,
    minHeight: 800
  //  icon: path.join(__dirname, 'assets/icons/png/64x64.png')
  })
  // Load the index of the app.
  viewRenderer.load(win, 'login')


  // Emitted when the window is closed.
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows.
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

/* This method will be called when Electron has finished
initialization and is ready to create browser windows.
Call the function imported from window.js */
app.on('ready', createWindow)

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
ipcMain.on('github-oauth', (event, arg) => {
  githubOAuth.getAccessToken(options)
    .then(token => {
      usertoken = token
      viewRenderer.load(win, 'index')
    }, err => {
      console.log('Error while getting token', err)
    })
})

/* Function called from ipc.renderer to render index. */
ipcMain.on('render-index', (event, arg) => {
  viewRenderer.load(win, 'index')
})

/* Function called from ipc.renderer to render profile. */
ipcMain.on('render-profile', (event, arg) => {
  viewRenderer.load(win, 'profile')
})
/* Function called from ipc.renderer to render dashboard. */

