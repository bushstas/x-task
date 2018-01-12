export const parseText = (text) => {
	if (typeof text != 'string') {
		return text;
	}
	text = text.replace(/\r\n|\r|\n/g, '<br>');
	text = text.replace(/\[\s*link=([^\]]+)\s*\]/g, "<a target=\"_blank\" href=\"$1\">");
	text = text.replace(/\[\s*\/link\s*]/g, "</a>");
	text = text.replace(/\[\s*(\/*)(b|u|i)\s*]/g, "<$1$2>");
	return text;
}