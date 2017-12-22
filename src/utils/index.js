export const getScrollTop = () => {
	return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export const setScrollTop = (y) => {
	if (document.scrollingElement) {
		document.scrollingElement.scrollTop = y;
	} else if (document.documentElement) {	
		document.documentElement.scrollTop = y;
	}
}