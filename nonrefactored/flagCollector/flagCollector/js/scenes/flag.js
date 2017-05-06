
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
            "cameroon":"Cameroon",
            "america":"America",
            "asia":"Asia",
            "oceania":"Oceania",
            "africa":"Africa",
            "europa":"Europe"
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
            "cameroon":"Camerún",
            "america":"América",
            "asia":"Asia",
            "oceania":"Oceanía",
            "africa":"África",
            "europa":"Europa"
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
    var GAME_DATA = {
        continents: [
            {   name:"america",
                countries:["mexico", "usa", "canada", "uruguay"]
            },
            {   name:"asia",
                countries:["japan", "china", "korea"]
            },
            {
                name:"africa",
                countries:["benin", "burkina", "cameroon"]
            },
            {   name:"oceania",
                countries:["palau", "micronesia", "nauru"]
            },
            {   name:"europa",
                countries:["ireland", "italy", "hungary"]
            }]
    }

    var ROUNDS = [
        {continent: "america", flags: ["mexico", "usa"]},
        {continent: "america", numFlags: 2},
        {continent: "america", numFlags: 4},
        {continent: "random", numFlags: 4}]
    
    var lives
	var sceneGroup = null
    var gameIndex = 23
    var tutoGroup
    var dojoSong
    var heartsGroup = null
    var pullGroup = null
    var continentsGroup
    var clock
    var timeValue
    var quantNumber
    var numPoints
    var flagObjects
    var continentObjects
    var flagsGroup
    var inputsEnabled
    var selectedFlags

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
        flagObjects = []
        continentObjects = []
        selectedFlags = []

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        
        loadSounds()
        
	}

	function generateCont(){
        if (continentsGroup.continent){
            continentsGroup.remove(continentsGroup.continent)
            pullGroup.add(continentsGroup.continent)
        }
	    
	    var numRandom = Math.floor(Math.random() * continentObjects.length)
        var continent = continentObjects[numRandom]
        pullGroup.remove(continent)
        continentsGroup.add(continent)
        var localizationText = localizationData[localization.getLanguage()][continent.name]
        continentsGroup.text.setText(localizationText)
        continentsGroup.continent = continent
	}

	function createContinent(name){
        var continentGroup = game.add.group()
        var continent = continentGroup.create(0, 0, 'atlas.flag', name)
        continent.anchor.setTo(0.5, 0.5)
        pullGroup.add(continentGroup)
        continentObjects.push(continent)
        continent.name = name
        continent.y = 40
    }
    
    function removeFlags() {
	    for (var flagIndex = 0; flagIndex < selectedFlags.length; flagIndex++)
        {
            var flag = selectedFlags[flagIndex]
            var tweenScene = game.add.tween(flag).to({alpha: 0}, 300, Phaser.Easing.Cubic.In, true)
            tweenScene.onComplete.add(function(){

                flagsGroup.remove(flag)
                pullGroup.add(flag)

                if (flag.particle) {
                    flag.particle.destroy()
                    flag.particle = null
                }
            })

        }
    }

    function addFlags(selectedFlags){
        var height = 350 * 0.5
        var width = game.world.width * 0.5 - 30
	    var maxNumX = 2
        var maxNumY = 2
        var xCount = 0
        var yCount = 0
        var startX = -width * 0.5
        var startY = -height * 0.5
        for (var flagIndex = 0; flagIndex < selectedFlags.length; flagIndex++){
	        var flag = selectedFlags[flagIndex]
            flag.alpha = 1
            pullGroup.remove(flag)
            flagsGroup.add(flag)
            xCount = flagIndex % maxNumX
            if ((flagIndex + 1) % (maxNumY + 1) === 0)
                yCount++

            flag.x = xCount * width/(maxNumX - 1) + startX
            flag.y = yCount * height/(maxNumY - 1) + startY
        }
    }

    function generateFlags(numFlags, flags) {

        selectedFlags = []
        var continentName = continentsGroup.continent.name
        if (!flags){
            flagObjects = Phaser.ArrayUtils.shuffle(flagObjects)
            var correctCounter = 1
            for (var flagIndex = 1; flagIndex < flagObjects.length; flagIndex++) {
                var flag = flagObjects[flagIndex]
                if ((flag.continent === continentName) && (correctCounter > 0)) {
                    correctCounter--
                    selectedFlags.push(flag)
                } else if ((selectedFlags.length < numFlags - correctCounter) && (flag.continent != continentName))  {
                    selectedFlags.push(flag)
                }
                if (selectedFlags.length >= numFlags)
                    break
            }
        }
        selectedFlags = Phaser.ArrayUtils.shuffle(selectedFlags)
        addFlags(selectedFlags)

        if (lives > 0)
            inputsEnabled = true
    }

    function createFlagsUI(){
        var flagBg = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.flag", "baseBanderas")
        flagBg.anchor.setTo(0.5, 0.5)

        flagsGroup = game.add.group()
        flagsGroup.x = game.world.centerX
        flagsGroup.y = game.world.bounds.bottom - 160
        sceneGroup.add(flagsGroup)
    }

	function createContinentUI() {
        continentsGroup = game.add.group()
        continentsGroup.x = game.world.centerX
        continentsGroup.y = game.world.bounds.top + 300
        sceneGroup.add(continentsGroup)
	    var bgContinent = continentsGroup.create(0, 0, 'atlas.flag', "rotafolio")
        bgContinent.anchor.setTo(0.5, 0.5)
        // var nameLocalized = localizationData[localization.getLanguage()][CONTINENTS[index]]
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var nameText = new Phaser.Text(game, 0, 0, "America", fontStyle)
        nameText.x = 0
        nameText.y = -165
        nameText.anchor.setTo(0.5,0.5)
        continentsGroup.add(nameText)
        continentsGroup.text = nameText
    }

    function onClickFlag(flag) {
        console.log("click")
        if (flag.continent === continentsGroup.continent.name) {
            sound.play("right")
            numPoints++
            createPart("star", flag)
            startRound()
        }
        else {
            sound.play("wrong")
            missPoint()
            createPart("wrong", flag)
        }
    }

	function createFlag(name) {
        var flagGroup = game.add.group()
        var baseFlag = flagGroup.create(0, 0, 'atlas.flag', "basebotonesBanderas")
        baseFlag.anchor.setTo(0.5, 0.5)
        var flag = flagGroup.create(0, 0, 'atlas.flag', "b_" + name)
        flag.anchor.setTo(0.5, 0.5)
        var baseName = flagGroup.create(0,-70, "atlas.flag", "baseNombreBanderas")
        baseName.anchor.setTo(0.5, 0.5)
        var fontStyle = {font: "32px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var nameLocalized = localizationData[localization.getLanguage()][name]
        var nameText = new Phaser.Text(game, 0, 0, nameLocalized, fontStyle)
        nameText.x = baseName.world.x
        nameText.y = baseName.world.y
        nameText.anchor.setTo(0.5,0.5)
        flagGroup.add(nameText)
        baseFlag.inputEnabled = true

        baseFlag.events.onInputDown.add(function(){
            if (inputsEnabled){
                inputsEnabled = false
                onClickFlag(flagGroup)
            }
        })

        return flagGroup
    }

    function createGameObjects(){
        pullGroup = game.add.group()
        pullGroup.x = -game.world.centerX * 2
        pullGroup.y = -game.world.centerY * 2
        sceneGroup.add(pullGroup)
        pullGroup.alpha = 0

        for (var i = 0; i < GAME_DATA.continents.length; i++)
        {
            var continent = GAME_DATA.continents[i]
            createContinent(continent.name)

            for (var j = 0; j < continent.countries.length; j++) {
                var flag = createFlag(continent.countries[j])
                flag.name = continent.countries[j]
                flag.continent = continent.name
                pullGroup.add(flag)
                flagObjects.push(flag)
            }
        }
    }
    
    function createPart(key,obj){

        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.flag',key);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.2;
        particlesGood.maxParticleScale = 1;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        // particlesGood.x = obj.x;
        // particlesGood.y = obj.y;
        particlesGood.start(true, 1000, null, 2);

        obj.add(particlesGood)
        obj.particle = particlesGood
        
    }

    function stopGame(win){
                
        //objectsGroup.timer.pause()
        //timer.pause()
        dojoSong.stop()
        clock.tween.stop()
        inputsEnabled = false
        
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

    function startRound() {
        var delay = 600

        removeFlags()
        game.time.events.add(delay,function(){
            startTimer(missPoint)
            generateCont()
            generateFlags(4)
        },this)
    }

    function missPoint(){
        
        sound.play("wrong")
        inputsEnabled = false
        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives === 0){
            stopGame(false)
        }
        else{
            startRound()
        }
        
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
        if (clock.tween)
            clock.tween.stop()


        clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
        clock.tween.onComplete.add(function(){
            onComplete()
        })
    }

    function onClickPlay(rect) {
        rect.inputEnabled = false
        sound.play("pop")
        game.add.tween(tutoGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){

            tutoGroup.y = -game.world.height
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
        clock.y = game.world.centerY + 80
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
            createGameObjects()
            createContinentUI()
            generateCont()
            createFlagsUI()
            generateFlags(4)
            createClock()
            createTutorial()
            
		}
	}
}()