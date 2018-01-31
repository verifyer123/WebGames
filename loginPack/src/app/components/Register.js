import React from 'react';
import {Pin} from '../components/Pin'
import {login} from '../libs/login'
import {Validation} from "../libs/validation";

export class Register extends React.Component {
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.state = {
			showPin:false,
			description: "- Please enter your parent's email -",
			showPass:false,
		}

		this.togglePass = this.togglePass.bind(this)
		this.closeModal = this.closeModal.bind(this)
		this.newAccount = this.props.newAccount
		console.log(this.newAccount, "account")

		this.title = this.newAccount ? "KID ACCOUNT" : "Login to Yogome"

	}

	componentDidMount() {
		this.cut.play()
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
					description: "- Now enter your parent's password. -"
				})
				$('#loadSpace').css("display", "none")
			}else{
				this.props.addChildData("parentMail", email)
				this.props.onNext("nickname", true)
			}
		}

		function onError() {
			Register.onError("There is no account registered with this email")
			$('#loadSpace').css("display", "none")
		}

		if(Validation.ValidateEmail(email)) {
			$('#loadSpace').css("display", "block")
			let data = {email:email}
			login.checkExists(data, onSuccess.bind(this), onError)
		}
		else
			Register.onError("Please enter a valid email")
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

		function onError() {
			Register.onError("This password is invalid for this account.")
			$('#loadSpace').css("display", "none")
		}

		login.loginParent({email:email, password:password}, onSuccess.bind(this), onError)
	}

	okPressed(){
		var email = $('#email').val()
		var password = $('#password').val()

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
		return this.state.showPass ? <div><input type="password" id="password" className="inputText" placeholder="password" name="password" onFocus={function(){
				$('#password').attr("placeholder", '')
				$('#password').removeClass('invalid')
				$('#onError').css('display', "none")
				// this.placeholder = ''
			}}
											onBlur={function(){
												$('#password').attr("placeholder", 'password')
											}} />
			<button className="recoverBtn" id="recoverPass">I Forgot My Password</button><br />
			</div>
	: null;
	}

	closeModal(){
		this.pop.play()
		this.props.closeModal()
	}

	render() {

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

						<input type="text" id="email" className="inputText" placeholder="email" name="email" onFocus={function(){
							$('#email').attr("placeholder", '')
							$('#email').removeClass('invalid')
							$('#onError').css('display', "none")
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#email').attr("placeholder", 'email')
							   }} />
						<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div>
						{this.getPassword()}

						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}} onClick={this.okPressed.bind(this)}>Next</button>

						<div id="loadSpace" className="loader" style={{display:"none"}}>
						</div>


					</div>
				</div>
			</div>
		)
	}
}

