class ApiHelper {
  static verifyUrl(url) {
    if (!url || !url.includes('http')) {
      throw new Error(`Invalid API_URL: ${url}`);
    }
  }

  static formatUrl(url) {
    if (url) {
      if (url[url.length - 1] === '/') {
        return url;
      }
      return `${url}/`;
    }
    return '/';
  }
}

export default ApiHelper;
