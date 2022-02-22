module.exports = {
  apps : [{
    name   : "speedtest",
    script : "./index.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false
  }]
}
