var soundsPath = "../../shared/minigames/sounds/"
var instructions = function(){

	var assets = {
        atlases: [
            {   
                name: "atlas.instructions",
                json: "images/instructions/atlas.json",
                image: "images/instructions/atlas.png",
            },
        ],
        sounds: [
            {	name: "click",
				file: soundsPath + "pop.mp3"},
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
        
        obj.inputEnabled = false
        sound.play("click")
        
        tweenLoop.stop()
        
        var scaleTween = game.add.tween(obj.scale).to({x:0.8,y:0.8}, 100, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(obj.scale).to({x:1,y:1}, 300, Phaser.Easing.linear, true)
            
            var alphaTween = game.add.tween(sceneGroup).to({alpha:0},400, Phaser.Easing.Cubic.Out, true,500)
            alphaTween.onComplete.add(function(){
                sceneloader.show("openenglish4")
            })
            
        })
        
        mixpanel.track(
            "enterGame",
            {"gameName": "openEnglish1"}
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
    
    function createImageGroup(){
        
        var imageGroup = game.add.group()
        imageGroup.x = game.world.centerX 
        imageGroup.y = game.world.centerY - 150
        imageGroup.scale.setTo(0.7,0.7)
        sceneGroup.add(imageGroup)
        
        var topBack = new Phaser.Graphics(game)
        topBack.beginFill(0xffffff);
        topBack.drawRoundedRect(0, 0, 300,300,30);
        topBack.endFill();
        topBack.x-= topBack.width * 0.5
        topBack.y-= topBack.height * 0.5
        imageGroup.add(topBack)
            
        var word = 'manzana'

        var group = game.add.group()
        imageGroup.add(group)

        var image = group.create(0,-25,'atlas.instructions',word)
        image.anchor.setTo(0.5,0.5)

        var imageText = game.add.bitmapText(0,115, 'wFont', word, 45);
        imageText.anchor.setTo(0.5, 0.5)
        imageText.tint = 0x000000
        group.add(imageText)
        
        var pivotX = game.world.centerX - 170
        
        for(var i = 0; i<5;i++){
            
            var button = sceneGroup.create(pivotX,game.world.centerY + 35 ,'atlas.instructions','espacioAzul')
            button.anchor.setTo(0.5,0.5)
            button.scale.setTo(0.8,0.8)
            pivotX+= 85
            
            var butText = game.add.bitmapText(button.x, button.y, 'wFont', '', 45);
            butText.anchor.setTo(0.5, 0.5)
            butText.tint = 0xffffff
            sceneGroup.add(butText)
            
            if(i == 2){
                butText.setText('P')
            }
            
        }
        
        var pivotX = game.world.centerX - 145
        
        var wordList = ['P','A','E','L']
        for(var i = 0; i<4;i++){
            
            var button = sceneGroup.create(pivotX,game.world.centerY + 190 ,'atlas.instructions','opcion1')
            button.anchor.setTo(0.5,0.5)
            button.scale.setTo(0.75,0.75)
            pivotX+= 100
            
            var butText = game.add.bitmapText(button.x, button.y, 'wFont', wordList[i], 45);
            butText.anchor.setTo(0.5, 0.5)
            butText.tint = 0x000000
            sceneGroup.add(butText)
            
        }

    }
    
	function createScene(){

		sceneGroup = game.add.group()
        
        var background = new Phaser.Graphics(game)
        background.beginFill(0x058fff)
        background.drawRect(0, 0, game.width, game.height)
        background.endFill()
        sceneGroup.add(background)
        
        var bottomRect = new Phaser.Graphics(game)
        bottomRect.beginFill(0xffffff);
        bottomRect.drawRect(0, 0, game.world.width, 170);
        bottomRect.endFill();
        bottomRect.anchor.setTo(0,1)
        sceneGroup.add(bottomRect)
        
        var topText = sceneGroup.create(game.world.centerX, 78, 'atlas.instructions','tituloInstrucciones')
        topText.anchor.setTo(0.5,0.5)
        
        createImageGroup()
        
        var cursor = sceneGroup.create(game.world.centerX + 110,game.world.centerY +115,'atlas.instructions','mano')
        cursor.anchor.setTo(0.5,0.5)
        cursor.scale.setTo(0.8,0.8)
        
		var buttonGo = createButton()
		buttonGo.x = game.world.centerX
		buttonGo.y = game.world.height * 0.83
		sceneGroup.add(buttonGo)
        
        var botAd = sceneGroup.create(game.world.centerX, game.world.height - 25,'atlas.instructions','LogoPie')
        botAd.anchor.setTo(0.5,1)
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
            
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
    
    function preload(){
        game.load.bitmapFont('wFont', 'images/font/wFont.png', 'images/font/wFont.fnt');
    }
    
	return {
		name: "instructions",
		assets: assets,
        preload:preload,
		create: createScene,
		init: initialize
	}
}()