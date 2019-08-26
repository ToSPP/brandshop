const app = new Vue({
  el: '#app',
  methods: {
    getJSON(src) {
      return fetch(src)
        .then(response => response.json())
        .catch(err => console.log(err));
    },
    postJSON(url, data) {
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .catch(err => console.log(err));
    },
    putJSON(url, data) {
      return fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .catch(err => console.log(err));
    },
    deleteJSON(url) {
      return fetch(url, {
        method: "DELETE",
      })
        .then(response => response.json())
        .catch(err => console.log(err));
    },
  },
});