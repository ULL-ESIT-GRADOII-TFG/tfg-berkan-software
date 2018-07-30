function profileRender () {
  ipcRender.send('render-profile', 'profile')
}

function OrgsRender () {
  ipcRender.send('render-orgs', 'orgs')
}

function AssignmentsRender (orgName, orgAvatar) {
  ipcRender.send('render-assignments', [orgName, orgAvatar])
}

function AssigmentReposRender (assignmentName, assignmentRegex, orgName, orgAvatar) {
  ipcRender.send('render-assignment-repos', [assignmentName, assignmentRegex, orgName, orgAvatar])
}
