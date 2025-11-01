window.socket = new WebSocket('wss://socket.msgi.it', 'dashboard');
export const { socket } = window;

socket.emit = (event, data) => socket.send(JSON.stringify({ event, data }));
socket.emitBuffer = data => socket.send(data);

socket.on = (event, callback) =>
	socket.addEventListener('message', ({ data }) => {
		const { event: event_name, ...rest } = JSON.parse(data);
		if (event === event_name) callback(rest);
	});

socket.close = () => socket.close();

socket.isConnected = () => socket.readyState === 1;

socket.connect = () => socket.connect();

socket.disconnect = () => socket.disconnect();
