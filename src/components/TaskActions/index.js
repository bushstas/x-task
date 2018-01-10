import React from 'react';
import Button from '../../ui/Button';

export default class TaskActions extends React.Component {
	static defaultProps = {
		onClose: () => {}
	}

	componentDidMount() {

	}

	render() {
		return (
			<div class="self">
				<div class="mask" onClick={this.handleClickMask}/>
				<div class="content">
					{this.buttons}
				</div>
			</div>
		)
	}

	get buttons() {
		let {data: {actions = [], dict}} = this.props;
		return (
			<div class="actions">
				{actions.map((action) => {
					return (
						<Button key={action}>
							{dict[action]}
						</Button>
					)
				})}
			</div>
		)
	}

	handleClickMask = () => {
		this.props.onClose();
	}
}