var crypto = require('crypto')

var Security = function() {

}

Security.prototype.hash = function (data, algorithm) {
  if (!algorithm)
    algorithm = 'sha256'

  return crypto.createHash(algorithm).update(data).digest('hex')
}

/** Sync */
Security.prototype.randomString = function (length, chars) {
  var charsLength = chars.length
  if (charsLength > 256) {
    throw new Error("Argument 'chars' should not have more than 256 characters, otherwise unpredictability will be broken")
  }

  var randomBytes = crypto.randomBytes(length)
  var result = new Array(length)

  var cursor = 0;
  for (var i = 0; i < length; i++) {
    cursor += randomBytes[i]
    result[i] = chars[cursor % charsLength]
  }

  return result.join('')
}

/** Sync */
Security.prototype.randomAsciiString = function (length) {
  return Security.prototype.randomString(length,
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
}

// for the luls, unicode not working very well
Security.prototype.randomUnicodeString = function (length) {
  return Security.prototype.randomString(length,
    "😁😂😃😄😅😆😉😊😋😌😍😏😒😓😔😖😘😚😜😝😞😠😡😢😣😤😥😨😩😪😫😭😰😱😲😳😵😷😸😹😺😻😼😽😾😿🙀😀😇😈😎😐😑😕😗😙😛😟😦😧😬😮😯😴😶")

// http://apps.timwhitlock.info/emoji/tables/unicode
// var table = $('#block-6a-additional-emoticons').next();
// var spans = table.find('span.emoji');
// var fspans = spans.toArray().filter(function (node) { return node.attributes.class.value === 'emoji' });
// var s = "";
// fspans.forEach(function(n) {s += n.textContent});
}

module.exports = Security
