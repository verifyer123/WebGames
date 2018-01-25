import React from 'react';
import {Pin} from '../components/Pin'

export class Players extends React.Component {
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.state = {
			showPin:false
		}

		this.togglePin = this.togglePin.bind(this)
		console.log(props.children)

	}

	componentDidMount() {
		this.cut.play()
	}


	togglePin() {  // switch the value of the showModal state

		this.setState({
			showPin: !this.state.showPin
		});
	}

	onPressed(child){
		this.props.setChildData(child)
		this.props.callback()
	}

	closeModal(){
		this.pop.play()
		console.log(this.props.closeModal)
		this.props.closeModal()
	}

	render() {

		return (
			<div id="players" className="modal fade" data-backdrop="static">

				<div className="modal-content container-login" >
					<div className="modal-header">
						<div className="topImg">
							<img className="logo" src="images/neueicon.png"/>
						</div>
						<h2> <div className="textModal8" style={{fontSize: "3vh"}}>- Select a profile -</div></h2>
					</div>

					<div className="modal-body">
						<div id="scrollArea">
							{this.props.children.map((child) =>
								<button className="loginBtn bgBlue" key={child.name} onClick={this.onPressed.bind(this, child)} data={child}>{child.name}</button>
							)}
						</div>
						<button type="submit" className="addPlayer">+</button><br />
					</div>

				</div>


			</div>
		)
	}
}

