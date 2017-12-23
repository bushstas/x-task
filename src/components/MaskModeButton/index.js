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
				<Icon icon={maskShown ? 'mask_off' : 'mask'}/>
			</div>			
		)
	}

	handleClick = () => {
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

const params = {
  has: 'mask',
  flat: true
}
export default Store.connect(MaskModeButton, params);