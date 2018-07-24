function profileRender () {
  ipcRender.send('render-profile', 'profile')
}

function OrgsRender () {
  ipcRender.send('render-orgs', 'orgs')
}

function indexRender () {
  ipcRender.send('render-index', 'index')
}

function AssignmentsRender (orgName) {
  ipcRender.send('render-assignments', orgName)
}

function AssigmentReposRender (assignmentName, assignmentRegex, orgName) {
  ipcRender.send('render-assignment-repos', [assignmentName, assignmentRegex, orgName])
}
