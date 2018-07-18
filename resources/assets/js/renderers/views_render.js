function profileRender () {
  ipcRender.send('render-profile', 'profile')
}

function dashboardRender () {
  ipcRender.send('render-dashboard', 'dashboard')
}

function indexRender () {
  ipcRender.send('render-index', 'index')
}