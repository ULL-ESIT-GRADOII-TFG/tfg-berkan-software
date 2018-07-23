function newAssignment (orgName) {
  var assignmentName = document.getElementById('assignment-name').value
  var assignmentRegex = document.getElementById('assignment-regex').value
  
  ipcRender.send('render-newassignment', [orgName, assignmentName, assignmentRegex])
}