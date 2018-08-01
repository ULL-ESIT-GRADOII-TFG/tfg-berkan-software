function searchRepos (orgName, orgAvatar) {
  var assignmentRegex = document.getElementById('assignment-regex').value
  ipcRender.send('render-searchrepos', [orgName, assignmentRegex, orgAvatar])
}