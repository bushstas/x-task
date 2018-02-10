import React from 'react';
import Icon from '../../ui/Icon';
import {dict} from '../../utils/Dictionary';
import Store from 'xstore';

class MaskModeButton extends React.PureComponent {
	render() {
		let {maskShown} = this.props;
		return (			
			<div 
				class="self"
				title={dict.mask}
				onClick={this.handleClick}
				onWheel={this.handleWheel}>
				<Icon 
					classes=".white-icon"
					icon={maskShown ? 'mask_off' : 'mask'}/>
			</div>			
		)
	}

	handleClick = (e) => {
		e.stopPropagation();
		Store.doAction('MASK_TOGGLE_PARAM', 'maskShown');
	}

	handleWheel = (e) => {
		e.preventDefault();
		let add = e.deltaY > 0 ? .1 : -.1;
		let {maskOpacity} = this.props;
		maskOpacity += add;
		maskOpacity = Math.min(0.95, Math.max(0.25, maskOpacity));
		Store.dispatch('MASK_PARAM_CHANGED', {maskOpacity});
	}
}

export default Store.connect(MaskModeButton, 'mask');