Object.defineProperty(Array.prototype, 'last', {
  get: function () {
    return this[this.length - 1];
  },
});
