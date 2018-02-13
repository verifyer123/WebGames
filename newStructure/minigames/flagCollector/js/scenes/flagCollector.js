
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var flagCollector = function(){
    
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
            },
             {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
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
				file: soundsPath + "rightChoice.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"}
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
    var pointsBar
    var roundCounter
    var correctTotal
    var correctFlags

	function loadSounds(){
		sound.decode(assets.sounds)
	}


	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        //gameActive = true
        lives = NUM_LIFES
        timeValue = 7
        quantNumber = 2
        numPoints = 0
        flagObjects = []
        continentObjects = []
        selectedFlags = []
        roundCounter = 0
        correctTotal = 0
        correctFlags = []

        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)
        inputsEnabled = false
        
        loadSounds()
        
	}

    function addPoint(number){
        numPoints++
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)

        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })

        addNumberPart(pointsBar.text,'+' + number)

        // if(pointsBar.number % 2 == 0){
        timeValue-=timeValue * 0.10
        // }

    }

    function createPointsBar(){

        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)

        var pointsImg = pointsBar.create(-10,10,'atlas.flag','xpcoins')
        pointsImg.anchor.setTo(1,0)

        var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 0, "0", fontStyle)
        pointsText.x = -pointsImg.width * 0.45
        pointsText.y = pointsImg.height * 0.25
        pointsBar.add(pointsText)

        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        pointsBar.text = pointsText
        pointsBar.number = 0

    }

	function generateCont(continentID){
        if (continentsGroup.continent){
            continentsGroup.remove(continentsGroup.continent)
            pullGroup.add(continentsGroup.continent)
        }
        var continent

        if (continentID === "random") {
            var numRandom = game.rnd.integerInRange(0,continentObjects.length - 1)
            continent = continentObjects[numRandom]
        } else {
            for(var continentIndex = 0; continentObjects.length; continentIndex++){
                continent = continentObjects[continentIndex]
                if(continentID === continent.name)
                    break

            }
        }

        pullGroup.remove(continent)
        continentsGroup.add(continent)
        var localizationText = localizationData[localization.getLanguage()][continent.name]
        continentsGroup.text.setText(localizationText)
        continentsGroup.continent = continent
        continent.alpha = 0
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

                flagsGroup.remove(flag)
                pullGroup.add(flag)

                if (flag.particle) {
                    flag.particle.destroy()
                    flag.particle = null
                }
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
            flag.correct.alpha = 0
            flag.correct.scale.x = 0.7; flag.correct.scale.y = 0.7
            flag.inputEnabled = true
            pullGroup.remove(flag)
            flagsGroup.add(flag)
            xCount = flagIndex % maxNumX
            if ((flagIndex + 1) % (maxNumY + 1) === 0)
                yCount++

            flag.x = xCount * width/(maxNumX - 1) + startX
            flag.y = yCount * height/(maxNumY - 1) + startY
        }
    }

    function getFlags(flagID) {
        var flagSelected
        for (var flagIndex = 0; flagIndex < flagObjects.length; flagIndex++){
            var flag = flagObjects[flagIndex]
            if (flag.name === flagID){
                flagSelected = flag
            }
        }
        return flagSelected
    }

    function generateFlags(numFlags, flags) {



        selectedFlags = []
        var continentName = continentsGroup.continent.name
        if (!flags){
            correctTotal = game.rnd.integerInRange(2, numFlags - 1)
            flagObjects = Phaser.ArrayUtils.shuffle(flagObjects)
            var correctflags = correctTotal
            for (var flagIndex = 0; flagIndex < flagObjects.length; flagIndex++) {
                var flag = flagObjects[flagIndex]
                if ((flag.continent === continentName) && (correctflags > 0)) {
                    correctflags--
                    selectedFlags.push(flag)
                } else if ((selectedFlags.length < numFlags - correctflags) && (flag.continent != continentName))  {
                    selectedFlags.push(flag)
                }
                if (selectedFlags.length >= numFlags)
                    break
            }
        } else{
            for (var flagIndex = 0; flagIndex < flags.length; flagIndex++){
                var flag = getFlags(flags[flagIndex])
                selectedFlags.push(flag)
                if (flag.continent === continentsGroup.continent.name)
                    correctTotal++
            }
        }
        selectedFlags = Phaser.ArrayUtils.shuffle(selectedFlags)
        addFlags(selectedFlags)

        if (lives > 0)
            inputsEnabled = true
    }

    function createFlagsUI(){
        // var flagBg = game.add.tileSprite(game.world.centerX, game.world.centerY, game.world.width, game.world.height, "atlas.flag", "baseBanderas")
        // sceneGroup.add(flagBg)
        var flagBg = sceneGroup.create(game.world.centerX, game.world.centerY, "atlas.flag", "baseBanderas")
        flagBg.width = game.world.width+2
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
            //numPoints++
            correctFlags.push(flag)
            correctTotal--
            flag.inputEnabled = false
            game.add.tween(flag.correct).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true)
            game.add.tween(flag.correct.scale).to({x: 1, y:1}, 300, Phaser.Easing.Cubic.Out, true)
            if (correctTotal <= 0) {
                startRound()
                inputsEnabled = false
                addPoint(1)
                for(var flagIndex = 0; flagIndex < correctFlags.length; flagIndex++){
                    createPart("star", correctFlags[flagIndex])
                }
                correctFlags = []
            }
        }
        else {
            sound.play("wrong")
            missPoint()
            createPart("wrong", flag)
            correctFlags = []
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
        var correct = flagGroup.create(-60,-40, "atlas.flag", "correct")
        // right.alpha = 0
        correct.anchor.setTo(0.5, 0.5)
        flagGroup.correct = correct

        baseFlag.events.onInputDown.add(function(){
            if ((inputsEnabled)&&(flagGroup.inputEnabled)){
                // inputsEnabled = false
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
            sound.play("gameLose")
		})
    }
    
    function preload(){
        
        game.stage.disableVisibilityChange = false;
        game.load.audio('dojoSong', soundsPath + 'songs/wormwood.mp3');
        
        /*game.load.image('introscreen',"images/flag/introscreen.png")
		game.load.image('howTo',"images/flag/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/flag/play" + localization.getLanguage() + ".png")*/

        game.load.image('tutorial_image',"images/flag/tutorial_image.png")
        //loadType(gameIndex)

        
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

    function startRound(notStarted) {

        var currentRound = ROUNDS[roundCounter]
        roundCounter = roundCounter < ROUNDS.length - 1 ? roundCounter + 1 : ROUNDS.length - 1
        if (clock.tween)
            clock.tween.stop()
        if(continentsGroup.continent)
            game.add.tween(continentsGroup.continent).to({alpha: 0}, 300, Phaser.Easing.Cubic.In, true)
        var tweenScene = game.add.tween(flagsGroup).to({alpha: 0}, 300, Phaser.Easing.Cubic.In, true)
        tweenScene.onComplete.add(function() {
            removeFlags()
            generateCont(currentRound.continent)
            generateFlags (currentRound.numFlags, currentRound.flags)
            game.add.tween(clock.bar.scale).to({x: clock.bar.origScale}, 300, Phaser.Easing.Cubic.Out, true)
            game.add.tween(continentsGroup.continent).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true)
            var tweenScene2 = game.add.tween(flagsGroup).to({alpha: 1}, 300, Phaser.Easing.Cubic.Out, true)
            tweenScene2.onComplete.add(function() {
                if(!notStarted)
                    startTimer(missPoint)
            })
        })
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
        // clock.bar.scale.x = clock.bar.origScale
        if (clock.tween)
            clock.tween.stop()


        clock.tween = game.add.tween(clock.bar.scale).to({x:0},timeValue * quantNumber * 1000,Phaser.Easing.linear,true )
        clock.tween.onComplete.add(function(){
            onComplete()
        })
    }

    function onClickPlay(rect) {
        

        tutoGroup.y = -game.world.height
        startTimer(missPoint)

    }

    function createTutorial(){
        
        tutoGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)

        
        /*var rect = new Phaser.Graphics(game)
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
		playText.anchor.setTo(0.5,0.5)*/
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
		name: "flagCollector",
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex,lives,parent.epicModel); 
            
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
            createPointsBar()
            createGameObjects()
            createContinentUI()
            // generateCont()
            createFlagsUI()
            // generateFlags(4)
            createClock()
            startRound(true)
            createTutorial()
            
		}
	}
}()