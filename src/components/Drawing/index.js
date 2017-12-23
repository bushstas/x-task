import React from 'react';
import VisualElement from '../VisualElement';
import {handleWheel} from '../../utils/MouseHandlers';

const TYPE = 'drawing';

export default class Drawing extends React.Component {
	render() {
		let {data} = this.props;
	 	return (
	 		<VisualElement 
	 			{...this.props}
	 			ref="element"
	 			classes="self"
	 			type={TYPE}
	 			resizers={true}
	 			onWheel={this.handleWheel}>
	 			
	 			<canvas width={data.width} height={data.height}/>
	 		</VisualElement>

		)
	}

	handleWheel = (e) => {
		this.props.onChange(
			handleWheel(e, TYPE, this.props.data)
		);
	}
}