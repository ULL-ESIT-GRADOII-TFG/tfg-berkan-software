module.exports = {
  sources: {
    repoUrl: 'https://github.com/chamerling/electron-oauth-github-vue'
  },
  oauth: {
    clientId: process.env.GITHUB_CLIENT_ID || 'f0664009ba2c50c6b8ec',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'ba3994a1a4ccd01e65332f13de83b2e3e9d1e2d3',
    authorizationUrl: 'http://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    useBasicAuthorizationHeader: false,
    // don't touch me
    redirectUri: 'http://localhost'
  }
}
