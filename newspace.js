const visit = require('unist-util-visit');
const parser = require("./parser.js")

module.exports = function attacher() {
    return transformer;

    function transformer(tree) {
        visit(tree, 'text', visitor);
    }

    function visitor(node) {
        // Assume convertToHTML returns a string of HTML
        const htmlParser = new parser();
        const html = htmlParser.convertToHTML(node.value);
        
        if (html !== node.value) { // Check if the conversion happened
            node.type = 'html'; // Change the node type to 'html'
            node.value = html;
        }
    }
};