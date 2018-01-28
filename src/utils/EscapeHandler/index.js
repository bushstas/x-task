const handlers = [];

export const addHandler = (handler) => {
	handlers.push(handler);
}

export const removeHandler = (handler) => {
	const i = handlers.indexOf(handler);
	if (i > -1) {
		handlers.splice(i, 1);
	}
}

const handleMouseDown = ({keyCode}) => {
	if (keyCode == 27) {
		const i = handlers.length - 1;
		if (handlers[i] instanceof Function) {
			handlers[i]();
			handlers.splice(i, 1);
		}
	}
}

window.addEventListener('keydown', handleMouseDown, false);