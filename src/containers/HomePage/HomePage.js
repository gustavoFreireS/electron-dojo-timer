import React, {Component, Fragment} from "react";
import '../../stylesheets/styles.scss';
class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			element: null,
		};
		this.scaleButton = this.scaleButton.bind(this);
	}
	scaleButton(event){
		const { element } =  this.state;
		if (element){
			if (element !== event.target){
				element.classList.toggle("scaled");
				this.setState({
					element: event.target,
				})
				event.target.classList.toggle("scaled");
			}
			else {
				element.classList.toggle("scaled");
				this.setState({
					element: null,
				})
			}
		}
		else{
			this.setState({
				element: event.target,
			});
			event.target.classList.toggle("scaled");
		}
	}
	render() {
		return (
      <Fragment>
			<div className='container'>
				<h1>Hello Gustavo, Welcome to your Dashboard</h1>
        <div className='box' id="box">
          <div onClick={this.scaleButton} className='item box__blue'/>
          <div onClick={this.scaleButton} className='item box__red'/>
          <div onClick={this.scaleButton} className='item box__green'/>
          <div onClick={this.scaleButton} className='item box__purple'/>
        </div>
			</div>
      
      </Fragment>
		);
	}
}
export default HomePage;
