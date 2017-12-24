import React from 'react';
import VisualElement from '../VisualElement';
import VisualElementActions from '../VisualElementActions';
import {handleWheel} from '../../utils/MouseHandlers';
import Canvas from '../../utils/Canvas';
import {COLORS} from '../../consts/colors';

const TYPE = 'drawing';
let timeout;

export default class Drawing extends React.Component {
	constructor() {
		super();
		this.canvas = new Canvas();
	}

	componentDidMount() {
		let {color, brushSize, path} = this.props.data;
		this.canvas.init(this.refs.canvas);
		this.canvas.set({
			color: COLORS[color],
			size: brushSize
		});
		this.canvas.draw(path);
	}

	componentWillUnmount() {
		this.canvas.dispose();
		this.canvas = null;
	}

	componentWillUpdate(props) {
		if (
			props.data.color != this.props.data.color || 
			props.data.brushSize != this.props.data.brushSize
		) {
			let {color, brushSize} = props.data;
			this.canvas.set({
				color: COLORS[color],
				size: brushSize
			});
		}

		if (
			props.data.width != this.props.data.width || 
			props.data.height != this.props.data.height
		) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				this.canvas.draw(props.data.path);
			}, 200);
		}
	}

	render() {
		let {cx = -100, cy = -100, focused} = this.state || {};
		let {data, active} = this.props;
		let {action = 'move', color, locked, brushSize, opacity} = data;
		let colorClass = this.getColorClass(color);
		let isDraw = active && (action == 'draw' || action == 'opacity') && !locked;
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
	 					actions={['move', 'draw', 'opacity']}
	 					active={action}/>
	 			)}
	 			
	 			{isDraw && (
	 				<div class="canvas-area">
		 				{focused && (
		 					<div 
			 					class="cursor $colorClass" 
			 					style={{
			 						opacity,
			 						width: brushSize + 'px',
			 						height: brushSize + 'px',
			 						left: cx + 'px',
			 						top: cy + 'px',
			 						marginLeft: brushSize / -2 + 'px',
			 						marginTop: brushSize / -2 + 'px',
			 					}}/>
			 			)}
		 				{this.canvasElement}
	 				</div>
	 			)}
	 			
	 			<canvas 
	 				style={{opacity}}
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
				onWheel: this.handleWheel,
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
		this.props.onChange(
			handleWheel(e, TYPE, this.props.data)
		);
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
		let {data: {path = []}} = this.props;
		path.push(
			this.canvas.stop()
		);
		this.props.onChange({path});
	}
}