class Api {
  constructor(options) {
    this._baseUrl = baseUrl;
    this._header = headers;
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then((res) => res.json());
  }

  // other methods for working with the API
}

export default Api;
