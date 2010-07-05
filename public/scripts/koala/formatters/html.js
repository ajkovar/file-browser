
// Koala - Formatters - HTML - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */

var Formatter = require('koala/formatter').Formatter

/**
 * Escapes html entities.
 *
 * @param  {string} str
 * @return {string}
 * @api private
 */

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
	.replace(/\n/g, '<br>')
	.replace(/ /g, "&nbsp;")
	.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
}

// --- Formatter

exports.HTML = new Formatter(function(key, val){
  var output
  if(key === null) {
    output=escape(val)	
  } 
  /*else if(key==="newline")
    output = "<br>"*/
  else {
	output = '<span class="' + key + '">' + escape(val) + '</span>'
  }

  return output
})