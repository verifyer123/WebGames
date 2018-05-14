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
		//console.log(props.children)

	}

	togglePin() {  // switch the value of the showlgmodal state
		this.audios.cut.play()
		this.setState({
			showPin: !this.state.showPin
		});
	}

	onPressed(child){
		this.audios.pop.play()
		this.props.setChildData(child)
		this.props.callback("firstLogin")
	}

	closemodal(){
		this.props.closeModal()
	}

	render() {
		let childrenIndent = []
		for(let index = 0; index < this.props.children.length; index++){
			let child = this.props.children[index]
			let childName = child.name || child.nickname
			childrenIndent.push(<button className="loginBtn bgBlue" key={childName} onClick={this.onPressed.bind(this, child)} data={child}>{childName}</button>)
		}

		return (
			<div id="players" className="lgmodal" data-backdrop="static">

				<div className="lgmodal-content container-login" >
					<div className="lgmodal-header">
						<div className="topImg">
							<img className="logo" src="images/neueicon.png"/>
						</div>
						<h2> <div className="textlgmodal8" style={{fontSize: "3vh"}}>- {localization.getString("selectProfile", this.language)} -</div></h2>
					</div>

					<div className="lgmodal-body">
						<div id="scrollArea">
							{childrenIndent}
							{/*{this.props.children.map((child) => (*/}
								{/*<button className="loginBtn bgBlue" key={child.name} onClick={this.onPressed.bind(this, child)} data={child}>{child.name}</button>*/}
							{/*))}*/}
						</div>
						<button type="submit" className="addPlayer" onClick={this.props.callback.bind(null, "newChild")}>+</button><br />
					</div>

				</div>


			</div>
		)
	}
}

