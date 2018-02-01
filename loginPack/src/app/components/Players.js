import React from 'react';
import {Pin} from '../components/Pin'
import {localization} from "../libs/localization";

export class Players extends React.Component {
	constructor(props) {
		super(props);
		this.audios = this.props.audios

		this.state = {
			showPin:false
		}

		this.language = localization.getLanguage()

		this.togglePin = this.togglePin.bind(this)
		console.log(props.children)

	}

	togglePin() {  // switch the value of the showModal state
		this.audios.cut.play()
		this.setState({
			showPin: !this.state.showPin
		});
	}

	onPressed(child){
		this.audios.pop.play()
		this.props.setChildData(child)
		this.props.callback()
	}

	closeModal(){
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
						<h2> <div className="textModal8" style={{fontSize: "3vh"}}>- {localization.getString("selectProfile", this.language)} -</div></h2>
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

