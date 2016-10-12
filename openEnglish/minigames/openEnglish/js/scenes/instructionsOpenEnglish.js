var instructionsOpenEnglish = function(){

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
        images: [
            {   name:"background",
				file: "images/instructions/back.png"},
		],
        sounds: [
            {	name: "click",
				file: "sounds/pop.mp3"},
        ],
	}

	var sceneGroup

    
    function loadSounds(){
		sound.decode(assets.sounds)
	}
    
	function createInstructions(){
        
        var game = sceneGroup.game
		var circleGroup = new Phaser.Group(sceneGroup.game)
        
        var platform = 'desktop'
        
        if(game.device.desktop == false){
            platform = 'android'
        }
        
        var instruction = circleGroup.create(0,0,'atlas.instructions',platform)
        instruction.anchor.setTo(0.5,0.5)

		return circleGroup
	}

	function startGame(obj){
        
        obj.inputEnabled = false
        sound.play("click")
        
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                sceneloader.show("openEnglish")
            })
            
        })
        
        mixpanel.track(
            "enterGame",
            {"gameName": "openEnglish1"}
        );
		
	}

	function createButton(){
		var buttonGroup = new Phaser.Group(sceneGroup.game)

		var buttonSprite = buttonGroup.create(0, 0, 'atlas.instructions','okbtn')
		buttonSprite.anchor.setTo(0.5, 0.5)

		buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)

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
        
        var background = new Phaser.Graphics(game)
        background.beginFill(0x006696)
        background.drawRect(0, 0, game.width, game.height)
        background.endFill()
        sceneGroup.add(background)
        
		/*var circleInstructions = createInstructions()
		circleInstructions.x = game.world.centerX
		circleInstructions.y = game.world.centerY 
		sceneGroup.add(circleInstructions)*/
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xb8008f);
        bottomRect.drawRect(0, 0, game.world.width, game.world.height * 0.125);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        
        var topText = sceneGroup.create(game.world.centerX, game.world.height * 0.065, 'atlas.instructions','tituloInstrucciones')
        topText.anchor.setTo(0.5,0.5)
        
        var centerInstructions = sceneGroup.create(game.world.centerX, game.world.centerY -50,'atlas.instructions','instruccionesCartas')
        centerInstructions.anchor.setTo(0.5,0.5)
        
        var nameCursor = 'manita'
        
        if(game.device.desktop == true){
            nameCursor = 'cursor'
        }
        
        var cursor = sceneGroup.create(game.world.centerX + 135, game.world.centerY - 35, 'atlas.instructions',nameCursor)
        cursor.anchor.setTo(0.5,0.5)
        
		var buttonGo = createButton()
		buttonGo.x = game.world.centerX
		buttonGo.y = game.world.height * 0.8
		sceneGroup.add(buttonGo)
        
        var botAd = sceneGroup.create(game.world.centerX, game.world.height,'atlas.instructions','LogoPie')
        botAd.anchor.setTo(0.5,1)
            
	}

	function initialize(){
        loadSounds()
        mixpanel.track(
            "loadGame",
            {"gameName": "openEnglish1"}
        );
        
		//game.stage.backgroundColor = "#67b2e7"
        //game.stage.backgroundColor = "#aea1ff"
	}

	return {
		name: "instructionsOpenEnglish",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()