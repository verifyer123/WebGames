import React from 'react';
import {login} from '../libs/login'
import {Validation} from "../libs/validation";
import {localization} from "../libs/localization";

export class Register extends React.Component {
	constructor(props) {
		super(props);
		this.audios = this.props.audios
		this.language = localization.getLanguage()

		this.state = {
			description: "- "+ localization.getString("enterParentsMail", this.language) +" -",
			showPass:false,
		}

		this.togglePass = this.togglePass.bind(this)
		this.closeModal = this.closeModal.bind(this)
		this.newAccount = this.props.newAccount

		let kidAccountText = localization.getString("kidAccount", this.language)
		let loginYogome = localization.getString("logInYogome", this.language)
		this.title = this.newAccount ? kidAccountText : loginYogome

	}

	static onError(text){
		$('#email').addClass('invalid')
		$('#password').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	enterEmail(email){
		function onSuccess(response) {

			if(!this.newAccount) {
				if (!response.exists)
					return onError()

				this.setState({
					showPass: true,
					description: "- " + localization.getString("enterParentPass", this.language) + " -"
				})
				$('#loadSpace').css("display", "none")
			}else{
				if (response.exists)
					return onError()

				this.props.addChildData("parentMail", email)
				this.props.onNext("nickname", true)
			}
		}

		function onError() {
			let errorTag = !this.newAccount ? "noAccountRegistered" : "accountRegisteredError"
			Register.onError(localization.getString(errorTag))
			$('#loadSpace').css("display", "none")
		}

		onError = onError.bind(this)

		if(Validation.ValidateEmail(email)) {
			$('#loadSpace').css("display", "block")
			let data = {email:email}
			login.checkExists(data, onSuccess.bind(this), onError)
		}
		else
			Register.onError(localization.getString("invalidEmail", this.language))
	}

	enterPassword(email, password){
		$('#loadSpace').css("display", "block")
		function onSuccess(response) {
			console.log(response)
			var children = response.children
			if((children)&&(children.length > 1))
				this.props.onNext("players", children)
			else{
				let child = children ? children[0] : response.child
				this.props.onNext("nickname", child)
			}

			$('#loadSpace').css("display", "none")
		}

		let language = this.language
		function onError() {
			Register.onError(localization.getString("invalidPassword", language))
			$('#loadSpace').css("display", "none")
		}

		login.loginParent({email:email, password:password}, onSuccess.bind(this), onError)
	}

	okPressed(){
		var email = $('#email').val()
		var password = $('#password').val()
		this.audios.pop.play()

		if(!this.state.showPass){
			this.enterEmail(email)
		}else{
			this.enterPassword(email, password)
		}
	}

	togglePass(){
		this.setState({
			showPass: !this.state.showPass
		})
	}

	getPassword(){
		let passwordText = localization.getString("password", this.language)
		return this.state.showPass ? <div><input type="password" id="password" className="inputText" placeholder={passwordText} name="password" onFocus={function(){
				$('#password').attr("placeholder", '')
				$('#password').removeClass('invalid')
				$('#onError').css('display', "none")
				// this.placeholder = ''
			}}
											onBlur={function(){
												$('#password').attr("placeholder", {passwordText})
											}} />
			<button className="recoverBtn" id="recoverPass" onClick={this.props.onNext.bind(null, "recover")}>{localization.getString("forgotPass", this.language)}</button><br />
			</div>
	: null;
	}

	closeModal(){
		this.props.closeModal()
	}

	render() {
		let emailText = localization.getString("parentsMail", this.language)
		return (
			<div id="signIn" className="modal">

				<div className="modal-content container-login" >
					<div className="navigation">
						<button className="closeModal close" onClick={this.props.onNext.bind(null, "login")}></button>
					</div>
					<div className="modal-header">
						<div className="topImg">
							<div className="topImg">
								<img className="particule" src="images/particle-03.png"/>
								<img className="logo" src="images/neueicon.png"/>
								<img className="particule" src="images/particle-04.png"/>
							</div>
						</div>
						<h2><div className="textModal9" style={{fontSize: "3vh", color: "dimgrey"}}>{this.title}</div></h2>
						<p className="subtitle" >{this.state.description}</p>
					</div>

					<div className="modal-body">

						<input type="text" id="email" className="inputText" placeholder={emailText} name="email" onFocus={function(){
							$('#email').attr("placeholder", '')
							$('#email').removeClass('invalid')
							$('#onError').css('display', "none")
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#email').attr("placeholder", emailText)
							   }} />
						<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div>
						{this.getPassword()}

						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}} onClick={this.okPressed.bind(this)}>
							{localization.getString("next")}
						</button>

						<div id="loadSpace" className="loader" style={{display:"none"}}>
						</div>

						{this.newAccount && <div><img className="checkbox" src="images/checkbox.png" />{localization.getString("byRegistringAgree")}</div>}

					</div>
				</div>
			</div>
		)
	}
}

