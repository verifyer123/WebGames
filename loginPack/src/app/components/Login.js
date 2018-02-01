import React from 'react';
import {Pin} from './Pin.js'
import {login} from '../libs/login'
import {localization} from "../libs/localization";

export class Login extends React.Component {

	constructor(props) {
		super(props);
		this.audios = this.props.audios

		this.closeModal = this.closeModal.bind(this)
		this.togglePin = this.togglePin.bind(this)
		this.setLogin = this.setLogin.bind(this)
	}

	static onError(text){
		$('#username').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	togglePin() {  // switch the value of the showModal state
		$('#onError').css('display', "none")
		$('#username').removeClass('invalid')
		
		let userName = $('#username').val()
		userName = userName.replace(/\s/g, '')
		if(userName.length > 0) {
			this.audios.cut.play()
			this.props.togglePin(()=>{this.setLogin()})
		}else{
			Login.onError(localization.getString("invalidNickname"))
		}
	}

	setLogin(){

		this.togglePin()
		$('#loadSpace').css("display", "block")

		function onError() {
			console.log("error")
			Login.onError(localization.getString("pinNicknameError"))
			$('#loadSpace').css("display", "none")
		}

		function onSuccess() {
			console.log("success")
			$('#loadSpace').css("display", "none")
			this.props.handleClick("continue")
		}

		let child = this.props.child
		login.loginChild(child.username, child.pin.join(''), onSuccess.bind(this), onError)
	}

	onLoginPressed(){
		this.props.addChildData("username", this.username.value)
		this.togglePin()
	}

	closeModal(){
		this.props.handleClick(false)
	}

	render() {
		let language = localization.getLanguage()
		return (
			<div id="signIn" className="modal">

				<div className="modal-content container-login" >
					<div className="navigation">
						{!this.props.forceLogin &&
							<button className="closeModal close" onClick={this.closeModal}></button>
						}
					</div>
					<div className="modal-header">
						<div className="topImg">
							<div className="topImg">
								<img className="particule" src="images/particle-03.png"/>
								<img className="logo" src="images/yogome-logo.png"/>
								<img className="particule" src="images/particle-04.png"/>
							</div>
						</div>
						<h2><div style={{fontSize: "3vh"}}>- {localization.getString("logInYogome", language)} -</div></h2>
					</div>

					<div className="modal-body">

						<input type="text" id="username" ref={(input) => {this.username = input}} className="inputText" placeholder={localization.getString("nickname", language)} name="Username" onFocus={function(){
							$('#username').attr("placeholder", '')
							$('#username').removeClass('invalid')
							$('#onError').css('display', "none")
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#username').attr("placeholder", localization.getString("nickname", language))
							   }} /><br />
						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}} onClick={this.onLoginPressed.bind(this)}>{localization.getString("logIn", language)}</button>

						<div id="loadSpace" className="loader" style={{display:"none"}}>
						</div>
						<br />
						<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div>
						<hr />
						<button type="submit" id="firstLogin" className="loginBtn bgOrange" onClick={()=>{this.props.handleClick("register", false)}}>{localization.getString("firstTimeLogin", language)}</button><br />
						<button type="submit" id="createAccount" className="loginBtn bgGreen" onClick={()=>{this.props.handleClick("register", true)}}>{localization.getString("createAccount", language)}</button><br />
						<button className="recoverBtn" id="recoverPass" onClick={()=>{this.props.handleClick("recover")}}>{localization.getString("forgotPass", language)}</button><br />

					</div>
				</div>
			</div>
		)
	}
}

