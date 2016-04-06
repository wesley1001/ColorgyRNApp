module.exports = {
  in: function (state) {
    for (var prop in state) {
      if (prop.match(/ing/)) delete state[prop];
    }
    return state;
  },
  out: function (state) {
    for (var prop in state) {
      if (prop.match(/ing/)) delete state[prop];
    }
    return state;
  }
};
