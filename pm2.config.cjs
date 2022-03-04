const path = require('path')
//import { join } from 'path';

var src = path.join(process.cwd(), 'index.js').replace(/\\/g, '/').replace(/[a-zA-Z]:/g, 'file://');

console.log(path.join(process.cwd(), 'index.js'))
console.log(src)

module.exports = {
  apps : [{
    name   : "speed",
    script :"file:///Users/jcantos/Documents/Programming/NodeJS-Speed-Test/index.js",
    instances: "1",
    exec_mode: "cluster",
    watch: false
  }]
}
