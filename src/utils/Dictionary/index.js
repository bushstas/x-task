export const dict = {};
export const icons = {};
export const set = ({dict: d, icons: i}) => {
	let k;
	for (k in d) {
		dict[k] = d[k];
	}
	for (k in i) {
		icons[k] = i[k];
	}
}