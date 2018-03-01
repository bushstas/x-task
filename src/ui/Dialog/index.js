import React from 'react';
import Icon from '../Icon';
import {dict} from '../../utils/Dictionary';

export default class Dialog extends React.Component {
	static defaultProps = {
		onClose: () => {}
	}

	render() {
		let {children, classes, titleContent} = this.props;
		return (
			<div class="box $classes">
				<div class="mask" onClick={this.handleMaskClick}/>
				<div class="self">
					<div class="title">
						{this.title}
						{titleContent}
						<Icon icon="close" 
							onClick={this.handleClose}
							classes="close"/>
					</div>
					<div class="content">
						{children}
					</div>
				</div>
			</div>
		)
	}

	get title() {
		let {title} = this.props;
		return (
			<div>
				<span class="logo">
					<Icon size="22" icon="logo"/>
					{dict.logo}
				</span>
				{title}
			</div>
		);
	}

	handleClose = (e = null) => {
		if (e) {
			e.stopPropagation();
		}
		this.props.onClose(this.props.name);
	}

	handleMaskClick = (e) => {
		e.stopPropagation();
		let {clickMaskToClose} = this.props;
		if (clickMaskToClose) {
			this.handleClose(e);
		}
	}

}