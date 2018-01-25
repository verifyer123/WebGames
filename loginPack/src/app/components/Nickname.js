import React from 'react';
import {Pin} from '../components/Pin'
import {login} from '../libs/login'

export class Nickname extends React.Component {
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.state = {
			showPin:false,
			description: "- Choose your nickname -",
			showPass:false,
		}

		this.closeModal = this.closeModal.bind(this)

	}

	componentDidMount() {
		this.cut.play()
	}

	static onError(text){
		$('#nickname').addClass('invalid')
		$('#password').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	okPressed(){
		var nickname = this.nickname.value

		this.props.addChildData("nickname", nickname)
		this.props.onNext()
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
						<button className="closeModal close" onClick={this.closeModal}></button>
					</div>
					<div className="modal-header">
						<div className="topImg">
							<div className="topImg">
								<img className="particule" src="images/particle-03.png"/>
								<img className="logo" src="images/neueicon.png"/>
								<img className="particule" src="images/particle-04.png"/>
							</div>
						</div>
						<h2><div className="textModal9" style={{fontSize: "3vh", color: "dimgrey"}}>Set your Nickname</div></h2>
						<p className="subtitle" >{this.state.description}</p>
					</div>

					<div className="modal-body">

						<input type="text" id="nickname" className="inputText" placeholder="nickname" name="nickname"
							   ref={(input) =>{this.nickname = input} }
							   onFocus={function(){
							$('#nickname').attr("placeholder", '')
							$('#nickname').removeClass('invalid')
							$('#onError').css('display', "none")
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#nickname').attr("placeholder", 'nickname')
							   }} />
						<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div>

						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}} onClick={this.okPressed.bind(this)}>Next</button>

						<div id="loadSpace" className="loader" style={{display:"none"}}>
						</div>


					</div>
				</div>
			</div>
		)
	}
}

