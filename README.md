##node-flic-buttons##

A NodeJS node to interact with the [flic.io][1] BLE buttons.

This node uses the [fliclib-linux-dist][2] daemon to handle 
the low level comunication with the buttons.

The node supports all method that can be accesses by the C++ 
library made available in the fliclib-linux-dist package.

```
var flic = require('node-flic-buttons');

var buttons = new flic();
// defaults to localhost:5000 else
//var buttons = new flic(host, port);
```

The `buttons` object will emit the following events

 - `online` - when connected to the daemon
 - `offline` - when disconnected from the daemon
 - `discovered` - when a button is discoverd (as part of a scan)
 - `connected` - when a button is connected
 - `disconnected` - when a button is disconnected
 - `click` - when a button is clicked, double clicked or long clicked

The `discovered`, `connected`, `disconnected`, and `click` all pass objects along with the event

```
```

[1]: https://flic.io/?r=985093
[2]: https://github.com/50ButtonsEach/fliclib-linux-dist