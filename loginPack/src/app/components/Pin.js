import React from 'react';
import {localization} from "../libs/localization";

export class Pin extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.audios = this.props.audios
		this.language = localization.getLanguage()

		this.pivot = 0
		this.pinSelected = []

		this.closemodal = this.closemodal.bind(this)
	}

	closemodal(){
		this.props.closeModal()
	}

	goNext(){
		if(this.pivot === 4){
			this.audios.pop.play()
			let pin = this.pinSelected

			$("#save").hide();
			this.props.addChildData("pin", pin)
			$('#loadSpace').css("display", "block")
			this.props.nextCallback()
		}
	}

	removePin(){
		this.audios.cut.play()

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
		this.audios.pop.play()

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
		return (
			<div id="pin" className="lgmodal">

				<div className="lgmodal-content container-login" >
					<div className="navigation">
						<button className="closelgmodal close" onClick={this.closemodal}></button>
					</div>

					<div className="lgmodal-header">
						<h2><div style={{fontSize: "3vh", color: "dimgrey"}}>
							{localization.getString("setYourPin", this.language)}
							</div>
						</h2>
					</div>

					<div id="yogoContainer" className="lgmodal-body ">
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
					<div className="lgmodal-footer" style={{display:"flex"}}>
						<button type="submit" id="back" className="loginBtn bgOrange" onClick={this.removePin.bind(this)}><img src="images/backspace.png" /> </button>
						<button type="submit" id="next" className="loginBtn bgGreen" style={{opacity: 0.5}} onClick={this.goNext.bind(this)}>
							{localization.getString("next", this.language)}
						</button>
					</div>
					<div id="loadSpace" className="loader" style={{display:"none"}}>
					</div>
				</div>
			</div>
		)
	}
}

