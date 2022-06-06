cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "admob-plus-cordova.AdMob",
      "file": "plugins/admob-plus-cordova/www/admob.js",
      "pluginId": "admob-plus-cordova",
      "clobbers": [
        "admob"
      ]
    }
  ];
  module.exports.metadata = {
    "admob-plus-cordova": "1.27.0"
  };
});