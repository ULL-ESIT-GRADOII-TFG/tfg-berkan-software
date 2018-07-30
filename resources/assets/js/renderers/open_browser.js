function openOrg(orgName) {
  electron.shell.openExternal('https://github.com/'+orgName)
}