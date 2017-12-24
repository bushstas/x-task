import React from 'react';
import VisualElement from '../VisualElement';
import VisualElementActions from '../VisualElementActions';
import {handleWheel} from '../../utils/MouseHandlers';
import Canvas from '../../utils/Canvas';
import {COLORS} from '../../consts/colors';

const TYPE = 'drawing';

export default class Drawing extends React.Component {
	constructor() {
		super();
		this.canvas = new Canvas();
	}

	componentDidMount() {
		this.canvas.init(this.refs.canvas);
		this.canvas.set({
			color: COLORS.default.hash
		});
	}

	componentWillUnmount() {
		this.canvas.dispose();
		this.canvas = null;
	}

	componentDidUpdate() {
		let {color} = this.props.data;
		this.canvas.set({
			color: COLORS[color]
		});
	}

	render() {
		let {cx = -100, cy = -100, size = 40, focused} = this.state || {};
		let {data} = this.props;
		let {action = 'move', color = COLORS.default.name, locked} = data;
		let colorClass = this.getColorClass(color);
		let isDraw = action == 'draw' && !locked;
	 	return (
	 		<VisualElement 
	 			{...this.props}
	 			ref="element"
	 			classes="self $isDraw?.action-draw"
	 			type={TYPE}
	 			resizers={action == 'move'}
	 			onWheel={this.handleWheel}>

	 			{!locked && (
	 				<VisualElementActions 
	 					actions={['move', 'draw']}
	 					active={action}/>
	 			)}
	 			
	 			{action == 'draw' && (
	 				<div class="canvas-area">
		 				{focused && (
		 					<div 
			 					class="cursor $colorClass" 
			 					style={{
			 						width: size + 'px',
			 						height: size + 'px',
			 						left: cx + 'px',
			 						top: cy + 'px',
			 						marginLeft: size / -2 + 'px',
			 						marginTop: size / -2 + 'px',
			 					}}/>
			 			)}
		 				{this.canvasElement}
	 				</div>
	 			)}
	 			
	 			<canvas 
	 				ref="canvas"
	 				width={data.width}
	 				height={data.height}/>
	 		</VisualElement>

		)
	}

	get canvasElement() {
		let {data: {locked}} = this.props;
		let props;
		if (!locked) {
			props = {
				onMouseMove: this.handleMouseMove,
		 		onMouseEnter: this.handleMouseEnter,
		 		onMouseLeave: this.handleMouseLeave,
		 		onMouseDown: this.handleMouseDown,
		 		onMouseUp: this.handleMouseUp
			}
		}
		return (
			<div class="canvas" {...props}/>
		)
	}

	getColorClass(color) {
		return $classy(color, '.', ['black', 'pale', 'red', 'green', 'blue', 'orange']);
	}

	handleWheel = (e) => {
		if (this.props.data.action == 'move') {
			this.props.onChange(
				handleWheel(e, TYPE, this.props.data)
			);
		}
	}

	handleMouseMove = ({nativeEvent: {offsetX, offsetY}}) => {
		this.setState({
			cx: offsetX,
			cy: offsetY
		});
		if (this.drawing) {
			this.canvas.move(offsetX, offsetY);
		}
	}

	handleMouseEnter = () => {
		this.setState({focused: true});
	}

	handleMouseLeave = () => {
		this.setState({focused: false});
	}

	handleMouseDown = (e) => {
		this.drawing = true;
		this.canvas.start(e);
	}

	handleMouseUp = (e) => {
		this.drawing = false;
		this.canvas.stop();
	}

}