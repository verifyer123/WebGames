import React from 'react';
import {localization} from "../libs/localization";

export class Continue extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.audios = this.props.audios

		this.closelgmodal = this.closelgmodal.bind(this)
	}

	closelgmodal(){
		this.props.closelgmodal()
	}

	render() {
		let youHaveDays = localization.getString("youHaveFree")
		let days = 7
		youHaveDays = localization.replace(youHaveDays, days)

		return (
			<div id="save" className="lgmodal">
				<div className="lgmodal-content container-login" >
					<div className="navigation">
						<button className="closelgmodal close" onClick={this.props.onLogin} />
					</div>
					<div className="lgmodal-header">
						<div className="topImg">
							<img className="particule" src="images/particle-03.png"/>
							<img className="logo" src="images/neueicon.png"/>
							<img className="particule" src="images/particle-04.png"/>
						</div>
						<h2><div className="textlgmodal21" style={{fontSize:'3vh'}}>{localization.getString("welcomeYogome")}</div></h2>
						<p className="subtitle" >{youHaveDays}</p>
						<div style={{textAlign: 'justify', color: '#727984', fontSize: '2vh'}} className="fontOpenSans textlgmodal22">
							<p>{localization.getString("remindParents")}</p>
						</div>
					</div>

					<div className="lgmodal-body">
							<button type="submit" className="loginBtn bgGreen" onClick={this.props.onLogin}>{localization.getString("ok")}</button><br />

					</div>
					<div className="fontOpenSans lgmodal-footer" style={{color: '#444444'}}>

					</div>
				</div>
			</div>
		)
	}
}

