// Copyright 2015-2016 Benjamin Hardill

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
"use strict";
var ProtoBuf = require('protobufjs');
var net = require('net');
var util = require('util');
var events = require('events');

var builder = ProtoBuf.loadProtoFile(__dirname + "/flic.proto");

var Flic = builder.build('flic');

var Message = Flic.protocol.Message;
var Meta = Flic.protocol.Meta;
var Button = Flic.protocol.Button;
var Manager = Flic.protocol.Manager;

var InitializeClient = Flic.protocol.InitializeClient;
var OnButtonDiscover = Flic.protocol.OnButtonDiscover;
var OnButtonConnect = Flic.protocol.OnButtonConnect;
var OnButtonConnecting = Flic.protocol.OnButtonConnecting;
var OnButtonReady = Flic.protocol.OnButtonReady;
var OnButtonConnectionFail = Flic.protocol.OnButtonConnectionFail;
var OnButtonDisconnecting = Flic.protocol.OnButtonDisconnecting;
var OnButtonDisconnect = Flic.protocol.OnButtonDisconnect;
var OnButtonUpOrDown = Flic.protocol.OnButtonUpOrDown;
var OnButtonSingleOrDoubleClickOrHold = Flic.protocol.OnButtonSingleOrDoubleClickOrHold;
var OnButtonRssiValue = Flic.protocol.OnButtonRssiValue;
var OnButtonClickOrHold = Flic.protocol.OnButtonClickOrHold;
var OnButtonSingleOrDoubleClick = Flic.protocol.OnButtonSingleOrDoubleClick;
var OnButtonBatteryStatus = Flic.protocol.OnButtonBatteryStatus;
var OnButtonRssiValue = Flic.protocol.OnButtonRssiValue;
var OnButtonForgotten = Flic.protocol.OnButtonForgotten;
var OnBluetoothStateChanged = Flic.protocol.OnBluetoothStateChanged

var StartScan = Flic.protocol.StartScan;
var StopScan = Flic.protocol.StopScan;
var ConnectButton = Flic.protocol.ConnectButton;
var DisconnectButton = Flic.protocol.DisconnectButton;


var Flic = function(host, port){
	events.EventEmitter.call(this);

	var flic = this;

	this._scanning = false;

	this.socket = net.connect({port: port ? port :5000, host: host ? host : '127.0.0.1'},function(){
		console.log('connected');
		flic.emit("online");
	});

	this.socket.on('end', function(){
		console.log('disconnected');
		flic.emit("offline");
	});

	this.socket.on('error', function(){
		flic.emit("offline");
	});

	this.socket.on('data', function(data){
		try {
			var m = Message.decode(data);
			//console.log("%j", m.type);
			var evt;
			switch(m.type) {
				case 0:
					evt = InitializeClient.decode(m.data);
					//should I connect to all buttons here?
					break;
				case 1:
					evt = OnButtonDiscover.decode(m.data);
					flic.emit('discovered', evt);
					break;
				case 2:
					evt = OnButtonConnect.decode(m.data);
					break;
				case 3:
					evt = OnButtonConnecting.decode(m.data);
					break;
				case 4:
					evt = OnButtonReady.decode(m.data);
					flic.emit('connected', evt);
					break;
				case 5:
					evt = OnButtonDisconnecting.decode(m.data);
					break;
				case 6:
					evt = OnButtonDisconnect.decode(m.data);
					flic.emit('disconnected', evt);
					break;
				case 7:
					evt = OnButtonConnectionFail.decode(m.data);
					break;
				case 8:
					evt = OnButtonUpOrDown.decode(m.data);
					break;
				case 9:
					evt = OnButtonClickOrHold.decode(m.data);
					break;
				case 10:
					evt = OnButtonSingleOrDoubleClick.decode(m.data);
					break;
				case 11:
					evt = OnButtonSingleOrDoubleClickOrHold.decode(m.data);
					flic.emit('click', evt);
					break;
				case 12:
					evt = OnButtonBatteryStatus.decode(m.data);
					break;
				case 13:
					evt = OnButtonRssiValue.decode(m.data);
					break;
				case 14:
					evt = OnButtonForgotten.decode(m.data);
					break;
				case 15:
					evt = OnBluetoothStateChanged.decode(m.data);
					break;
				case 19:
					evt = StartScan.decode(m.data);
					flic._scanning = true;
					break;
				case 21:
					evt = StopScan.decode(m.data);
					flic._scanning = false;
					break;
			}
			//console.log('%j', evt);
		} catch (e) {
			//console.log('parial decode - %j', e);
		}
	});
}

util.inherits(Flic, events.EventEmitter);

Flic.prototype.close = function close(){
	this.socket.end();
}

Flic.prototype.startScan = function startScan() {
	var start = new StartScan();
	var msg = new Message({type: 18, data: start.encode()});
	console.log('start - %j', msg);
	console.log('start - %j', msg.encode());
	console.log('start - %j', msg.encode().toBuffer());
	var buf = new Buffer(2048);
	buf.fill(0);
	var size = msg.encode().limit
	buf.writeUInt16BE(size,0);
	msg.encode().toBuffer().copy(buf,2);
	this.socket.write(buf,function(){
		console.log('all sent');
	});
}

Flic.prototype.stopScan = function stopScan() {
	var stop = new StopScan({});
	var msg = new Message({type: 20, data: stop.encode().toBuffer()});
	console.log('stop - %j', msg);
	console.log('stop - %j', msg.encode().toBuffer());
	var buf = new Buffer(2048);
	buf.fill(0);
	var size = msg.encode().limit
	buf.writeUInt16BE(size,0);
	msg.encode().toBuffer().copy(buf,2);
	this.socket.write(buf,function(){
		console.log('all sent');
	});
}

Flic.prototype.connectButton = function connectButton(id) {
	var connect = new ConnectButton({deviceId: id});
	var msg = new Message({type: 16, data: connect.encode()});
	var buf = new Buffer(2048);
	buf.fill(0);
	buf.writeUInt16BE(msg.encode().limit,0);
	msg.encode().toBuffer().copy(buf,2);
	socket.write(buf);
}

Flic.prototype.disconnectButton = function disconnectButton(id) {
	var disconnect = new DisconnectButton({deviceId: id});
	var msg = new Message({type: 17, data: disconnect.encode()});
	var buf = new Buffer(2048);
	buf.fill(0);
	buf.writeUInt16BE(msg.encode().limit,0);
	msg.encode().toBuffer().copy(buf,2);
	socket.write(buf);
}


module.exports = Flic;