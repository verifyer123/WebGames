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

export let showContinue

class App extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			component: false,
			props:false
		};

		this.childData = {}
		this.setChildData = this.setChildData.bind(this)
		this.addChildData = this.addChildData.bind(this)
		this.register = this.register.bind(this)

	}

	handleClick(component, props) {  // switch the value of the showModal state
		props = props || false
		this.setState({
			component: component,
			props: props
		});
	}

	register(){
		function onSuccess(){
			this.setState({
				component: "contine"
			})
		}

		function onError() {
			console.log("error")
		}


		let credentials = login.getCredentials()
		let data = {
			nickname:this.childData.nickname,
			email:this.childData.parentMail,
			pin:this.childData.pin,
			token: credentials.token
		}

		login.registerPin(data, onSuccess.bind(this), onError.bind(this))
	}

	setChildData(childData){
		this.childData = childData
	}

	addChildData(prop, data){
		this.childData[prop] = data
		console.log(this.childData)
	}

	getComponent(props) {
		let component = null
		switch (this.state.component) {
			case "register":
				component = <Register closeModal={this.handleClick.bind(this, false)}
									  onNext={this.handleClick.bind(this)} setChildData={this.setChildData}/>
				break;
			case "login":
				component = <Login closeModal={this.handleClick.bind(this, false)}/>
				break
			case "players":
				component = <Players closeModal={this.handleClick.bind(this, false)} getComponent={this.getComponent}
									 children={props} callback={this.handleClick.bind(this, "nickname")}
				setChildData={this.setChildData}/>
				break;
			case "pin":
				component = <Pin closeModal={this.handleClick.bind(this, false)} getComponent={this.getComponent}
									 nextCallback={props} addChildData={this.addChildData}/>
				break;
			case "continue":
				component = <Continue closeModal={this.handleClick.bind(this, false)} />
				break;
			case "nickname":
				component = <Nickname closeModal={this.handleClick.bind(this, false)} onNext={this.handleClick.bind(this, "pin", this.register)} addChildData={this.addChildData}/>
				break;
			default:
				component = null
		}

		return component
	}

	render() {
		showContinue = this.handleClick
		return(
			<div>
				<button onClick={this.handleClick.bind(this, "register")}>Continue</button>
				{this.getComponent(this.state.props)}
			</div>
		)
	}
};

// export function showContinue() {
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