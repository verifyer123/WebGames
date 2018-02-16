import React from 'react';
import {localization} from "../libs/localization";

export class Continue extends React.Component {

	constructor(props) {
		super(props);
		this.audios = this.props.audios
		this.dataSubscription = this.props.child
		this.inTrial = this.dataSubscription.daysToExpire > 0

		this.closelgmodal = this.closelgmodal.bind(this)
	}

	closelgmodal(){
		this.props.closelgmodal()
	}

	continueClick(){
		if(this.inTrial)
			this.props.onLogin()
		else {
			localStorage.clear()
			this.props.closeModal()
		}
	}

	componentDidMount() {
		if (this.dataSubscription.daysToExpire > 7) {
			this.props.onLogin()
		}
	}

	render() {

		let youHaveDays = localization.getString("youHaveFree")
		let days = this.dataSubscription.daysToExpire
		youHaveDays = localization.replace(youHaveDays, days)
		let trialEnded = localization.getString("inTrial")
		let description = !this.inTrial ? localization.getString("remindCheck") : localization.getString("remindParents")

		let subtitle = this.inTrial ? youHaveDays : trialEnded

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

						<p className="subtitle" >{subtitle}</p>
						<div style={{textAlign: 'justify', color: '#727984', fontSize: '2vh'}} className="fontOpenSans textlgmodal22">
							<p>{description}</p>
						</div>
					</div>

					<div className="lgmodal-body">
							<button type="submit" className="loginBtn bgGreen" onClick={this.continueClick.bind(this)}>{localization.getString("ok")}</button><br />

					</div>
					<div className="fontOpenSans lgmodal-footer" style={{color: '#444444'}}>

					</div>
				</div>
			</div>
		)
	}
}

