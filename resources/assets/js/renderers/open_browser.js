function openOrg(orgName) {
  electron.shell.openExternal('https://github.com/'+orgName)
}

function openRepo(repoName, orgName) {
  electron.shell.openExternal('https://github.com/'+orgName+'/'+repoName)
}