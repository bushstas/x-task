import React from 'react';
import Dialog from '../../ui/Dialog';
import Input from '../../ui/Input';
import Tooltip from '../../ui/Tooltip';
import {dict} from '../../utils/Dictionary';

export default class TaskTerms extends React.Component {
	static defaultProps = {
		onSelect: () => {}
	}

	constructor() {
		super();
		this.state = {
			num: ''
		}
	}

	render() {
		let {onClose, dict} = this.props;
		return (
			 <Dialog title={dict.title}
	            onClose={onClose}
	            clickMaskToClose={true}
	            classes="dialog::large self">
	        	<div class="content">    
	            	{this.difficulties}
	            	{this.terms}
	            	{this.untils}
	            </div>
	        </Dialog>
		)
	}

	get difficulties() {
		let {difficulties = []} = dict;
		let {difficulty, dict: {diff}} = this.props;
		return (
			<div class="difficulties">
				<div class="caption">
					{diff}
					<Tooltip>
						task_difficulty
					</Tooltip>
				</div>
				<br/>
				{difficulties.map((d, i) => {
					let value = i + 1;
					let selected = difficulty == value;
					return (
						<div 
							class="difficulty $?selected"
							key={i}
							data-value={value}
							onClick={this.handleDifficultyClick}>
							{d}
						</div>
					)
				})}
			</div>
		)
	}

	get terms() {
		let {termsId, dict: {terms = [], period}} = this.props;
		return (
			<div class="terms">
				<div class="caption .mt20">
					{period}
					<Tooltip>
						task_terms
					</Tooltip>
				</div>
				<br/>
				{terms.map((t, i) => {
					let selected = t.value == termsId;
					if (typeof t == 'string') {
						return <div class="space" key={'space' + i}/>
					}
					return (
						<div 
							class="term $?selected"
							key={t.value}
							data-value={t.value}
							onClick={this.handleTermClick}>
							{t.name}
						</div>
					)
				})}
			</div>
		)
	}

	get untils() {
		let {until, dict: {till, number, untils = []}} = this.props;
		let {num} = this.state;
		return (
			<div class="untils">
				<div class="caption .mt20">
					{till}
					<Tooltip>
						task_until
					</Tooltip>
				</div>
				<br/>
				{untils.map((u, i) => {
					if (u) {
						let selected = !num && i == until;
						return (
							<div 
								class="until $?selected"
								key={i}
								data-value={i}
								onClick={this.handleUntilClick}>
								{u}
							</div>
						)
					}
					return <br key={i}/>
				})}
				<div>
					<div 
						class="until $num?selected"
						data-value={'n' + num}
						onClick={this.handleUntilClick}>
						<Input name="num" value={num} onChange={this.handleInputChange}/>
						{number}
					</div>
				</div>
			</div>
		)
	}

	handleDifficultyClick = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.onSelect(value, 'difficulty');
		}
	}

	handleTermClick = ({target: {dataset: {value}}}) => {
		if (value) {
			this.props.onSelect(value, 'termsId');
		}
	}

	handleUntilClick = ({target: {dataset: {value}}}) => {
		if (value && value[0] != 'n') {
			this.setState({num: ''});
			this.props.onSelect(value, 'until');
		}
	}

	handleInputChange = (name, num) => {
		if (num !== '') {
			num = ~~num.replace(/[^\d]/g, '');
			num = Math.max(num, 1);
			num = Math.min(num, 31);
		}
		this.setState({num});
		this.props.onSelect('n' + num , 'until');
	}
}