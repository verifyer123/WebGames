var soundsPath = "../../shared/minigames/sounds/"
var instructions = function(){
	var assets = {
        images: [
            {   name:"background",
				file: "images/instructions/back.png"},
            {   name:"okbtn",
                file: "images/instructions/okbtn.png"},
            {   name:"inst-click",
                file: "images/instructions/inst-click.png"},
            {   name:"inst-tap",
                file: "images/instructions/inst-tap.png"},
 
		],
        sounds: [
            {	name: "click",
				file: soundsPath + "pop.mp3"},
        ],
	}

	var sceneGroup
    var loopTween
	var popAudio

    
    function loadSounds(){
		sound.decode(assets.sounds)
	}
    
	function createInstructions(){
        
        var game = sceneGroup.game
		var circleGroup = new Phaser.Group(sceneGroup.game)

        /*var ins = circleGroup.create(0,0,'ins')
        ins.anchor.setTo(0.5,0.5)*/
        
        var platform = 'click'
        
        if(game.device.desktop == false){
            platform = 'tap'
        }
        
        var instruction = circleGroup.create(0,0,'inst-'+ platform)
        instruction.anchor.setTo(0.5,0.5)
        
        

		return circleGroup
	}

	function startGame(obj){
        
        obj.inputEnabled = false
        obj = obj.button
		//popAudio.play()
        sound.play("click")
		
		console.log('startGame')
        
        tweenLoop.stop()
        
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                sceneloader.show("zoeMundial")
            })
        })

        amazing.setMixPanelTrack("zoeMundial","enterGame")
		
	}
    
    function bounceButton(obj){
        /*if(obj.inputEnabled == false){
            return
        }*/
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

		var buttonSprite = buttonGroup.create(0, 0,'okbtn')
		buttonSprite.anchor.setTo(0.5, 0.5)

		/*buttonSprite.inputEnabled = true
		buttonSprite.events.onInputUp.add(startGame, this)*/
        
        bounceButton(buttonSprite)


        var tapSpace = game.add.graphics()
        tapSpace.beginFill(0xff0000)
        tapSpace.drawRect(0,0,game.world.width,game.world.height)
        tapSpace.endFill()
        tapSpace.alpha = 0
        tapSpace.inputEnabled = true
        tapSpace.events.onInputUp.add(startGame, this)
        tapSpace.button = buttonSprite
        //buttonGroup.add(tapSpace)

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

        amazing.setMixPanelTrack("zoeMundial","loadGame")
        
		game.stage.backgroundColor = "#ffffff"
	}
	
	function preload(){
		
		loadSounds()
		popAudio = new Audio(soundsPath + "pop.mp3")
    
	}
	
	return {
		name: "instructions",
		assets: assets,
		create: createScene,
		init: initialize,
		preload:preload,
	}
}()