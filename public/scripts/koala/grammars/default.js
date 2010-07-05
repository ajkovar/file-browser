// Koala - Grammars - JavaScript - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var Lexer = require('koala/lexer').Lexer

// --- Grammar

exports.Default = new Lexer({
  'newline': '\n'
})