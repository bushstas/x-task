import React from 'react';

import './index.scss';

export default class Table extends React.PureComponent {

	render() {
		let {classes} = this.props;
		return (
			<table class="self $classes">
				<thead>
					{this.thead}
				</thead>
				<tbody>
					{this.tbody}
				</tbody>
			</table>
		)
	}

	get thead() {
		let {headers, widths = []} = this.props;
		if (headers instanceof Array) {
			return (
				<tr>
					{headers.map((h, i) => {
						let style = {};
						if (widths[i]) {
							style.width = widths[i] + '%';
						}
						return (
							<th key={i} style={style}>
								{h}
							</th>
						)
					})}
				</tr>
			)
		}
	}

	get tbody() {
		let {headers, rows = []} = this.props;
		if (headers instanceof Array) {
			return rows.map((r, j) => {
				return (
					<tr key={j}>
						{headers.map((h, i) => {
							return (
								<td key={i}>
									{r[i]}
								</td>
							)
						})}
					</tr>
				)
			});
		}
	}
}