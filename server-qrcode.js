/* 
Script for displaying the (local) server's IP address as a QR Code.
Allows for easy scanning on mobile devices, instead of having to type out the IP manually.

Usage examples:
 `node server-qrcode.js --port 3000`
 or
 `node server-qrcode.js -p 3011`

*/

const QRCode = require("qrcode");

const defaultPort = 3000;

// Get commandline arguments, omit argv[0] (`node` command) and argv[1] (path to script)
const args = require("minimist")(process.argv.slice(2));

// Get port from commandline arguments
let port = args["p"] || args["port"];

if (!port) {
  console.warn(
    `[!] No port set. Use '--port' or '-p' followed by the portnumber to set it. Defaulting to port ${defaultPort}...`
  );
  port = defaultPort;
}
console.log("setting port to:", port);

// Get the local ip address for this machine
let localIp = Object.values(require("os").networkInterfaces()).reduce(
  (r, list) =>
    r.concat(
      list.reduce(
        (rr, i) =>
          rr.concat((i.family === "IPv4" && !i.internal && i.address) || []),
        []
      )
    ),
  []
);

// Build server's IP with local IP and port
let serverIp = "http://" + localIp + ":" + port;
console.log("serverIp: " + serverIp);

if (localIp && serverIp) {
  // Generate and output QR code with server IP
  QRCode.toString(
    serverIp,
    [{ type: "terminal" }, { small: true }],
    function (err, url) {
      console.log(url);
    }
  );
}
