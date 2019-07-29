class Auth {
  static setToken(token) {
    localStorage.setItem('picobankUser', token)
  }

  static getToken() {
    return localStorage.getItem('picobankUser')
  }

  static logout() {
    localStorage.removeItem('picobankUser')
  }

  static getPayload() {
    const token = this.getToken()
    if (!token) return false
    const parts = token.split('.')
    if (parts.length < 3) return false
    return JSON.parse(atob(parts[1]))
  }

  static isAuthenticated() {
    const payload = this.getPayload()
    const now = Math.round(Date.now() / 1000)
    return now < payload.exp
  }
}

export default Auth
