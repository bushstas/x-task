import React from 'react';
import Release from '../Release';

export default class Releases extends React.Component {
	render() {
		const {items, onSelect} = this.props;
		return (
			<div class="self">
				{items && items.map((release) => {
					return (
						<Release 
							key={release.id}
							data={release}
							onSelect={onSelect}
						/>
					)
				})}			
			</div>
		)
	}
}