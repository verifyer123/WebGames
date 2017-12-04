import React from 'react';

export class Root extends React.Component{

	render() {
		return(
			<div className="wrapper">
				<nav id="sidebar">
					<div id="dismiss">
						<i className="glyphicon glyphicon-arrow-left"></i>
					</div>

					<div className="sidebar-header">
						<div id="navbar-logo-container homeButton">
							<img style={{width: '80%'}} className="img img-responsive " src="images/logo-yogome.png" alt="Logo Yogome" />
						</div>
					</div>

					<ul className="list-unstyled components">
						<li className="active">
							<ul className="list-unstyled" id="homeSubmenu">
								<li><a className="play-colors-orange webisodesSec" href="webisodes.html">Episodios</a></li>
								<li><a className="play-colors-bluesea yogodexSec" href="yogodex.html">Yogodex</a></li>
								<li><a className="play-colors-blue html5Games" href="letsplay.html">Juegos</a></li>
								<li><a className="play-colors-purple resourcesSec" href="yogofun.html">Recursos</a></li>
								<li><a className="play-colors-green" href="books.html">Libros</a></li>

							</ul>
							<button type="button" id="register-btn-sm" className="navbar-btn hidden">
								<span>Registro</span>
							</button>
						</li>
					</ul>
				</nav>


				<div id="content">
					<nav className="navbar navbar-default">
						<div className="container-fluid">
							<div className="menu-desktop">

								<div className="navbar-header col-xs-12 col-sm-2">
									<div className="col-xs-4 display-inline">
										<button type="button" id="sidebarCollapse" className="btn-burger-menu hidden-sm hidden-md hidden-lg">
											<i className="glyphicon glyphicon-menu-hamburger"></i>
											<span></span>
										</button>
									</div>
									<div className="col-xs-4 col-sm-12 display-inline">
										<a className="navbar-logo" href="http://yogome.com/play.yogome/">
											<div id="navbar-logo-container">
												<img className="img img-responsive" src="images/logo-yogome.png" alt="Logo Yogome" />
											</div>
										</a>
									</div>

								</div>

								<div className="collapse navbar-collapse col-sm-6" id="bs-navbar-collapse-1">
									<ul className="nav navbar-nav navbar-right">
										<li><a className="play-colors-orange webisodesSec" href="http://yogome.com/play.yogome/webisodes.html">Episodios</a></li>
										<li><a className="play-colors-bluesea yogodexSec" href="http://yogome.com/play.yogome/yogodex.html">Yogodex</a></li>
										<li><a className="play-colors-blue html5Games" href="http://yogome.com/play.yogome/letsplay.html">Juegos</a></li>
										<li><a className="play-colors-purple resourcesSec" href="http://yogome.com/play.yogome/yogofun.html">Recursos</a></li>
										<li><a className="play-colors-green" href="http://yogome.com/play.yogome/books.html">Libros</a></li>

										<li>
											<button type="button" id="register-btn-lg" className="navbar-btn">
												Registro
											</button>
										</li>
									</ul>
								</div>

							</div>
						</div>
					</nav>

					<div id="yogotars">
						<img className="eagle" src="images/eagle.png"/>
						<img className="luna" src="images/luna.png"/>
					</div>

					{this.props.children}
				</div>
			</div>
		);
	}
}