import {MAX_SIZES, TEXT_SIZES, START_Y, BRUSH_SIZES} from '../../consts/max_sizes';
import {getScrollTop} from '../../utils';

const handleFontSizeChange = (e, props) => {
	let {fontSize = 20} = props;
	let add = 2 * (e.deltaY > 0 ? 1 : -1);
	fontSize = Math.min(TEXT_SIZES.max, Math.max(TEXT_SIZES.min, fontSize + add));
	return {fontSize};
}

const handleTextMouseWheel = (e, type, props) => {
	let {action} = props;
	let {deltaY} = e;
	if (action == 'move') {
		return handleWheelResize(e, type, props);
	}
	return handleFontSizeChange(e, props);
}

export const handleWheel = (e, type, props) => {
	e.preventDefault();

	switch (type) {
		case 'descr':
			return handleTextMouseWheel(e, type, props);

		case 'mark':
			return handleMarkLocChange(e, props);

		case 'drawing':
			return handleDrawingMouseWheel(e, type, props);
	}
	return handleWheelResize(e, type, props);
}

export const handleWheelResize = (e, type, props) => {
	let {width, height} = props;
	let max = Math.max(width, height);
	let add = 3;
	if (max > 1000) {
		add = 0.6;
	} else if (max > 750) {
		add = 1.2;
	} else if (max > 500) {
		add = 1.8;
	} else if (max > 250) {
		add = 2.4;
	}
	return handleResize({a: e.deltaY > 0 ? add : -add}, type, props);
}

export const handleResize = ({l, r, t, b, a}, type, props) => {
	let maxSizes = MAX_SIZES[type] || MAX_SIZES.default;
	let {maxWidth, minWidth, maxHeight, minHeight} = maxSizes;
	let {mx, my, width, height, set} = props;
	
	const checkWidth = (param) => {
		if (width > maxWidth) {
			param -= width - maxWidth;
			width = maxWidth;
		} else if (width < minWidth) {
			param += minWidth - width;
			width = minWidth;
		}
		return param;
	}
	const checkHeight = (param) => {
		if (height > maxHeight) {
			param -= height - maxHeight;
			height = maxHeight;
		} else if (height < minHeight) {
			param += minHeight - height;
			height = minHeight;
		}
		return param;
	}

	if (set == 2) {
		let max;
		if (l && t) {
			max = Math.max(l, t);
			l = t = max;
		} else if (r && t) {
			max = Math.max(r, t);
			r = t = max;
		} else if (r && b) {
			max = Math.max(r, b);
			r = b = max;
		} else if (l && b) {
			max = Math.max(l, b);
			l = b = max;
		}
		max = Math.max(width, height);
		width = height = max;
	}

	if (l) {
		width += l;
		l = checkWidth(l);
		mx -= l;
	} else if (r) {
		width += r;
		checkWidth(r);
	} 
	if (t) {
		height += t;
		t = checkHeight(t);
		my -= t;
	} else if (b) {
		height += b;
		checkHeight(b);
	}



	if (a) {
		let w = Math.floor(width * a / 100);
		let h = Math.floor(height * a / 100);
		width += w;
		height += h;
		w = checkWidth(w);
		h = checkHeight(h);
		mx -= Math.floor(w / 2);
		my -= Math.floor(h / 2);
	}
	return {
		width,
		height,
		mx,
		my
	};
}
const handleMarkLocChange = (e, props) => {
	let {deltaY} = e;
	let {loc} = props;
	if (!loc) {
		loc = deltaY > 0 ? 2 : 4;
	} else if (deltaY > 0) {
		loc++;
		if (loc > 4) {
			loc = 1;
		}
	} else {
		loc--;
		if (loc < 1) {
			loc = 4;
		}
	}
	return {loc};
}

export const handleFixate = (props) => {
	let scrollTop = getScrollTop();
	let {
		my = START_Y,
		fixed,
		height
	} = props;

	if (fixed) {
		my = my + scrollTop;
	} else {
		my = Math.max(5, my - scrollTop);
		let wh = window.innerHeight;
		if (my + height > scrollTop + wh) {
			my = scrollTop + wh - height - 5;
		}
	}
	return {fixed: !fixed, my};
}

const handleDrawingMouseWheel = (e, type, props) => {
	let {action} = props;
	let {deltaY} = e;
	if (action == 'move') {
		return handleWheelResize(e, type, props);
	} else if (action == 'draw') {
		let {brushSize} = props;
		let add = 2 * (e.deltaY > 0 ? 1 : -1);
		brushSize = Math.min(BRUSH_SIZES.max, Math.max(BRUSH_SIZES.min, brushSize + add));
		return {brushSize};
	} else if (action == 'opacity') {
		let {opacity} = props;		
		let add = .1 * (e.deltaY > 0 ? 1 : -1);
		opacity = Math.min(1, Math.max(0.1, opacity + add));
		return {opacity};
	}
}