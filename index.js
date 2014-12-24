var loaderUtils = require("loader-utils");
var path = require('path');

module.exports = function (content) {
    this.cacheable && this.cacheable();

    var query = loaderUtils.parseQuery(this.query);
    var ngModule = query.module || 'ngTemplates';
    var relativeTo = query.relativeTo || '';
    relativeTo = relativeTo.replace(new RegExp('/', 'g'), path.sep);
    var relativeStartIndex = this.resource.indexOf(relativeTo);
    if (relativeStartIndex === -1){
    	throw 'The path for file doesn\'t contains relativeTo param';
    }
    var filePath = this.resource.slice(relativeStartIndex + relativeTo.length); // get the base path
    var html;

    if (content.match(/^module\.exports/)) {
        var firstQuote = findQuote(content, false);
        var secondQuote = findQuote(content, true);
        html = content.substr(firstQuote, secondQuote - firstQuote + 1);
    } else {
        html = content;
    }

    return "angular.module('" + ngModule + "').run(['$templateCache', function(c) { c.put('"+ filePath +"', " + html + ") }]);";

    function findQuote(content, backwards) {
        var i = backwards ? content.length - 1 : 0;
        while (i >= 0 && i < content.length) {
            if (content[i] == '"' || content[i] == "'") {
                return i;
            }
            i += backwards ? -1 : 1;
        }
        return -1;
    }
};