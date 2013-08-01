var _ = require("underscore");

function packageName (manifestUrl) {
  var url = require("url"),
      dirname = url.resolve(manifestUrl, "."),
      urlObj = url.parse(dirname);

  var parts = (urlObj.pathname + urlObj.hostname).split(/[.\/]/);

  return _.chain(parts).compact().reverse().value().join(".");
}

function permissions (webPermissions) {
  var permissionMap = require("./android-permissions");

  return _.chain(webPermissions).keys().map(
        function (key) {
          var access = webPermissions[key].access;
          return access ? permissionMap[key + ":" + access] : permissionMap[key];
        }).flatten().uniq().value();
}

function versionCode (string) {
  var match, re = /(\d+)/g, androidVersionCode = 0, multiplier = 10000;

  while (true) {
    match = re.exec(string);
    if (!match) {
      // fugliness to keep jshint happy.
      break;
    }
    var v = parseInt(match[1], 10);
    androidVersionCode += v * multiplier;
    multiplier /= 100;
    if (multiplier < 1) {
      break;
    }
  }
  return androidVersionCode;
}

function iconSize (string) {

  var icons = {
    "fallback": "hdpi",
    "16": "ldpi",
    "30": "ldpi", // FxOS size
    "32": "ldpi",
    "48": "mdpi", // android size
    "60": "mdpi", // FxOS size
    "64": "mdpi",
    "72": "hdpi", // android size
    "96": "xhdpi", // android size
    "128": "xhdpi",
    "144": "xxhdpi", // android size
    "256": "xxhpdi"
  };

  return icons[string] || icons.fallback;
}

module.exports = {
  versionCode: versionCode,
  permissions: permissions,
  packageName: packageName,
  iconSize: iconSize
};