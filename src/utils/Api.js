class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    // Call getUserInfo it in this array
    return Promise.all([this.getInitialCards()]);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      Promise.reject(`Error: ${res.status}`);
    });
  }

  // other methods for working with the API

  // create another method, getUserInfo (different base url)
}

export default Api;
