import React from 'react';

export class Success extends React.Component {
	//AQUI VA PARA SABER EL LENGUAGE
	constructor(props) {
		super(props);
		this.pop = new Audio();
		this.pop.src = "sounds/pop.mp3";

		this.cut = new Audio();
		this.cut.src = "sounds/cut.mp3";

		this.closeModal = this.closeModal.bind(this)
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

		return (
			<div id="save" className="modal">
				<div className="modal-content container-login" >
					<div className="navigation">
						<button className="closeModal close" onClick={this.closeModal} />
					</div>
					<div className="modal-header">
						<div className="topImg">
							<img className="particule" src="images/particle-03.png"/>
							<img className="logo" src="images/neueicon.png"/>
							<img className="particule" src="images/particle-04.png"/>
						</div>
						<h2><div className="textModal21" style={{fontSize:'3vh'}}>Account created</div></h2>
						<p className="subtitle" >- Make sure to save your login information -</p>
					</div>

					<div className="modal-body">
						<br/>
						<div>
							<div style={{display:"inline-block", width:"70%", marginBottom:"10px"}}>
								<div className="fontOpenSans labelSuccess textModal22">
									Username:
								</div>
								<div style={{textAlign:"left"}}>
									{this.props.child.nickname}
								</div>
							</div>
						</div>
						<hr/>
						<div>
							<div style={{display:"inline-block", width:"70%"}}>
								<div style={{textAlign: 'justify', color: '#727984', fontSize: '2vh', float:"left", marginTop:"2vh"}} className="fontOpenSans textModal22">
									Pin:
								</div>
								<div style={{float:"right"}}>
									{this.props.child.pin.map((i) =>
										<div style={{display:"inline-block"}} key={i}>
											<div id={"yogo" + (i+1)} className="pinDisplay" style={{backgroundImage:"url('images/yogotars/"+(i) + ".png')"}}><div className="pinCircle"><span className="textCircle">{i}</span></div></div>
										</div>
									)}
								</div>
							</div>
						</div>
						<br />
						<button type="submit" className="loginBtn bgBlue" onClick={this.props.onOk}>Ok</button><br />

					</div>
					<div className="fontOpenSans modal-footer" style={{color: '#444444'}}>

					</div>
				</div>
			</div>
		)
	}
}

