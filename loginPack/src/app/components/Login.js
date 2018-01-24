import React from 'react';
import {Pin} from './Pin.js'
import {login} from '../libs/login'

export class Login extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.state = {
			showPin:false
		}

		this.pinSelected = []

		this.closeModal = this.closeModal.bind(this)
		this.togglePin = this.togglePin.bind(this)
		this.setLogin = this.setLogin.bind(this)
	}

	getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	componentDidMount() {
		this.cut.play()
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
		userName = userName.replace(/\s/g, '');
		if(userName.length > 0) {
			this.setState({
				showPin: !this.state.showPin
			});
		}else{
			Login.onError("Invalid username.")
		}
	}

	setLogin(){
		this.togglePin()
		$('#login').css("opacity", 0.5)
		$('#loadSpace').css("display", "block")

		function onError() {
			console.log("error")
			Login.onError("Username or pin incorrect.")
			$('#loadSpace').css("display", "none")
			$('#login').css("opacity", 1)
		}

		function onSuccess() {
			console.log("success")
			$('#loadSpace').css("display", "none")
			$('#login').css("opacity", 1)
		}

		login.loginParent({pin:"0000", username:"huu"}, onSuccess, onError)
	}

	getPinComponent(){
		return this.state.showPin ? <Pin closeModal={this.togglePin} pinSelected={this.pinSelected} login={this.setLogin}/> : null
	}

	closeModal(){
		this.pop.play()
		$("#save").hide();
		this.props.closeModal()
	}

	render() {

		let language = this.getParameterByName("language");
		if (language === null) {
			let lengua;
			//lengua = navigator.language || navigator.userLanguage;
			//language = eval("'" + lengua + "'").toUpperCase();
			language = "EN";
		} else {
			language.toUpperCase();
		}
		return (
			<div id="signIn" className="modal">

				<div className="modal-content container-login" >
					<div className="navigation">
						<button className="closeModal close" onClick={this.closeModal}></button>
					</div>
					<div className="modal-header">
						<div className="topImg">
							<div className="topImg">
								<img className="particule" src="images/particle-03.png"/>
								<img className="logo" src="images/yogome-logo.png"/>
								<img className="particule" src="images/particle-04.png"/>
							</div>
						</div>
						<h2><div className="textModal9" style={{fontSize: "3vh"}}>- Login to Yogome -</div></h2>
					</div>

					<div className="modal-body">

						<input type="text" id="username" className="inputText" placeholder="Username" name="Username" onFocus={function(){
							$('#username').attr("placeholder", '')
							$('#username').removeClass('invalid')
							$('#onError').css('display', "none")
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#username').attr("placeholder", 'Username')
							   }} /><br />
						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}} onClick={this.togglePin}>Login</button>

						<div id="loadSpace" className="loader" style={{display:"none"}}></div>
						<br />
						<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div>
						<hr />
						<button type="submit" id="firstLogin" className="loginBtn bgOrange">First Time Login</button><br />
						<button type="submit" id="createAccount" className="loginBtn bgGreen">Create New Account</button><br />
						<button className="recoverBtn" id="recoverPass">I Forgot My Password</button><br />

					</div>
				</div>
				{this.getPinComponent()}
			</div>
		)
	}
}

