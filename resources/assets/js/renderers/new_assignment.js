function newAssignment (orgName, orgAvatar) {
  var assignmentName = document.getElementById('assignment-name').value
  var assignmentRegex = document.getElementById('assignment-regex').value
  
  if (assignmentName == '' && assignmentRegex == '') {
    alert('You must enter assignment regex and name values')
    document.getElementById('assignment-regex').style.border = "1px solid red";
    document.getElementById('assignment-name').style.border = "1px solid red";
  } else if (assignmentRegex == '') {
    alert('You must enter assignment regex value')
    document.getElementById('assignment-regex').style.border = "1px solid red";
    document.getElementById('assignment-name').style.border = "1px solid lightgray";
  } else if (assignmentName == '') {
    alert('You must enter assignment name value')
    document.getElementById('assignment-name').style.border = "1px solid red";  
    document.getElementById('assignment-regex').style.border = "1px solid lightgray";
  } else {
    ipcRender.send('render-newassignment', [orgName, assignmentName, assignmentRegex, orgAvatar])
  }

}