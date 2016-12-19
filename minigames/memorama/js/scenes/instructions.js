var soundsPath = "../../shared/minigames/sounds/"
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
        images: [
            {   name:"background",
				file: "images/instructions/back.png"},
		],
        sounds: [
            {	name: "click",
				file: soundsPath + "pop.mp3"},
        ],
	}

	var sceneGroup
    var loopTween

    
    function loadSounds(){
		sound.decode(assets.sounds)
	}
    
	function createInstructions(){
        
        var game = sceneGroup.game
		var circleGroup = new Phaser.Group(sceneGroup.game)
        
        var platform = 'click'
        
        if(game.device.desktop == false){
            platform = 'tap'
        }
        
        var instruction = circleGroup.create(0,0,'atlas.instructions','instruccion')
        instruction.anchor.setTo(0.5,0.5)
        
        var button = circleGroup.create(0,instruction.height * 0.31,'atlas.instructions','inst-'+ platform)
        button.anchor.setTo(0.5,0.5)

		return circleGroup
	}

	function startGame(obj){
        
        sound.play("click")
        
        obj.inputEnabled = false
        tweenLoop.stop()
        
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                sceneloader.show("memorama")
            })
            
        })
        
        mixpanel.track(
            "enterGame",
            {"gameName": "chilimBalam"}
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
		circleInstructions.y = game.world.centerY - 60
		sceneGroup.add(circleInstructions)
        
		var buttonGo = createButton()
		buttonGo.x = game.world.centerX
		buttonGo.y = game.world.height * 0.9
		sceneGroup.add(buttonGo)
            
	}

	function initialize(){
        loadSounds()
        mixpanel.track(
            "loadGame",
            {"gameName": "chilimBalam"}
        );
        
		game.stage.backgroundColor = "#ffffff"
        //game.stage.backgroundColor = "#aea1ff"
	}

	return {
		name: "instructions",
		assets: assets,
		create: createScene,
		init: initialize
	}
}()