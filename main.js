'use strict'

const electron = require('electron')
const app = electron.app // Module to control application life.
const ipcMain = electron.ipcMain
const topsidemenu = require('./config/electron/menu')
const path = require('path')
const url = require('url')
const BrowserWindow = electron.BrowserWindow // Module to create native. browser window.
const GithubApiFunctionsClass = require('./app/githubfunctions')
const GithubApiFunctions = GithubApiFunctionsClass.GithubApiFunctions
const ElectronViewRenderer = require('electron-view-renderer')
const fs = require('fs'); 
const octokit = require('@octokit/rest')({
  debug: true
})

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
  scope: ['read:user', 'repo', 'admin:org']
}
const githubOAuth = electronOauth2(oauthConfig, windowParams)
let ghUser = null
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

  // Check if the user got token.
  if (fs.existsSync('config/.autocheck/token.json')) {
    githubOAuth.getAccessToken(options)
      .then(token => {
        // Save the user token in json file.
        let user_token = {  
            access_token: token.access_token,
            token_type: token.token_type, 
            scope: token.scope,
        };
        let data = JSON.stringify(token);  
        
        fs.writeFileSync('config/.autocheck/token.json', data); 
        
        // Render orgs view view.
        let rawdata = fs.readFileSync('config/.autocheck/token.json');  
        let user = JSON.parse(rawdata); 
        ghUser = new GithubApiFunctions(user.access_token)
        let result = ghUser.userOrgs()
        
        result.then(({data, headers, status}) => {
          viewRenderer.load(win, 'orgs', {orgs: data})
        })  
      }, err => {
        console.log('Error while getting token', err)
      })
  } else {
    viewRenderer.load(win, 'login')
  }

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
      // Save the user token in json file.
      let user_token = {  
          access_token: token.access_token,
          token_type: token.token_type, 
          scope: token.scope,
      };
      let data = JSON.stringify(token);  
      
      if (!fs.existsSync('config/.autocheck/')) {
        fs.mkdirSync('config/.autocheck/')
        fs.mkdirSync('config/.autocheck/assignments/')
      }
      fs.writeFileSync('config/.autocheck/token.json', data); 
      
      // Render orgsview view.
      let rawdata = fs.readFileSync('config/.autocheck/token.json');  
      let user = JSON.parse(rawdata); 
      ghUser = new GithubApiFunctions(user.access_token)
      let result = ghUser.userOrgs()
      
      result.then(({data, headers, status}) => {
        viewRenderer.load(win, 'orgs', {orgs: data})
      })  
    }, err => {
      console.log('Error while getting token', err)
    })
})

/* Function called from ipc.renderer to render profile. */
ipcMain.on('render-profile', (event, arg) => {
  let rawdata = fs.readFileSync('config/.autocheck/token.json');  
  let user = JSON.parse(rawdata); 
  ghUser = new GithubApiFunctions(user.access_token)
  let result = ghUser.userProfile()
  
  result.then(({data, headers, status}) => {
    viewRenderer.load(win, 'profile', {user: data})
  })  
})


/* Function called from ipc.renderer to render orgs. */
ipcMain.on('render-orgs', (event, arg) => {
  let rawdata = fs.readFileSync('config/.autocheck/token.json');  
  let user = JSON.parse(rawdata); 
  ghUser = new GithubApiFunctions(user.access_token)
  let result = ghUser.userOrgs()
  
  result.then(({data, headers, status}) => {
    viewRenderer.load(win, 'orgs', {orgs: data})
  })  
})


