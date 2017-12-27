import React from 'react';
import {getPathParts, getUrls} from '../../utils/TaskResolver';
import Checkbox from '../../ui/Checkbox';

export default class TaskUrlResolver extends React.Component {
	constructor() {
		super();
		let data = {};
		let parts = getPathParts();
		for (let i = 0; i < parts.length; i++) {
			data['part' + i] = parts[i].active;
		}
		this.state = {
			data,
			parts
		}
	}
	render() {
		let {dict} = this.props;
		return (
	 		<div class="self">
	 			<div class="caption">
	 				{dict.caption1}
	 			</div>
	 			{this.path}
	 			<div class="caption">
	 				{dict.caption2}
	 			</div>
	 			{this.urls}
	 		</div>
	 	)
	}

	get path() {
		let {data, parts} = this.state;
		return (
			<div class="path">
				{parts.map((part, i) => {
					let inactive = !data['part' + i];
					return (
						<Checkbox 
							classes="$?.inactive"
							checked={data['part' + i]}
							key={i}
							name={'part' + i}
							value={i}
							onChange={this.handleChange}>
							{part.value}
						</Checkbox>
					)
				})}
			</div> 
		)
	}

	get urls() {
		let {data} = this.state;
		let values = Object.values(data);
		let urls = getUrls(values);
		console.log(values)
	}

	handleChange = (name, value, checked) => {
		let {data, parts} = this.state;
		if (!checked) {
			let count = 0;
			for (let k in data) {
				if (data[k]) {
					count++;
				}
			}
			if (count == 1) {
				return;
			}
		}
		data[name] = checked;
		value = Number(value);
		if (!checked && data['part' + (value + 1)]) {
			for (let i = value; i >= 0; i--) {
				data['part' + i] = false;
			}
		} else {
			let ch = false;
			for (let i = parts.length - 1; i > value; i--) {
				if (data['part' + i]) {
					ch = true;
				} else if (ch) {
					data['part' + i] = true;
				}
			}
			ch = false;
			for (let i = 0; i < value; i++) {
				if (data['part' + i]) {
					ch = true;
				} else if (ch) {
					data['part' + i] = true;
				}
			}
		}
		this.setState({data});
	}

}