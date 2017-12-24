export const getScrollTop = () => {
	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export const getElementMarginLeft = (x) => {	
	return x - Math.floor(document.body.clientWidth / 2);
}

export const getCenterCoords = () => {
	return {
		x: Math.floor(document.body.clientWidth / 2),
		y: Math.floor(document.body.clientHeight / 2) + getScrollTop()
	}
}

export const setScrollTop = (y) => {
	if (document.scrollingElement) {
		document.scrollingElement.scrollTop = y;
	} else if (document.documentElement) {	
		document.documentElement.scrollTop = y;
	}
}

export const getScrollHeight = () => {
	return Math.max(
	  document.body.scrollHeight, document.documentElement.scrollHeight,
	  document.body.offsetHeight, document.documentElement.offsetHeight,
	  document.body.clientHeight, document.documentElement.clientHeight
	);
}