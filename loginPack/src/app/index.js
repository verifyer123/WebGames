// console.log("test")

import React from 'react';
import { render } from 'react-dom'
import _ from 'lodash'
// import Router from 'react-router';
//
// import {Minigames} from "./components/Minigames";
// import {Map} from "./components/Map";
import {Continue} from "./components/continue";
import {Login} from "./components/Login";
import {Pin} from "./components/Pin";
import {Players} from "./components/Players";
import {Register} from "./components/Register";
import {login} from "./libs/login";
import {Nickname} from "./components/Nickname";
import {Success} from "./components/Success";
import {Recover} from "./components/Recover";

export let showLogin
export let getChildData
export let saveChild

class App extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			component: false,
			props:false,
			showPin:false
		};

		this.childData = {}
		this.setChildData = this.setChildData.bind(this)
		this.addChildData = this.addChildData.bind(this)
		this.register = this.register.bind(this)
		this.togglePin = this.togglePin.bind(this)
		this.loadAudios()
		getChildData = this.getChildData.bind(this)
		saveChild = this.saveGame.bind(this)
		this.registerLogin = this.registerLogin.bind(this)
	}

	togglePin(callback){
		this.setState({showPin:!this.state.showPin, pinCallback:callback})
	}

	handleClick(component, props) {  // switch the value of the showModal state
		if (component) {
			this.audios.cut.play()
		} else
			this.audios.pop.play()

		props = props || false
		this.setState({
			component: component,
			props: props
		});
	}

	loadAudios(){
		let cut = new Audio();
		cut.src = "sounds/cut.mp3";

		let pop = new Audio();
		pop.src = "sounds/pop.mp3"

		this.audios = {
			pop:pop,
			cut:cut
		}
	}
	registerLogin(){
		let child = this.childData

		function onSuccess(response) {
			$('#loadSpace').css("display", "none")
			this.setState({
				component: "success"
			})
			this.setChildData(response.child)
		}

		function onError() {
			$('#loadSpace').css("display", "none")
		}

		login.loginChild(child.nickname, child.pin.join(''), onSuccess.bind(this), onError)
	}

	register(newAccount){
		$('#loadSpace').css("display", "block")
		this.togglePin()

		newAccount = newAccount || false
		function onSuccess(){
			this.registerLogin()
		}

		function onError() {
			$('#loadSpace').css("display", "none")
		}


		let credentials = login.getCredentials()
		let data = {
			nickname:this.childData.nickname,
			email:this.childData.parentMail,
			pin:this.childData.pin.join(''),
			remoteID:this.childData.remoteID
		}

		if(!newAccount)
			data.token = credentials.token

		login.registerPin(data, onSuccess.bind(this), onError.bind(this), newAccount)
	}

	setChildData(childData){
		this.childData = childData
	}

	addChildData(prop, data){
		this.childData[prop] = data
	}

	getChildData(){
		return this.childData
	}

	saveGame(player, onSuccess, onError){
		this.addChildData("gameData", player)
		login.saveChild(player, onSuccess)
	}

	showLogin(forceLogin, autoLogin, onLogin){
		this.forceLogin = forceLogin || false

		this.onLogin = () => {
			onLogin()
			this.handleClick(false)
		}

		if(autoLogin){
			function onSuccess(response) {
				this.setChildData(response.child)
				this.handleClick("continue")
			}

			function onError() {
				this.handleClick("login")
			}

			login.checkLogin(onSuccess.bind(this), onError.bind(this))
		}else{
			this.handleClick("login")
		}
	}

	pinComponent(){
		if(this.state.showPin) {
			return <Pin closeModal={this.togglePin}
						nextCallback={this.state.pinCallback} addChildData={this.addChildData} audios={this.audios} />
		}else
			return null
	}

	getComponent(props) {

		let component = null
		switch (this.state.component) {
			case "register":
				component = <Register closeModal={this.handleClick.bind(this, false)}
									  onNext={this.handleClick.bind(this)} setChildData={this.setChildData} newAccount={props}
				addChildData={this.addChildData} audios={this.audios}/>
				break;
			case "login":
				component = <Login handleClick={this.handleClick.bind(this)} addChildData={this.addChildData}
								   child={this.childData} forceLogin={this.forceLogin} audios={this.audios}
				togglePin={this.togglePin} setChildData={this.setChildData}/>
				break
			case "players":
				component = <Players closeModal={this.handleClick.bind(this, false)} getComponent={this.getComponent}
									 children={props} callback={this.handleClick.bind(this, "nickname")}
				setChildData={this.setChildData} audios={this.audios}/>
				break;
			case "continue":
				component = <Continue closeModal={this.handleClick.bind(this, false)} audios={this.audios} onLogin={this.onLogin}/>
				break;
			case "nickname":
				component = <Nickname closeModal={this.handleClick.bind(this, false)} handleClick = {this.handleClick.bind(this)}
									  onRegister={this.register} addChildData={this.addChildData} newAccount={props} audios={this.audios}
				togglePin={this.togglePin}/>
				break;
			case "success":
				component = <Success closeModal={this.handleClick.bind(this, false)} child={this.childData}
									 onOk={this.handleClick.bind(this, "continue")} audios={this.audios}/>
				break;
			case "recover":
				component = <Recover closeModal={this.handleClick.bind(this, "login")} audios={this.audios}/>
				break;
			default:
				component = null
		}

		return component
	}

	render() {
		showLogin = this.showLogin.bind(this)
		return(
			<div>
				{this.getComponent(this.state.props)}
				{this.pinComponent()}
			</div>
		)
	}
};

// export function showLogin() {
// 	console.log(App)
// 	// App.state.showModal = !App.state.showModal
// }

// var routes = (
// 	<Route name="app" path="/" handler={App}>
// 	<Route name="login" path="/login" handler={LoginHandler}/>
// </Route>
// );

render(<App/>, window.document.getElementById("app"))
// Router.run(routes, function (Handler) {
// 	React.render(<Handler/>, document.body);
// });