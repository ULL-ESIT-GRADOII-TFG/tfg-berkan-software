module.exports = {
  sources: {
    repoUrl: 'https://github.com/chamerling/electron-oauth-github-vue'
  },
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID || '2d5a1d0fc5e4a97170f9',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'ea50fa94b49ae182df6dea5063c52c5781856924',
    authorizationUrl: 'http://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    useBasicAuthorizationHeader: false,
    // don't touch me
    redirectUri: 'http://localhost'
  }
}
