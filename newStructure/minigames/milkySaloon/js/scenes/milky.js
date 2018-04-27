var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var milky = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        atlases: [
            {   
                name: "atlas.time",
                json: "images/milky/timeAtlas.json",
                image: "images/milky/timeAtlas.png",
            },
            {   
                name: "atlas.milky",
                json: "images/milky/atlas.json",
                image: "images/milky/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/milky/gametuto.png"
			},
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "lock",
				file: soundsPath + "lock.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "cog",
				file: soundsPath + "cog.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "squeeze",
				file: soundsPath + "squeeze.mp3"},
            {	name: "throw",
                    file: soundsPath + "throw.mp3"},
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 105
    var tutoGroup
	var indexGame
    var overlayGroup
    var cowSong
    var magician
    var bar
    var flavors = {choco:0, straw:1, vanilla:2, item:3}
    var btn = ['chocoBtn', 'strawBtn', 'vanillaBtn', 'doorBtn']
    var mugs = ['chocoMug', 'strawMug', 'vanillaMug', 'emptyMug']
    var buttonsGroup
    var ordersGroup
    var mugsGroup
    var order
    var delay
    var timeBar
    var tweenTiempo
    var doorsOpen	
    var tweenStarted
    var level
    var handsGroup

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        doorsOpen = false
        delay = 8000
        tweenStarted = false
        level = false
        
        loadSounds()
        
	}

    function popObject(obj,delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0.01},250,Phaser.Easing.linear,true)
        },this)
    }
    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)
                
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

    }
	
    function changeImage(index,group){
        for (var i = 0;i< group.length; i ++){
            group.children[i].alpha = 0
            if( i == index){
                group.children[i].alpha = 1
            }
        }
    } 
    
    function addNumberPart(obj,number,isScore){
        
        var pointsText = lookParticle('text')
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y
            pointsText.anchor.setTo(0.5,0.5)
            pointsText.setText(number)
            pointsText.scale.setTo(1,1)

            var offsetY = -100

            pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
            
            deactivateParticle(pointsText,800)
            if(isScore){
                
                pointsText.scale.setTo(0.7,0.7)
                var tweenScale = game.add.tween(obj.parent.scale).to({x:0.8,y:0.8},200,Phaser.Easing.linear,true)
                tweenScale.onComplete.add(function(){
                    game.add.tween(obj.parent.scale).to({x:1,y:1},200,Phaser.Easing.linear,true)
                })

                offsetY = 100
            }
            
            game.add.tween(pointsText).to({y:pointsText.y + 100},800,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},250,Phaser.Easing.linear,true,500)
        }
        
    }
    
    function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            stopGame(false)
        }
        
        addNumberPart(heartsGroup.text,'-1',true)
        
    }
    
    function addPoint(number){
        
        sound.play("magic")
        pointsBar.number+=number;
        pointsBar.text.setText(pointsBar.number)
        
        var scaleTween = game.add.tween(pointsBar.scale).to({x: 1.05,y:1.05}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(pointsBar.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        addNumberPart(pointsBar.text,'+' + number,true)		
        
    }
    
    function createPointsBar(){
        
        pointsBar = game.add.group()
        pointsBar.x = game.world.width
        pointsBar.y = 0
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(-10,10,'atlas.milky','xpcoins')
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
    
    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 10
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        var heartImg = group.create(0,0,'atlas.milky','life_box')

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
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        cowSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
            
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
        
    function preload(){
        

		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('cowSong', soundsPath + 'songs/farming_time.mp3');
        
		game.load.image('howTo',"images/milky/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/milky/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/milky/introscreen.png")
        game.load.spine("magician", "images/spines/magician/magician.json")
        game.load.spine("bar", "images/spines/bar/bar.json")
        game.load.spine("cow", "images/spines/cow/cow.json")
        game.load.spritesheet('lamp', 'images/sprites/137x135_32f_24fps.png', 137, 135, 32)
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        initGame()
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        
        var rect = new Phaser.Graphics(game)
        rect.beginFill(0x000000)
        rect.drawRect(0,0,game.world.width *2, game.world.height *2)
        rect.alpha = 0.7
        rect.endFill()
        rect.inputEnabled = true
        rect.events.onInputDown.add(function(){
            rect.inputEnabled = false
			sound.play("pop")
            game.add.tween(overlayGroup).to({alpha:0},500,Phaser.Easing.linear,true).onComplete.add(function(){
                
				overlayGroup.y = -game.world.height
                initGame()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.milky','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.milky',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.milky','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var fondo = sceneGroup.create(game.world.centerX, game.world.centerY, 'atlas.milky', "fondo");
        fondo.anchor.setTo(0.5, 0.5)
        fondo.width = game.world.width
        fondo.height = game.world.height	
		
        bar = game.add.spine(game.world.centerX, game.world.centerY - 40, "bar")
        bar.scale.setTo(1.2, 0.9)
        bar.setAnimationByName(0, "IDDLE_OPEN", true)
        bar.setSkinByName("normal")
        sceneGroup.add(bar)
        
        var chocoCow = game.add.spine(game.world.centerX - 250, bar.y - 165, "cow")
        chocoCow.scale.setTo(-1, 1)
        chocoCow.setAnimationByName(0, "IDLE", true)
        chocoCow.setSkinByName("normal")
        sceneGroup.add(chocoCow)
        
        var strawCow = game.add.spine(game.world.centerX + 10, bar.y - 180, "cow")
        //strawCow.scale.setTo(0.9, 0.9)
        strawCow.setAnimationByName(0, "IDLE", true)
        strawCow.setSkinByName("normal1")
        sceneGroup.add(strawCow)
        
        var vanillaCow = game.add.spine(game.world.centerX + 245, bar.y - 180, "cow")
        vanillaCow.scale.setTo(0.9, 0.9)
        vanillaCow.setAnimationByName(0, "IDLE", true)
        vanillaCow.setSkinByName("normal2")
        sceneGroup.add(vanillaCow)
        
        var lampL = game.add.sprite(game.world.centerX - 130, game.world.centerY - 80, 'lamp')
        lampL.anchor.setTo(0.5, 0.5)
        lampL.animations.add('lamp', null, 24, true)
        lampL.play('lamp')
        sceneGroup.add(lampL)
        
        var lampR = game.add.sprite(game.world.centerX + 120, game.world.centerY - 80, 'lamp')
        lampR.anchor.setTo(0.5, 0.5)
        lampR.scale.setTo(-1, 1)
        lampR.animations.add('lamp', null, 24, true)
        lampR.play('lamp')
        sceneGroup.add(lampR)
	}
	
	function update(){

	}
	
	function createTextPart(text,obj){
        
        var pointsText = lookParticle('text')
        
        if(pointsText){
            
            pointsText.x = obj.world.x
            pointsText.y = obj.world.y - 60
            pointsText.setText(text)
            pointsText.scale.setTo(1,1)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
			//console.log(particle.tag + ' tag,' + particle.used)
            if(!particle.used && particle.tag == key){
                
				particle.used = true
                particle.alpha = 1
                
                particlesGroup.remove(particle)
                particlesUsed.add(particle)
				                
                return particle
                break
            }
        }
        
    }
    
    function deactivateParticle(obj,delay){
        
        game.time.events.add(delay,function(){
            
            obj.used = false
            
            particlesUsed.remove(obj)
            particlesGroup.add(obj)
            
        },this)
    }
    
    function createPart(key){
        var particle = game.add.emitter(0, 0, 100);

        particle.makeParticles('atlas.milky',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.6;
        particle.maxParticleScale = 1;
        particle.gravity = 150;
        particle.angularDrag = 30;

        return particle
    }
    
    function createParticles(tag,number){
                
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'text'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                var particle = game.add.emitter(0, 0, 100);

				particle.makeParticles('atlas.milky',tag);
				particle.minParticleSpeed.setTo(-200, -50);
				particle.maxParticleSpeed.setTo(200, -100);
				particle.minParticleScale = 0.6;
				particle.maxParticleScale = 1.5;
				particle.gravity = 150;
				particle.angularDrag = 30;
				
				particlesGroup.add(particle)
				
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            //particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
        }
        
        
    }
	
	function addParticles(){
		
		particlesGroup = game.add.group()
		sceneGroup.add(particlesGroup)
		
		particlesUsed = game.add.group()
		sceneGroup.add(particlesUsed)
		
		createParticles('star',3)
		createParticles('wrong',1)
		createParticles('text',5)
		createParticles('smoke',1)

	}

	function setExplosion(obj){
        
        var posX = obj.x
        var posY = obj.y
        
        if(obj.world){
            posX = obj.world.x
            posY = obj.world.y
        }
        
		var rect = new Phaser.Graphics(game)
        rect.beginFill(0xffffff)
        rect.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        rect.alpha = 0
        rect.endFill()
		sceneGroup.add(rect)
		
		game.add.tween(rect).from({alpha:1},500,"Linear",true)
		
        var exp = sceneGroup.create(0,0,'atlas.milky','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.milky','smoke');
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = posX;
        particlesGood.y = posY;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function initMagician(){
        
        magician = game.add.group()
        magician.x = game.world.centerX + 50
        magician.y = game.world.centerY + 100
        magician.scale.setTo(0.76, 0.76)
        sceneGroup.add(magician)
        
        var magicianSpine = game.add.spine(0, 0, "magician")
        //magicianSpine.scale.setTo(0.8, 0.8)
        magicianSpine.setAnimationByName(0, "IDLE", true)
        magicianSpine.setSkinByName("normal")
        magician.add(magicianSpine)
        
        var barra = sceneGroup.create(0, 0, 'atlas.milky', 'barra')
        barra.scale.setTo(1.2, 1)
        barra.anchor.setTo(0.5, 0.5)
        barra.x = game.world.centerX - 3
        barra.y = game.world.centerY - 140
    }
    
    function initMug(){
        
        mugsGroup = game.add.group()
        mugsGroup.x = game.world.centerX 
        mugsGroup.y = game.world.centerY + 100
        mugsGroup.scale.setTo(0, 0)
        sceneGroup.add(mugsGroup)
        
        var chocoMug = mugsGroup.create(0, 0, 'atlas.milky', 'chocoMug') // 0
        chocoMug.anchor.setTo(0.5, 0.5)
        chocoMug.alpha = 0
        
        var strawMug = mugsGroup.create(0, 0, 'atlas.milky', 'strawMug') // 1
        strawMug.anchor.setTo(0.5, 0.5)
        strawMug.alpha = 0
        
        var vanillaMug = mugsGroup.create(0, 0, 'atlas.milky', 'vanillaMug') // 2
        vanillaMug.anchor.setTo(0.5, 0.5)
        vanillaMug.alpha = 0
        
        var mug = mugsGroup.create(0, 0, 'atlas.milky', 'emptyMug') // 3
        mug.anchor.setTo(0.5, 0.5)
        
        var swift = mugsGroup.create(-mug.width, 0, 'atlas.milky', 'swift') // 4
        swift.anchor.setTo(0.5, 0.5)
        swift.alpha = 0
    }
	
    function btnBoard(){
        
        var board = sceneGroup.create(0,0,'atlas.milky','board')
        board.scale.setTo(1, 1)
        board.anchor.setTo(0.5, 0.5)
        board.x = game.world.centerX
        board.y = game.world.height - board.height * 0.5  
        
        buttonsGroup = game.add.group()
        buttonsGroup.x = board.x
        buttonsGroup.y = board.y
        sceneGroup.add(buttonsGroup)  
        
        for(var t = 0; t < 4; t++)
        {
            var button = buttonsGroup.create(0, 0, 'atlas.milky', btn[t])
            button.anchor.setTo(0.5, 0.5)
            //button.scale.setTo(0.9, 0.9)
            button.inputEnabled = false
            button.tint = 0xaaaaaa
            button.events.onInputDown.add(inputButton)
            button.flavor = t
            button.y = button.height * 0.5
            button.x = (- board.width * 0.33) + (t * button.width * 1.22)
        }
        
        var serviceBar = sceneGroup.create(0,0,'atlas.milky', 'bar')
        serviceBar.scale.setTo(1.3, 1.15)
        serviceBar.anchor.setTo(0.5, 0.5)
        serviceBar.x = game.world.centerX + 42
        serviceBar.y = game.world.centerY + 180
    }
    
    function inputButton(btn){
        
        game.add.tween(btn.scale).to({x:0.5, y:0.5}, 100, Phaser.Easing.linear, true).onComplete.add(function() 
        {
            game.add.tween(btn.scale).to({x: 1, y: 1}, 200, Phaser.Easing.linear, true)
        })
        
        if(btn.flavor === 3){
            openDoors()
            if(!level){
                if(doorsOpen)
                    handPos(order)
                else
                    handPos(3)
            }
        }
        else{
            sound.play("pop")
            buttonsGroup.setAll('inputEnabled', false)
            buttonsGroup.setAll('tint', '0xaaaaaa')
            shakeMilk(btn)
            
            if(level && tweenTiempo != null)
                tweenTiempo.pause()
        }
    }
    
    function shakeMilk(btn){
        
        var walkTime
        var destinyX, destinyY
        
        switch(btn.flavor){
            case flavors.choco: 
                destinyX = game.world.centerX - 235
                walkTime = 1000
            break
            case flavors.straw: 
                destinyX = game.world.centerX - 10
                walkTime = 200
            break
            case flavors.vanilla: 
                destinyX = game.world.centerX + 220
                walkTime = 700
            break
        }
        
        if(doorsOpen)
            destinyY = bar.y - 80
        else
            destinyY = bar.y + 115
        
        mugsGroup.scale.setTo(0)
        moveMagician(destinyX, destinyY, walkTime, btn.flavor)
    }
    
    function openDoors(){
        
        if(!doorsOpen){
            doorsOpen = true
            sound.play("lock")
            bar.setAnimationByName(0, 'DOORS_OPEN', false)
        }
        else{
            doorsOpen = false
            sound.play("cog")
            bar.setAnimationByName(0, 'DOORS_CLOSED', false)
        }
    }
    
    function moveMagician(x, y, wt, ans){
        
        if(x < game.world.centerX){
            magician.children[0].scale.setTo(-1, 1)
            magician.children[0].setAnimationByName(0, "SIDE_WALK", false)
        }
        else{
            magician.children[0].scale.setTo(1, 1)
            magician.children[0].setAnimationByName(0, "SIDE_WALK", false)
        }
        
        if(y < bar.y){
            var delay = 900
        }
        else{
            var delay = 250
        }
        
        
        game.add.tween(magician).to({x:x}, wt, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
        
            magician.children[0].setAnimationByName(0, "BACK_WALK", false)
            game.add.tween(magician).to({y:y}, delay, Phaser.Easing.Linear.Out, true).onComplete.add(function(){
                
                var hit = game.add.tween(magician).to({y:y}, 600, Phaser.Easing.Linear.Out, true)
                
                if(y < bar.y){
                    sound.play("squeeze")
                    changeImage(ans, mugsGroup)
                    magician.children[0].setAnimationByName(0, "BACK_IDLE", false)
                }
                else{
                    sound.play("cog")
                    magician.children[0].setAnimationByName(0, "BACK_WRONG", false)
                }
                
                hit.onComplete.add(function(){
                    magician.children[0].setAnimationByName(0, "FRONT_WALK", false)
                    game.add.tween(magician).to({y: game.world.centerY + 100}, 700, Phaser.Easing.Linear.Out, true).onComplete.add(function(){

                        if(x < game.world.centerX){
                            magician.children[0].scale.setTo(1, 1)
                            magician.children[0].setAnimationByName(0, "SIDE_WALK", false)
                        }
                        else{
                            magician.children[0].scale.setTo(-1, 1)
                            magician.children[0].setAnimationByName(0, "SIDE_WALK", false)
                        }

                        game.add.tween(magician).to({x: game.world.centerX + 50}, wt, Phaser.Easing.Linear.Out, true).onComplete.add(function(){

                            magician.children[0].addAnimationByName(0, "IDLE", true)
                            serveMilk(ans)
                        })
                    })
                })
            })
        })
    }
    
    function initOrders(){
        
        ordersGroup = game.add.group()
        ordersGroup.x = bar.centerX + bar.width * 0.3
        ordersGroup.y = game.world.centerY * 1.6
        ordersGroup.scale.setTo(0, 0)
        sceneGroup.add(ordersGroup)
        
        var dialogue = ordersGroup.create(-20, 0, 'atlas.milky', 'dialogue')
        dialogue.scale.setTo(0.9, 0.9)
        dialogue.anchor.setTo(0.5, 0.5)
        
        ordersGroup.tween = game.add.tween(ordersGroup.scale).to({x:1.1 , y:1.1}, 700, Phaser.Easing.linear, false)

        ordersGroup.tween.onComplete.add(function() 
        {
            game.add.tween(ordersGroup.scale).to({x:1 , y:1}, 700, Phaser.Easing.linear, true).onComplete.add(function(){
            ordersGroup.tween.start()
            })
        })
    }
    
    function selectFalvor(){
        
        var flavor
        
        switch(order)
        {
            case flavors.choco: 
                flavor = ordersGroup.create(0, 0, 'atlas.milky', 'choco')
                ordersGroup.flavor = flavors.choco
            break
            case flavors.straw: 
                flavor = ordersGroup.create(0, 0, 'atlas.milky', 'straw')
                ordersGroup.flavor = flavors.straw
            break
            case flavors.vanilla: 
                flavor = ordersGroup.create(0, 0, 'atlas.milky', 'vanilla')
                ordersGroup.flavor = flavors.vanilla
            break
        }
        
        flavor.anchor.setTo(0.5, 0.5)
        flavor.x = -30
    }
    
    function initGame(){
         
        buttonsGroup.setAll('inputEnabled', true)
        buttonsGroup.setAll('tint', '0xffffff')
        
        mugsGroup.x = game.world.centerX 
        mugsGroup.y = game.world.centerY + 100
        changeImage(3, mugsGroup)
        
        if(!level){
            handPos(3)
            changeImage(0, handsGroup)
        }
        else if(handsGroup != null)
            handsGroup.destroy()
        
        game.add.tween(mugsGroup.scale).to({x:1.3 , y:1.3}, 200, Phaser.Easing.linear, true).onComplete.add(function() 
        {
            game.add.tween(mugsGroup.scale).to({x:1 , y:1}, 200, Phaser.Easing.linear, true)
        }, this)
        
        sound.play("cut")
        game.add.tween(ordersGroup.scale).to({x:1, y:1}, 300, Phaser.Easing.linear, true).onComplete.add(function(){
            
            if(tweenStarted)
                ordersGroup.tween.resume()
            else{
                ordersGroup.tween.start()
                tweenStarted = true
            }
            
            if(lives > 0 && level){
                game.time.events.add(300,function(){
                    startTimer(delay)
                },this)
            }
        })
        
        order = getRand()
        selectFalvor()
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === order)
            return getRand()
        else
            return x     
    }
    
    function positionTimer(){
        
        var timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        clock.alpha = 1
        timerGroup.add(clock)
        
        timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timeBar.alpha = 1
        timerGroup.add(timeBar)
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.2
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            
            serveMilk(-1)
        })
    }
    
    function serveMilk(ans){
        
        mugsGroup.scale.setTo(1)
        mugsGroup.children[4].alpha = 1
        sound.play("throw")
        game.add.tween(mugsGroup).to({x:bar.x + 350}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
            mugsGroup.scale.setTo(0)
            
            if(level){
                stopTimer()
            }

            if(ans === order && doorsOpen){
                particleCorrect.x = mugsGroup.x -20
                particleCorrect.y = mugsGroup.y
                particleCorrect.start(true, 1200, null, 6)
                addPoint(1)
                delay -= 100
                level = true
            }
            else{
                particleWrong.x = mugsGroup.x - 20
                particleWrong.y = mugsGroup.y
                particleWrong.start(true, 1200, null, 6)
                missPoint()
            }
            
            game.add.tween(ordersGroup.scale).to({x:0, y:0}, 250, Phaser.Easing.linear, true).onComplete.add(function(){
                ordersGroup.removeChildAt(1) 
                
                initGame()
            })

            if(doorsOpen)
                openDoors()

            ordersGroup.tween.pause()
            
        })
    }
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function initHand(){
        
        handsGroup = game.add.group()
        handsGroup.x = buttonsGroup.x + 160
        handsGroup.y = buttonsGroup.y + 60
        handsGroup.scale.setTo(0.8)
        sceneGroup.add(handsGroup)
        
        var handUp = handsGroup.create(0, 0, 'atlas.milky', 'handUp') // 0
        handUp.anchor.setTo(0.5, 0.5)
        handUp.alpha = 0
        
        var handDown = handsGroup.create(0, 0, 'atlas.milky', 'handDown') // 1
        handDown.anchor.setTo(0.5, 0.5)
        handDown.alpha = 0
        
       
        
        handsGroup.tween = game.add.tween(handsGroup).to({y:handsGroup.y + 10}, 400, Phaser.Easing.linear, true)
            
        handsGroup.tween.onComplete.add(function() 
        {
            changeImage(0, handsGroup)
            game.add.tween(handsGroup).to({y:handsGroup.y - 10}, 400, Phaser.Easing.linear, true).onComplete.add(function(){
                handsGroup.tween.start()
                changeImage(1, handsGroup)
            })
        })
    }
    
    function handPos(ans){
        
        buttonsGroup.setAll('inputEnabled', false)
        buttonsGroup.setAll('tint', '0xaaaaaa')
        
        switch(ans){
            case 0:
                handsGroup.x -= 230
                buttonsGroup.children[0].inputEnabled = true
                buttonsGroup.children[0].tint = 0xffffff
            break
            case 1:
                handsGroup.x -= 150
                buttonsGroup.children[1].inputEnabled = true
                buttonsGroup.children[1].tint = 0xffffff
            break
            case 2:
                handsGroup.x -= 70
                buttonsGroup.children[2].inputEnabled = true
                buttonsGroup.children[2].tint = 0xffffff
            break
            case 3:
                handsGroup.x = buttonsGroup.x + 160
                buttonsGroup.children[3].inputEnabled = true
                buttonsGroup.children[3].tint = 0xffffff
            break
        }
    }
    
	return {
		
		assets: assets,
		name: "milky",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            cowSong = game.add.audio('cowSong')
            game.sound.setDecodedCallback(cowSong, function(){
                cowSong.loopFull(0.6)
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            positionTimer()
            initMagician()
            btnBoard()
            initHand()
            initOrders()
            initMug()
            createParticles()
			
			buttons.getButton(cowSong,sceneGroup)
            createTutorial()
            //createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()