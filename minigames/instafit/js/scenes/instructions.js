var instructions = function(){

	var localizationData = {
		"EN":{
			"remove":"Remove",
			"badTeeth":"the bad teeth \nto play the song",
			"go":"OK"
		},

		"ES":{
			"remove":"Quita",
			"badTeeth":"los dientes malos \npara tocar la canción",
			"go":"OK",
		}
	}

	var assets = {
        atlases: [
            {   
                name: "atlas.instructions",
                json: "images/instructions/atlas.json",
                image: "images/instructions/atlas.png",
            },
        ],
	}

	var sceneGroup
    var tweenLoop


	function createInstructions(){
        
        var game = sceneGroup.game
		var circleGroup = new Phaser.Group(sceneGroup.game)
        
        var fontStyle = {font: "60px VAGRounded", fill: "#ffffff", align: "center"}
        
        var titleText = new Phaser.Text(sceneGroup.game, 0, 0, 'Descubre qué \ntan fit eres', fontStyle)
		titleText.anchor.setTo(0.5, 0.5)
        titleText.y = -275
		circleGroup.add(titleText)
        
        var icon = circleGroup.create(0,-45,'atlas.instructions','icon')
        icon.anchor.setTo(0.5,0.5)
        
		var fontStyle = {font: "35px VAGRounded", fill: "#ffffff", align: "center"}
        
		var topText = new Phaser.Text(sceneGroup.game, 0, 0, 'Contesta el quiz con base en lo\n que harías en cada situación', fontStyle)
		topText.anchor.setTo(0.5, 0.5)
        topText.y = 155
		circleGroup.add(topText)

		return circleGroup
	}

	function startGame(){
        
        tweenLoop.stop()
        
        mixpanel.track(
            "enterGame",
            {"gameName": "quizInstafit"}
        );
        //console.log(location.host + ' userIp')
		sceneloader.show("instafit")
	}
    
    function bounceButton(obj){
        if(obj.inputEnabled == false){
            return
        }
        tweenLoop = game.add.tween(obj.scale).to({x:1.2,y:1.2}, 450, Phaser.Easing.linear, true)
        tweenLoop.onComplete.add(function(){
            tweenLoop = game.add.tween(obj.scale).to({x:1,y:1}, 450, Phaser.Easing.linear, true)
            tweenLoop.onComplete.add(function(){
                bounceButton(obj)
            })
        })
    }
    
	function createButton(){
		var buttonGroup = new Phaser.Group(sceneGroup.game)

		var buttonSprite = buttonGroup.create(0, 0, 'atlas.instructions','button')
		buttonSprite.anchor.setTo(0.5, 0.5)

		buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)

		var fontStyle = {font: "60px VAGRounded", fill: "#ffffff", align: "center"}

		var label = new Phaser.Text(sceneGroup.game, 0, 0, localization.getString(localizationData, "go"), fontStyle)
		label.anchor.setTo(0.5, 0.5)
		buttonGroup.add(label)
        
        bounceButton(buttonGroup)

		return buttonGroup
	}
    
    function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}

	function createScene(){

		sceneGroup = game.add.group()

		var circleInstructions = createInstructions()
		circleInstructions.x = game.world.centerX
		circleInstructions.y = game.world.centerY 
		sceneGroup.add(circleInstructions)

		var buttonGo = createButton()
		buttonGo.x = game.world.centerX
		buttonGo.y = game.world.height * 0.82
		sceneGroup.add(buttonGo)
            
	}

	function initialize(){
        mixpanel.track(
            "loadGame",
            {"gameName": "quizInstafit"}
        );
        
		game.stage.backgroundColor = "#38b0f6"
        //game.stage.backgroundColor = "#aea1ff"
	}

	return {
		name: "instructions",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()