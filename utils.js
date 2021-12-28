var utils = {
    getObjectType: function(obj) {
        var str = obj.toString();
        var l = 1, r = str.indexOf(' #');
        if (str[0] == '[' && r != -1) {
            return str.substr(l, r - l);
        } else {
            return str;
        }
    }
};

module.exports = utils;