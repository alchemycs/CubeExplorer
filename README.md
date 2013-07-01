#Cube Explorer

I wrote this to make it a little easier to explore the
[Freetronics CUBE4 LED Cube](http://www.freetronics.com/products/cube4-4x4x4-rgb-led-cube) - and I wanted an excuse to do something with sockets and controlling a hardware device from a browser.

I just did this in a few hours, so I have a lot more work I want to do with it, but wanted to get it out there in case
someone else found it useful.

#WARNING
If you run this server, be aware that at this time there is no security in place. This means if you make this server
available to the public Internet anyone can control your cube! Also, EVERYONE who is connected can control your cube!

##Requirements
Obviously you'll need to have one of the Freetronics LED cubes loaded with the serial control sketch.

([Watch a Freetronics Cube4 in action](http://www.youtube.com/embed/c8hrxd72H2E?feature=player_detailpage))

The `colour explorer` page will be most fun if you have [a browser that supports the `color` input type](http://caniuse.com/#search=color%20input).
At the time of writing this is basically Chrome and Opera.

The server is written in `node.js` so you will need to have node installed.

Since we use the [`serialport`](https://github.com/voodootikigod/node-serialport) and [`socket.io`](http://socket.io/)
modules, you'll need to ensure you have the appropriate compilers installed so the packages build correctly.
Please visit those projects for details.

##Installation

1. Plug in the cube and determine which serial port is being used
2. Clone the repository: `git clone https://github.com/alchemycs/CubeExplorer.git`
3. Go into the cloned repository and run `npm install`
4. Edit the `app.js` file and set the appropriate values for `SERIAL_PORT` and `SERIAL_BAUDRATE`
5. Start the server `npm start`
6. Open your browser to the `http://localhost:3000` (or whatever is appropriate)

##TODO
* Autodetect the serial port on startup
* Handle disconnects and reconnects of the cube