/* Function called from ipc.renderer to render orgs assignments. */
ipcMain.on('render-assignments', (event, arg) => {
  let auxassignments = null
  
  if (fs.existsSync('config/.autocheck/assignments/'+arg[0]+'.json')) {
    let rawdata = fs.readFileSync('config/.autocheck/assignments/'+arg[0]+'.json');  
    let assignments = JSON.parse(rawdata); //now it an object
    auxassignments = assignments.assignments
  }

  viewRenderer.load(win, 'assignments', {orgName: arg[0], orgAvatar: arg[1], assignments: auxassignments, repos: null})
})
 
 
/* Function called from ipc.renderer to create org assignments. */
ipcMain.on('render-newassignment', (event, arg) => {
  let assignments = {
    assignments: []
  };
  
  if (fs.existsSync('config/.autocheck/assignments/'+arg[0]+'.json')) {
    let rawdata = fs.readFileSync('config/.autocheck/assignments/'+arg[0]+'.json');  
    assignments = JSON.parse(rawdata);
  }

  assignments.assignments.push({index: assignments.assignments.length.toString(), name: arg[1], regex: arg[2]}); 
  let data = JSON.stringify(assignments); 
  fs.writeFileSync('config/.autocheck/assignments/'+arg[0]+'.json', data);
    
  viewRenderer.load(win, 'assignments', {orgName: arg[0], orgAvatar: arg[3], assignments: assignments.assignments, repos: null})
})


/* Function called from ipc.renderer to delete org assignments. */
ipcMain.on('render-deleteassignment', (event, arg) => {
  let assignments = {
    assignments: []
  };
  
  let rawdata = fs.readFileSync('config/.autocheck/assignments/'+arg[0]+'.json');  
  let assignmentsaux = JSON.parse(rawdata);

  // Filter repos by RegExp
  let regex = new RegExp(arg[1], 'g');
  
  for (var i = 0; i < assignmentsaux.assignments.length; i++) {

    var assignment_filter = assignmentsaux.assignments[i].index.match(regex);
    if (assignment_filter == null) {
      assignments.assignments.push(assignmentsaux.assignments[i])
    }
  }

  let data = JSON.stringify(assignments); 
  fs.writeFileSync('config/.autocheck/assignments/'+arg[0]+'.json', data);
    
  viewRenderer.load(win, 'assignments', {orgName: arg[0], orgAvatar: arg[2], assignments: assignments.assignments, repos: null})
})


/* Function called from ipc.renderer to search assignment repos. */
ipcMain.on('render-searchrepos', (event, arg) => {  
  let rawdata = fs.readFileSync('config/.autocheck/token.json');  
  let user = JSON.parse(rawdata);
  
  ghUser = new GithubApiFunctions(user.access_token)
  let result = ghUser.paginate(arg[0])
  
  .then(data => {
    let repos = {
      repos: []
    };
        
    // Filter repos by RegExp
    let regex = new RegExp(arg[1], 'g');

    for (var i = 0; i < Object.keys(data).length; i++) {
      var orgrepos_filter = data[i].name.match(regex);
      if (orgrepos_filter != null) {
        repos.repos.push(data[i])
      }
    }   
    
    let auxassignments = null
    
    if (fs.existsSync('config/.autocheck/assignments/'+arg[0]+'.json')) {
      let rawdata = fs.readFileSync('config/.autocheck/assignments/'+arg[0]+'.json');  
      let assignments = JSON.parse(rawdata); //now it an object
      auxassignments = assignments.assignments 
    }
    viewRenderer.load(win, 'assignments', {orgName: arg[0], orgAvatar: arg[2], assignments: auxassignments, repos: repos.repos})
  })
})


/* Function called from ipc.renderer to render assignment repos. */
ipcMain.on('render-assignment-repos', (event, arg) => {
  let rawdata = fs.readFileSync('config/.autocheck/token.json');  
  let user = JSON.parse(rawdata);
  
  ghUser = new GithubApiFunctions(user.access_token)
  let result = ghUser.paginate(arg[2])
  //let result = ghUser.orgRepos(arg[2])
  
  .then(data => {
    let repos = {
      repos: []
    };
        
    // Filter repos by RegExp
    let regex = new RegExp(arg[1], 'g');

    for (var i = 0; i < Object.keys(data).length; i++) {
      var orgrepos_filter = data[i].name.match(regex);
      if (orgrepos_filter != null) {
        repos.repos.push(data[i])
      }
    }   
    
    viewRenderer.load(win, 'assignmentrepos', {orgName: arg[2], orgAvatar: arg[3], assignmentName: arg[0], assignmentRegex: arg[1], repos: repos.repos})
  })
})


/* Function called from ipc.renderer to render login and logout. */
ipcMain.on('render-login', (event, arg) => {
  fs.unlinkSync('config/.autocheck/token.json')
  
  viewRenderer.load(win, 'login')
})