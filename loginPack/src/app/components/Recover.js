import React from 'react';
import {Pin} from '../components/Pin'
import {login} from '../libs/login'
import {Validation} from "../libs/validation";
import {localization} from "../libs/localization";

export class Recover extends React.Component {
	constructor(props) {
		super(props);
		this.audios = this.props.audios

		this.state = {
			lgmodal:"recover"
		}

		this.closemodal = this.closemodal.bind(this)
		this.showComponent = this.showComponent.bind(this)

	}

	static onError(text){
		$('#email').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	closemodal(){
		this.props.closeModal()
	}

	successRecover(){
		return <div id="success" className="lgmodal">

			<div className="lgmodal-content container-login" >
				<div className="navigation">
					<button className="closelgmodal close" onClick={this.closemodal}></button>
				</div>
				<div className="lgmodal-header">
					<div className="topImg">
						<img className="particule" src="images/particle-03.png"/>
						<img className="logo" src="images/lock-icon-opened.png"/>
						<img className="particule" src="images/particle-04.png"/>
					</div>
					<h2><div className="textlgmodal18" style={{fontSize: "3vh"}}>- {localization.getString("success")} -</div></h2>
					<div style={{textAlign: "justify", color: "#727984", fontSize: "2vh"}} className="fontOpenSans textlgmodal17">
						<p>{localization.getString("intrustionsToReset")}</p>
					</div>

				</div>

				<div className="lgmodal-body">
						<button type="submit" id="okSuccess" className="loginBtn bgGreen"><div className="textlgmodal3" onClick={this.closemodal}>{localization.getString("ok")}</div></button>
				<br/>

				</div>
			</div>
		</div>
	}

	showComponent(){
		return this.state.lgmodal === "recover" ? this.recoverlgmodal() : this.successRecover()
	}

	static onError(text){
		$('#email').addClass('invalid')
		$('#password').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	recoverPass(){
		this.audios.pop.play()

		let email = this.email.value
		console.log(email)
		if(!Validation.ValidateEmail(email)){
			Recover.onError("Invalid email.")
			return
		}

		$("#loadSpace").css("display", "block")

		function onSuccess(response) {
			$("#loadSpace").css("display", "none")

			if(response.status === "success") {
				this.setState({
					lgmodal: "success"
				})
			}else{
				Recover.onError(localization.getString("noAccountRegistered"))
			}
		}

		function onError() {
			$("#loadSpace").css("display", "none")
			Recover.onError(localization.getString("noAccountRegistered"))
		}

		login.recoverPass(email, onSuccess.bind(this), onError.bind(this))
	}

	recoverlgmodal(){
		return <div id="recover" className="lgmodal">

			<div className="lgmodal-content container-login" >
				<div className="navigation">
					<button className="closelgmodal close" onClick={this.closemodal}></button>
				</div>
				<div className="lgmodal-header">
					<div className="topImg">
						<img className="particule" src="images/particle-03.png"/>
						<img className="logo" src="images/lock-icon-closed.png"/>
						<img className="particule" src="images/particle-04.png"/>
					</div>
					<h2><div className="textlgmodal14" style={{fontSize: "3vh"}}>{localization.getString("resetPassword")}</div></h2>
					<div style={{textAlign: "justify", color: "#727984", fontSize: "2vh"}} className="fontOpenSans textlgmodal15">
						<p>{localization.getString("enterYourEmail")}</p>
					</div>
					<div style={{textAlign: "center"}}>
						<p><span id="error" className="smallRed fontOpenSans"></span>
						</p>
					</div>
				</div>

				<div className="lgmodal-body">

					<input type="text" id="email" className="inputText" placeholder={localization.getString("parentsMail")} ref={(input) => {this.email = input}} name="Email" onFocus={function(){
						$('#email').attr("placeholder", '')
						$('#email').removeClass('invalid')
						$('#onError').css('display', "none")
						// this.placeholder = ''
					}}
						   onBlur={function(){
							   $('#email').attr("placeholder", localization.getString("parentsMail"))
						   }} />
					<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div><br/>
					<button type="submit" id="send" className="loginBtn bgGreen" onClick={this.recoverPass.bind(this)}><div className="textlgmodal16">{localization.getString("submitRequest")}</div></button><br/>

				</div>

				<div id="loadSpace" className="loader" ref={(div) => {this.loadSpace = div }} style={{display:"none"}}>
				</div>

				<div className="fontOpenSans lgmodal-footer" style={{color: "#444444"}}>

				</div>
			</div>

		</div>
	}

	render() {

		return (
			<div>
				{this.showComponent()}

			</div>
		)
	}
}

