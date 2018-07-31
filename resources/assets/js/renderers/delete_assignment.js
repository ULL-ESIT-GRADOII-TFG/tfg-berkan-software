function deleteAssignment (orgName, orgAvatar, assignmentIndex) {
  ipcRender.send('render-deleteassignment', [orgName, assignmentIndex, orgAvatar])
}