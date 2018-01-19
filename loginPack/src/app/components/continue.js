import React from 'react';
import ReactAudioPlayer from 'react-audio-player';

export class Continue extends React.Component {
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
			<div id="save" className="modal">
				<div className="modal-content container-login" >
					<div className="navigation">
						<button className="closeModal close" onClick={this.closeModal} />
					</div>
					<div className="modal-header">
						<div className="topImg">
							<img className="logo" src="images/continue.png"/>
						</div>
						<h2><div className="textModal21" style={{fontSize:'3vh'}}>Want to keep playing?</div></h2>
						<div style={{textAlign: 'justify', color: '#727984', fontSize: '2vh'}} className="fontOpenSans textModal22">
							<p>You're at the end of the test! Ask your parents to add their email so the adventure can continue.</p>
						</div>
					</div>

					<div className="modal-body">
						<br />
							<button type="submit" className="loginBtn close" onClick={this.closeModal}>Ok</button><br />

					</div>
					<div className="fontOpenSans modal-footer" style={{color: '#444444'}}>

					</div>
				</div>
			</div>
		)
	}
}

