import React from 'react';

export default class Release extends React.Component {
	render() {
		const {name, date, onSelect} = this.props.data;
		return (
			<div class="self" onClick={onSelect}>
				{name}
			</div>
		)
	}
}