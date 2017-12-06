export class ApiHelper {
  static verifyUrl(url) {
    if (!url.includes('http')) {
      throw new Error(`Invalid API_URL: ${url}`);
    }
  }

  static formatUrl(url) {
    if (url[url.length - 1] === '/') {
      return url;
    }
    return `${url}/`;
  }
}
