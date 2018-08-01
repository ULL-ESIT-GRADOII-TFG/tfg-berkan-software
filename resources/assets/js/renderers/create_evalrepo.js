function createEvalRepo (orgName, orgAvatar, assignmentName, assignmentRegex, repos) {
  var evalRepoName = document.getElementById('evalrepo-name').value

  ipcRender.send('render-create-evalrepo', [orgName, orgAvatar, assignmentName, assignmentRegex, repos, evalRepoName])
}