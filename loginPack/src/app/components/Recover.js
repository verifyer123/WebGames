import React from 'react';
import {Pin} from '../components/Pin'
import {login} from '../libs/login'
import {Validation} from "../libs/validation";

export class Recover extends React.Component {
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.state = {
			modal:"recover"
		}

		this.closeModal = this.closeModal.bind(this)
		this.showComponent = this.showComponent.bind(this)

	}

	componentDidMount() {
		this.cut.play()
	}

	static onError(text){
		$('#email').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	closeModal(){
		this.pop.play()
		this.props.closeModal()
	}

	successRecover(){
		return <div id="success" className="modal">

			<div className="modal-content container-login" >
				<div className="navigation">
					<button className="closeModal close" onClick={this.closeModal}></button>
				</div>
				<div className="modal-header">
					<div className="topImg">
						<img className="particule" src="images/particle-03.png"/>
						<img className="logo" src="images/lock-icon-opened.png"/>
						<img className="particule" src="images/particle-04.png"/>
					</div>
					<h2><div className="textModal18" style={{fontSize: "3vh"}}>- Success! -</div></h2>
					<div style={{textAlign: "justify", color: "#727984", fontSize: "2vh"}} className="fontOpenSans textModal17">
						<p>Instructions to reset your password have been emailed to you. Please check your email.</p>
					</div>

				</div>

				<div className="modal-body">
						<button type="submit" id="okSuccess" className="loginBtn bgGreen"><div className="textModal3" onClick={this.closeModal}>Ok</div></button>
				<br/>

				</div>
			</div>
		</div>
	}

	showComponent(){
		return this.state.modal === "recover" ? this.recoverModal() : this.successRecover()
	}

	static onError(text){
		$('#email').addClass('invalid')
		$('#password').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	recoverPass(){
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
					modal: "success"
				})
			}else{
				Recover.onError("There is no account registered with this email.")
			}
		}

		function onError() {
			$("#loadSpace").css("display", "none")
			Recover.onError("There is no account registered with this email.")
		}

		login.recoverPass(email, onSuccess.bind(this), onError.bind(this))
	}

	recoverModal(){
		return <div id="recover" className="modal">

			<div className="modal-content container-login" >
				<div className="navigation">
					<button className="closeModal close" onClick={this.closeModal}></button>
				</div>
				<div className="modal-header">
					<div className="topImg">
						<img className="particule" src="images/particle-03.png"/>
						<img className="logo" src="images/lock-icon-closed.png"/>
						<img className="particule" src="images/particle-04.png"/>
					</div>
					<h2><div className="textModal14" style={{fontSize: "3vh"}}>- Reset Password -</div></h2>
					<div style={{textAlign: "justify", color: "#727984", fontSize: "2vh"}} className="fontOpenSans textModal15">
						<p>Enter your email address and we'll send you instructions to reset your password.</p>
					</div>
					<div style={{textAlign: "center"}}>
						<p><span id="error" className="smallRed fontOpenSans"></span>
						</p>
					</div>
				</div>

				<div className="modal-body">

					<input type="text" id="email" className="inputText" placeholder="Email" ref={(input) => {this.email = input}} name="Email" onFocus={function(){
						$('#email').attr("placeholder", '')
						$('#email').removeClass('invalid')
						$('#onError').css('display', "none")
						// this.placeholder = ''
					}}
						   onBlur={function(){
							   $('#email').attr("placeholder", 'Email')
						   }} />
					<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div><br/>
					<button type="submit" id="send" className="loginBtn bgGreen" onClick={this.recoverPass.bind(this)}><div className="textModal16">Send</div></button><br/>

				</div>

				<div id="loadSpace" className="loader" ref={(div) => {this.loadSpace = div }} style={{display:"none"}}>
				</div>

				<div className="fontOpenSans modal-footer" style={{color: "#444444"}}>

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

