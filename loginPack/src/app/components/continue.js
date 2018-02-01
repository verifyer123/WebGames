import React from 'react';
import {localization} from "../libs/localization";

export class Continue extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.audios = this.props.audios

		this.closeModal = this.closeModal.bind(this)
	}

	closeModal(){
		this.props.closeModal()
	}

	render() {
		let youHaveDays = localization.getString("youHaveFree")
		let days = 7
		youHaveDays = localization.replace(youHaveDays, days)

		return (
			<div id="save" className="modal">
				<div className="modal-content container-login" >
					<div className="navigation">
						<button className="closeModal close" onClick={this.props.onLogin} />
					</div>
					<div className="modal-header">
						<div className="topImg">
							<img className="particule" src="images/particle-03.png"/>
							<img className="logo" src="images/neueicon.png"/>
							<img className="particule" src="images/particle-04.png"/>
						</div>
						<h2><div className="textModal21" style={{fontSize:'3vh'}}>{localization.getString("welcomeYogome")}</div></h2>
						<p className="subtitle" >{youHaveDays}</p>
						<div style={{textAlign: 'justify', color: '#727984', fontSize: '2vh'}} className="fontOpenSans textModal22">
							<p>{localization.getString("remindParents")}</p>
						</div>
					</div>

					<div className="modal-body">
							<button type="submit" className="loginBtn bgGreen" onClick={this.props.onLogin}>{localization.getString("ok")}</button><br />

					</div>
					<div className="fontOpenSans modal-footer" style={{color: '#444444'}}>

					</div>
				</div>
			</div>
		)
	}
}

