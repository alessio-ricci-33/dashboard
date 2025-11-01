declare global {
	var socket: WebSocket & {
		emit: (event: string, data: any) => void;
		emitBuffer: (data: any) => void;
		on: (event: string, callback: (data: any) => void) => void;
	};
}

export {};
