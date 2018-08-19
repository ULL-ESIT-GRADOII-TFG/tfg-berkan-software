function searchAssignmentRepos (assignmentName, assignmentRegex, orgName, orgAvatar, repos) {
  var repoNameRegex = document.getElementById('reponame-regex').value
  ipcRender.send('render-filterrepos', [assignmentName, assignmentRegex, orgName, orgAvatar, repoNameRegex, repos])
}