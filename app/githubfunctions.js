const octokit = require('@octokit/rest')({
  debug: true
})

class GithubApiFunctions {
  constructor (token) {
    octokit.authenticate({ type: 'oauth', token: token })
  }
  
  
  async userProfile() {
    try {
      let result = await octokit.users.get({})
      return result
    } catch (error) {
      console.log(error)
    }
  }
  
  
  async userOrgs() {
    try {
      let result = await octokit.users.getOrgs({})
      return result
    } catch (error) {
      console.log(error)
    }
  }  
  
  
  async orgRepos (orgName) {
    try {
      let result = await octokit.repos.getForOrg({ org: orgName })
      return result
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports.GithubApiFunctions = GithubApiFunctions
