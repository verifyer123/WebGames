var instructionsCostena = function(){

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
    var tweenLoop

    
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
        
        sound.play("click")
        
        tweenLoop.stop()
        
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                sceneloader.show("costena")
            })
            
        })
        
        mixpanel.track(
            "enterGame",
            {"gameName": "memoCostena"}
        );
		
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

		var buttonSprite = buttonGroup.create(0, 0, 'atlas.instructions','okbtn')
		buttonSprite.anchor.setTo(0.5, 0.5)

		buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)
        
        bounceButton(buttonSprite)

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
        
        var background = sceneGroup.create(0,0,'background')
        background.width = game.world.width
        background.height = game.world.height
        
		var circleInstructions = createInstructions()
		circleInstructions.x = game.world.centerX
		circleInstructions.y = game.world.centerY 
		sceneGroup.add(circleInstructions)
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xffffff);
        bottomRect.drawRect(0, game.world.height, game.world.width, -game.world.height * 0.125);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        
		var buttonGo = createButton()
		buttonGo.x = game.world.centerX
		buttonGo.y = game.world.height * 0.94
		sceneGroup.add(buttonGo)
            
	}

	function initialize(){
        loadSounds()
        mixpanel.track(
            "loadGame",
            {"gameName": "memoCostena"}
        );
        
		game.stage.backgroundColor = "#ffffff"
        //game.stage.backgroundColor = "#aea1ff"
	}

	return {
		name: "instructionsCostena",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()