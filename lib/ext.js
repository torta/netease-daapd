var crypto = require('crypto');
var tk = '3go8&$8*3*3h0k(2)2';

exports.rand = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.encode_token = function (id) {
  return crypto.createHash('md5').update(String.fromCharCode.apply(null,
    Array.prototype.map.call(id, function (e, i) {
      return e.charCodeAt(0) ^ tk.charCodeAt(i % tk.length);
    }))).digest('base64').replace(/(\/|\+)/g, function (e) {
      return e == '+' ? '-' : '_';
    });
};

exports.encode_url = function (id, type) {
  return 'http://' + type + this.rand(1, 5) + '.music.126.net/' +
    this.encode_token(id) + '/' + id +
    (type == 'p' ? '.jpg?param=500y500' : '.mp3');
};
