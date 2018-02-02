import React from 'react';
import {localization} from "../libs/localization";

export class Success extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);

		this.closelgmodal = this.closelgmodal.bind(this)
	}

	closelgmodal(){
		this.props.closeModal()
	}

	render() {

		return (
			<div id="save" className="lgmodal">
				<div className="lgmodal-content container-login" >
					<div className="navigation">

					</div>
					<div className="lgmodal-header">
						<div className="topImg">
							<img className="particule" src="images/particle-03.png"/>
							<img className="logo" src="images/neueicon.png"/>
							<img className="particule" src="images/particle-04.png"/>
						</div>
						<h2><div className="textlgmodal21" style={{fontSize:'3vh', color:"dimgrey"}}>{localization.getString("accountCreated")}</div></h2>
						<p className="subtitle" >- {localization.getString("saveLoginInfo")} -</p>
					</div>

					<div className="lgmodal-body">
						<br/>
						<div>
							<div style={{display:"inline-block", width:"70%", marginBottom:"10px"}}>
								<div className="fontOpenSans labelSuccess textlgmodal22">
									{localization.getString("nickname")}:
								</div>
								<div style={{textAlign:"left"}}>
									{this.props.child.nickname}
								</div>
							</div>
						</div>
						<hr/>
						<div>
							<div style={{display:"inline-block", width:"70%"}}>
								<div style={{textAlign: 'justify', color: '#727984', fontSize: '2vh', float:"left", marginTop:"2vh"}} className="fontOpenSans textlgmodal22">
									{localization.getString("pin")}:
								</div>
								<div style={{float:"right"}}>
									{this.props.child.pin.map((i) =>
										<div style={{display:"inline-block"}} key={i}>
											<div id={"yogo" + (i+1)} className="pinDisplay" style={{backgroundImage:"url('images/yogotars/"+(i) + ".png')"}}><div className="pinCircle"><span className="textCircle">{i}</span></div></div>
										</div>
									)}
								</div>
							</div>
						</div>
						<br />
						<button type="submit" className="loginBtn bgBlue" onClick={this.props.onOk}>{localization.getString("ok")}</button><br />

					</div>
					<div className="fontOpenSans lgmodal-footer" style={{color: '#444444'}}>

					</div>
				</div>
			</div>
		)
	}
}

