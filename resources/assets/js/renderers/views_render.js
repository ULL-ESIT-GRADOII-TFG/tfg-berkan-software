function profileRender () {
  ipcRender.send('render-profile', 'profile')
}

function OrgsRender () {
  ipcRender.send('render-orgs', 'orgs')
}

function indexRender () {
  ipcRender.send('render-index', 'index')
}

function AssignsRender () {
  ipcRender.send('render-assigns', 'assigns')
}