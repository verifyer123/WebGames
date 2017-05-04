
var soundsPath = "../../shared/minigames/sounds/"
var flag = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
            "usa":"USA",
            "mexico":"Mexico",
            "canada":"Canada",
            "uruguay":"Uruguay",
            "japan":"Japan",
            "china":"China",
            "korea":"South Korea",
            "italy":"Italy",
            "hungary":"Hungary",
            "ireland":"Ireland",
            "palau":"Palau",
            "micronesia":"Micronesia",
            "nauru":"Nauru",
            "benin":"Benin",
            "burkina":"Burkina Faso",
            "cameroon":"Cameroon"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "usa":"EUA",
            "mexico":"México",
            "canada":"Canadá",
            "uruguay":"Uruguay",
            "japan":"Japón",
            "china":"China",
            "korea":"Corea del Sur",
            "italy":"Italia",
            "hungary":"Hungría",
            "ireland":"Irlanda",
            "palau":"Palaos",
            "micronesia":"Micronesia",
            "nauru":"Nauru",
            "benin":"Benín",
            "burkina":"Burkina Faso",
            "cameroon":"Camerún"
		}
	}
    

	var assets = {
        atlases: [
            {   
                name: "atlas.flag",
                json: "images/flag/atlas.json",
                image: "images/flag/atlas.png"
            }
        ],
        images: [
            {   name:"fondo",
				file: "images/flag/fondo.png"}
		],
		sounds: [
            {	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "combo",
				file: soundsPath + "combo.mp3"},
            {	name: "flip",
				file: soundsPath + "flipCard.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "right",
				file: soundsPath + "rightChoice.mp3"}
		]
    }

    var NUM_LIFES = 3
    var FLAGS = ["mexico", "usa", "benin", "ireland", "canada", "uruguay", "burkina", "japan", "china", "korea", "italy", "hungary", "palau", "micronesia", "nauru", "cameroon"]
    
    var lives
	var sceneGroup = null
    var gameIndex = 23
    var tutoGroup
    var dojoSong
    var heartsGroup = null
    var pullGroup = null
    var clock
    var timeValue
    var quantNumber
    var numPoints
    var flagObjects

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 7
        quantNumber = 0.5
        numPoints = 0

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        
        loadSounds()
        
	}

	function createFlag(name) {
        var flagGroup = game.add.group()
        var baseFlag = flagGroup.create(0, 0, 'atlas.flag', "basebotonesBanderas")
        baseFlag.anchor.setTo(0.5, 0.5)
        var flag = flagGroup.create(0, 0, 'atlas.flag', "b_" + name)
        flag.anchor.setTo(0.5, 0.5)

        return flagGroup
    }

    function createFlags(){
        pullGroup = game.add.group()
        pullGroup.x = game.world.centerX
        pullGroup.y = game.world.centerY
        sceneGroup.add(pullGroup)
        // pullGroup.alpha = 0

        for (var i = 0; i < 1; i++)
        {
            var flag = createFlag(FLAGS[i])
            pullGroup.add(flag)
        }
    }
    
    function createPart(key,obj){
        
        var particlesNumber = 2
        
        if(game.device.desktop){
            
            particlesNumber = 4
            
            var particlesGood = game.add.emitter(0, 0, 100);

            particlesGood.makeParticles('atlas.flag',key);
            particlesGood.minParticleSpeed.setTo(-200, -50);
            particlesGood.maxParticleSpeed.setTo(200, -100);
            particlesGood.minParticleScale = 0.2;
            particlesGood.maxParticleScale = 1;
            particlesGood.gravity = 150;
            particlesGood.angularDrag = 30;

            particlesGood.x = obj.x;
            particlesGood.y = obj.y;
            particlesGood.start(true, 1000, null, particlesNumber);

            game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
            sceneGroup.add(particlesGood)

        }else{
            key+='Part'
            var particle = sceneGroup.create(obj.x,obj.y,'atlas.flag',key)
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1.2,1.2)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:1.65,y:1.65},300,Phaser.Easing.Cubic.In,true)
        }
        
    }

    function stopGame(win){
                
        //objectsGroup.timer.pause()
        //timer.pause()
        dojoSong.stop()
        
        var tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 750)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, numPoints, gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        
        game.load.spine('master', "images/spines/skeleton.json")  
        game.load.audio('dojoSong', soundsPath + 'songs/asianLoop2.mp3');
        
        game.load.image('introscreen',"images/flag/introscreen.png")
		game.load.image('howTo',"images/flag/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/flag/play" + localization.getLanguage() + ".png")
        
    }

    function addNumberPart(obj,number){

        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}

        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, number, fontStyle)
        pointsText.x = obj.world.x
        pointsText.y = obj.world.y
        pointsText.anchor.setTo(0.5,0.5)
        sceneGroup.add(pointsText)

        game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
        game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

    }

    function missPoint(){
        
        sound.play("wrong")
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives === 0){
            stopGame(false)
        }
        else
            startTimer(missPoint)
        
        addNumberPart(heartsGroup.text,'-1')
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.flag','life_box')

        pivotX+= heartImg.width * 0.45
        
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 18, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = heartImg.height * 0.15
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }

    function startTimer(onComplete) {
        var delay = 500
        clock.bar.scale.x = clock.bar.origScale

        game.time.events.add(delay,function(){
            clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
            clock.tween.onComplete.add(function(){
                onComplete()
            })

        },this)
    }

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
            createFlags()
            startTimer(missPoint)
        })
    }

    function createTutorial(){
        
        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            onClickPlay(rect)
            
        })
        
        tutoGroup.add(rect)
        
        var plane = tutoGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = tutoGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.flag','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = tutoGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		//console.log(inputName)
		var inputLogo = tutoGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.flag',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = tutoGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.flag','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = tutoGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }

    function createClock(){
        
        clock = game.add.group()
        clock.x = game.world.centerX
        clock.y = game.world.centerY
        sceneGroup.add(clock)
        
        var clockImage = clock.create(0,0,'atlas.flag','clock')
        clockImage.anchor.setTo(0.5,0.5)
        
        var clockBar = clock.create(-clockImage.width* 0.38,19,'atlas.flag','bar')
        clockBar.anchor.setTo(0,0.5)
        clockBar.width = clockImage.width*0.76
        clockBar.height = 22
        clockBar.origScale = clockBar.scale.x
        
        clock.bar = clockBar
        
    }
    
	return {
		assets: assets,
		name: "flag",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()
            
            var background = sceneGroup.create(-2,-2,'fondo')
            background.width = game.world.width+2
            background.height = game.world.height+2
            
            dojoSong = game.add.audio('dojoSong')
            game.sound.setDecodedCallback(dojoSong, function(){
                dojoSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
            
            createHearts()
            createClock()
            createTutorial()
            
		}
	}
}()