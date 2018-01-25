import React from 'react';

export class Pin extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.pivot = 0
		this.pinSelected = []

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

	goNext(){
		console.log(this.pivot)
		if(this.pivot === 4){
			let pin = this.pinSelected.join('')

			this.pop.play()
			$("#save").hide();
			this.props.addChildData("pin", pin)
			this.props.nextCallback()
		}
	}

	removePin(){
		console.log(this.pivot)
		if(this.pivot < 1)
			return

		this.pivot--
		var val = this.pinSelected[this.pinSelected.length - 1]
		this.pinSelected.splice(-1,1)

		$("#yogo"+val).removeClass("buttonSelect")
		$("#Pin"+this.pivot).css("background-image", "")
		$("#Pin"+this.pivot).removeClass("imagenSelect")
		$("#Pin"+this.pivot).addClass("pinPoint")
		$("#Pin"+this.pivot).html('')

		$("#next").css("opacity", 0.5);
		console.log($("#next"))

	}

	pinSelect(id){
		console.log(id)
		var yogoId = "#yogo" + id

		var contains = false
		for(var pinIndex = 0; pinIndex < this.pinSelected.length; pinIndex++){
			if(this.pinSelected[pinIndex] === id){
				contains = true
				break
			}
		}

		if((this.pivot < 4)&&(!contains)){
			this.pinSelected[this.pivot] = id
			var img = $( yogoId ).css( "background-image" );
			console.log(img)

			$(yogoId).addClass("buttonSelect");

			$("#Pin"+this.pivot).removeClass("pinPoint");
			$("#Pin"+this.pivot).addClass("imagenSelect");
			$("#Pin"+this.pivot).css("background-image", img);
			$("#Pin"+this.pivot).html('<div class="miniCircle"><span class="textCircle">'+id+'</span></div>')

			this.pivot++;
		}

		if(this.pivot === 4){
			$("#next").css("opacity", 1);
			console.log($("#next"))
		}
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
			<div id="pin" className="modal">

				<div className="modal-content container-login" >
					<div className="navigation">
						<button className="closeModal close" onClick={this.closeModal}></button>
					</div>

					<div className="modal-header">
						<h2><div className="textModal28" style={{fontSize: "3vh", color: "dimgrey"}}>SET YOUR PIN</div></h2>
					</div>

					<div id="yogoContainer" className="modal-body ">
						{[...Array(12)].map((x, i) =>
							<div style={{width:"33.33%", display:"inline-block"}} key={i}>
							<div id={"yogo" + (i+1)} className="yogoButton" onClick={this.pinSelect.bind(this, (i+1))} style={{backgroundImage:"url('images/yogotars/"+(i+1) + ".png')"}}><div className="circle"><span className="textCircle">{i + 1}</span></div></div>
							</div>
						)}
					</div>

					<div className="containerPinPonit">
						<div id="container1" style={{width:"25%"}}> <div className="pinPoint" id="Pin0"></div></div>
						<div id="container2" style={{width:"25%"}}> <div className="pinPoint" id="Pin1"></div></div>
						<div id="container3" style={{width:"25%"}}> <div className="pinPoint" id="Pin2"></div></div>
						<div id="container4" style={{width:"25%"}}> <div className="pinPoint" id="Pin3"></div></div>
					</div>
					<div className="modal-footer" style={{display:"flex"}}>
						<button type="submit" id="back" className="loginBtn bgOrange" onClick={this.removePin.bind(this)}><img src="images/backspace.png" /> </button>
						<button type="submit" id="next" className="loginBtn bgGreen" style={{opacity: 0.5}} onClick={this.goNext.bind(this)}>NEXT</button>
					</div>
				</div>
			</div>
		)
	}
}

