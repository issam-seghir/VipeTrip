import { useEffect, useRef } from 'react';

export function useSocketEvent(socket) {
    const eventsRef = useRef({});

    const listenToEvent = (eventName, handler) => {
        if (typeof handler !== 'function' || handler.name === '') {
            throw new Error('Handler must be a named function');
        }

        if (socket) {
            socket.on(eventName, handler);
            eventsRef.current[eventName] = handler;
        }
    };

    const emitEvent = (eventName, data) => {
        if (socket) {
            socket.emit(eventName, data);
        }
    };

    useEffect(() => {
		return () => {
			if (socket) {
				Object.entries(eventsRef.current).forEach(([eventName, handler]) => {
					socket.off(eventName, handler);
				});
			}
		};
	}, [socket]);

    return [listenToEvent, emitEvent];
}
