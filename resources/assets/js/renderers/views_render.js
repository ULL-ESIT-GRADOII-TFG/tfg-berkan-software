function profileRender () {
  ipcRender.send('render-profile', 'profile')
}

function OrgsRender () {
  ipcRender.send('render-orgs', 'orgs')
}

function indexRender () {
  ipcRender.send('render-index', 'index')
}

function AssignsRender (orgName) {
  ipcRender.send('render-assigns', orgName)
  console.log(orgName);
}