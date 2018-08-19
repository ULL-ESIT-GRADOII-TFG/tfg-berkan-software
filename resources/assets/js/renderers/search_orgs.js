function searchOrgs () {
  var orgNameRegex = document.getElementById('orgname-regex').value
  ipcRender.send('render-searchorgs', [orgNameRegex])
}