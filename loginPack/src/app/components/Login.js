import React from 'react';

export class Login extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.closeModal = this.closeModal.bind(this)
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
						<div>
							<span id="error" className="fontOpenSans"></span>
							<span id="recover" className="fontOpenSans"></span>
							<p></p>
						</div>
					</div>

					<div className="modal-body">

						<input type="text" id="email" className="inputText" placeholder="Username" name="Username" onFocus={function(){
							$('#email').attr("placeholder", '')
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#email').attr("placeholder", 'Username')
							   }} /><br />
						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}}>Login</button><br />

						<hr />
						<button type="submit" id="firstLogin" className="loginBtn bgOrange">First Time Login</button><br />
						<button type="submit" id="createAccount" className="loginBtn bgGreen">Create New Account</button><br />
						<button className="recoverBtn" id="recoverPass">I Forgot My Password</button><br />

					</div>
				</div>


			</div>
		)
	}
}

