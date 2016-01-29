##node-flic-buttons

A NodeJS node to interact with the [flic.io][1] BLE buttons.

This node requires the [fliclib-linux-dist][2] daemon to handle 
the low level comunication with the buttons. You will need to install
this (and the correct version of bluez) before you start.

The node supports all method that can be accesses by the C++ 
library made available in the fliclib-linux-dist package.

 - startScan 
 - stopScan
 - connectButton 
 - disconnectButton

`connectButton` and `disconnectButton` take the button MAC address of the button

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
flic.on('click', function(clickEvt){
  //{"deviceId":"80:E4:DA:70:XX:XX","queued":false,"timeDiff":0,"isSingleClick":true,"isDoubleClick":false,"isHold":false}
  if (clickEvt.isSingleClick) {
    ...
  } else if (clickEvt.isDoubleClick) {
    ...
  } else if (clickEvt.isHold) {
    ...
  }
});
```
I'm not 100% confident the `startScan`, `stopScan`, `connect` all work 100% of the time.
You can pair buttons manually with the `flic` command that ships with the `fliclib-linux`
package using the following actions:

 - Ensure that `bluetoothd` and the `daemon` are running
 - run `flic`
 - type the command `startScan`
 - press the flic button (you may have to press and hold for 7 seconds 
 to unlock if it has been previously paired)
 - type the command `stopScan`
 - type the command `list`, this will show all known flic.io buttons
```
80:E4:DA:70:XX:XX [Disconnected]
```
 - type `connect [80:E4:DA:70:XX:XX]` where [mac address is the button you want
 to pair]
 - you should now see something that looks like 
```
Connected to: 80:E4:DA:70:XX:XX
Verified: 80:E4:DA:70:XX:XX
```
 - the button should now be paired

[1]: https://flic.io/?r=985093
[2]: https://github.com/50ButtonsEach/fliclib-linux-dist