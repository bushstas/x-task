import React from 'react';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';
import TaskMark from '../../components/TaskMark';
import AreaSelection from '../../components/AreaSelection';
import Text from '../../components/Text';

class VisualElements extends React.Component {

	render() {
	 	return (
	 		<div class=".visual-elements">
				{this.mask}
				{this.elements}
			</div>
		)
	}

	get mask() {
		let {currentElement} = this.props;
		if (typeof currentElement == 'number' && currentElement >= 0) {
			return (
				<div class="mask" onMouseDown={this.handleBodyMouseDown}/>
			)
		}
	}

	get elements() {
		let {visualElements, currentElement, bent} = this.props;
		if (visualElements instanceof Array) {
			return visualElements.map((element, i) => {
				let {type, data} = element;
				let props = {
					key: i,
					index: i,
					data,
					active: i == currentElement,
					onChangeCoords: this.handleChangeCoords,
					onClick: this.handleClick
				}
				switch (type) {
					case 'mark': 
						if (!bent) {
							props.onLocChange = this.handleLocChange;
							return (
								<TaskMark {...props}/>
							)
						}
					break;

					case 'selection':
						if (bent) {
							let {markElement} = this.props;
							props.bent = true;
							props.markProps = visualElements[markElement];
							props.markProps.data.loc = 4;
						}
						return (
							<AreaSelection {...props}/>
						)

					case 'descr':
						props.onChangeText = this.handleChangeText;
						props.onChangeFontSize = this.handleChangeFontSize;
						return (
							<Text {...props}/>
						)
				}
			});
		}
	}

	handleBodyMouseDown = () => {
		this.props.dispatch('QUICKTASK_ACTIVE_ELEMENT_UNSET');
	}

	handleChange(data) {
		this.props.dispatch('QUICKTASK_VISUAL_ELEMENT_CHANGED', data);
	}

	handleChangeText = ({target: {value}}) => {
		this.handleChange({text: value});
	}

	handleChangeFontSize = (fontSize) => {
		this.handleChange({fontSize});
	}

	handleChangeCoords = (mx, my) => {
		this.handleChange({mx, my});
	}

	handleLocChange = (loc) => {
		this.handleChange({loc});
	}

	handleClick = (index) => {
		if (typeof index == 'number') {
			this.props.dispatch('QUICKTASK_ELEMENT_SET_ACTIVE', index);
		}
	}
}

const params = {
  has: 'quicktask',
  flat: true
}
export default Store.connect(VisualElements, params);