import React from 'react';
import {login} from '../libs/login'
import {localization} from "../libs/localization";

export class Nickname extends React.Component {
	constructor(props) {
		super(props);
		this.audios = this.props.audios

		this.language = localization.getLanguage()
		this.state = {
			description: "- " + localization.getString("chooseYourNickname", this.language) + " -",
			showPass:false,
		}

		this.newAccount = this.props.newAccount

	}

	static onError(text){
		$('#nickname').addClass('invalid')
		$('#password').addClass('invalid')
		$('#onError').html(text)
		$('#onError').css("display", "block")
	}

	okPressed(){
		let nickname = this.nickname.value
		$('#loadSpace').css("display", "block")
		this.audios.pop.play()

		function onSuccess(response) {
			$('#loadSpace').css("display", "none")

			if(response.exists){
				onError()
				return
			}
			this.props.addChildData("nickname", nickname)
			this.props.togglePin(()=>{this.props.onRegister(this.newAccount)})
		}

		function onError() {
			Nickname.onError(localization.getString("anotherNickname"))
			$('#loadSpace').css("display", "none")
		}

		login.checkExists({nickname:nickname}, onSuccess.bind(this), onError)


	}

	render() {
		let nicknameText = localization.getString("nickname", this.language)
		return (
			<div id="signIn" className="lgmodal">

				<div className="lgmodal-content container-login" >
					<div className="navigation">
						<button className="closelgmodal close" onClick={this.props.handleClick.bind(null, "login")}></button>
					</div>
					<div className="lgmodal-header">
						<div className="topImg">
							<div className="topImg">
								<img className="particule" src="images/particle-03.png"/>
								<img className="logo" src="images/neueicon.png"/>
								<img className="particule" src="images/particle-04.png"/>
							</div>
						</div>
						<h2><div className="textlgmodal9" style={{fontSize: "3vh", color: "dimgrey"}}>{localization.getString("setNickname", this.language)}</div></h2>
						<p className="subtitle" >{this.state.description}</p>
					</div>

					<div className="lgmodal-body">

						<input type="text" id="nickname" className="inputText" placeholder={nicknameText} name="nickname"
							   ref={(input) =>{this.nickname = input} }
							   onFocus={function(){
							$('#nickname').attr("placeholder", '')
							$('#nickname').removeClass('invalid')
							$('#onError').css('display', "none")
							// this.placeholder = ''
						}}
							   onBlur={function(){
								   $('#nickname').attr("placeholder", nicknameText)
							   }} />
						<div id="onError" className="fontOpenSans" style={{display:"none", color:"red"}}></div>

						<button type="submit" id="login" className="loginBtn bgBlue" style={{marginBottom:"2vh"}} onClick={this.okPressed.bind(this)}>
							{localization.getString("next", this.language)}
						</button>

						<div id="loadSpace" className="loader" style={{display:"none"}}>
						</div>


					</div>
				</div>
			</div>
		)
	}
}

