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
      let result = await octokit.repos.getForOrg({ org: orgName,  type: 'all', per_page: 100, page: 1 })
      return result
    } catch (error) {
      console.log(error)
    }
  }
  
  
  async paginate (orgName) {
    let response = await octokit.repos.getForOrg({
      org: orgName,
      type: 'all',
      per_page:100
    })
    var { data } = response;
    while (octokit.hasNextPage(response)) {
      response = await octokit.getNextPage(response)
      data = data.concat(response.data)
    }

    return data    
  }
}

module.exports.GithubApiFunctions = GithubApiFunctions
