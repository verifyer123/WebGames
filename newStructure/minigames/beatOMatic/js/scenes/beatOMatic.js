
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var beatOMatic = function(){
    
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
    

	var assets = {
        atlases: [
            {   
                name: "atlas.beatOMatic",
                json: "images/beatOMatic/atlas.json",
                image: "images/beatOMatic/atlas.png",
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
				file:"images/beatOMatic/gametuto.png",
            },
            {   name:'cloud0',
				file:"images/beatOMatic/cloud0.png",
            },
            {   name:'cloud1',
				file:"images/beatOMatic/cloud1.png",
            },
            {   name:'light',
				file:"images/beatOMatic/light.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "cheers",
				file: soundsPath + "cheers.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'beatSong',
                file: soundsPath + 'songs/retrowave.mp3'},
            {	name: "sound0",
				file: "localSounds/sound0.wav"},
            {	name: "sound1",
				file: "localSounds/sound1.wav"},
            {	name: "sound2",
				file: "localSounds/sound2.wav"},
            {	name: "sound3",
				file: "localSounds/sound3.wav"},
            {	name: "sound4",
				file: "localSounds/sound4.wav"},
            {	name: "sound5",
				file: "localSounds/sound5.mp3"},
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            }
        ],
        spines:[
			{
				name:"beat",
				file:"images/spines/beat/beat.json",
            },
            {
                name:"yogos",
				file:"images/spines/yogos/yogos.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 144
    var tutoGroup
    var beatSong
    var coin
    var raz, daz
    var meter, pump
    var speakersGroup
    var speakersAnimGroup
    var speakercolors = ['ligthblue', 'green', 'red', 'blue', 'yellow', 'purple']
    var rnd
    var lvl
    var pivot
    var secuence
    var speakerNumber
    var publicTweens
    var handsGroup
    var pasTutorial = false
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rnd = -1
        lvl = 6
        pivot = 0
        speakerNumber = 6
        secuence = []
        publicTweens = []
        
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
        
        /*if(lives == 0){
            stopGame(false)
        }*/
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.beatOMatic','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.beatOMatic','life_box')

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
        
		//sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        beatSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		//buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false
        
        //loadType(gameIndex)
    }
    
    function createTutorial(){
        
        tutoGroup = game.add.group()
        sceneGroup.add(tutoGroup)

        tutorialHelper.createTutorialGif(tutoGroup,onClickPlay)
    }
    
    function onClickPlay() {
        tutoGroup.y = -game.world.height
        //initGame()
        initTutorial()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.beatOMatic', "background"))
        sceneGroup.create(game.world.centerX, game.world.centerY - 200, 'atlas.beatOMatic', "top").anchor.setTo(0.5)
        
        var cloud = sceneGroup.create(game.world.centerX - 30, 0, "cloud1")
        cloud.anchor.setTo(0.5, 0)
        game.add.tween(cloud).to({x:cloud.x + 30}, 2000, Phaser.Easing.linear, true, 0, -1).yoyo(true,0)
        game.add.tween(cloud).to({y:cloud.y + 30}, 3000, Phaser.Easing.linear, true, 0, -1).yoyo(true,0)
        
        var light = sceneGroup.create(game.world.width, 0, "light")
        light.anchor.setTo(1, 0)
        light.angle = 45
        game.add.tween(light).to({angle:-45}, 1000, Phaser.Easing.linear, true, 0, -1).yoyo(true,0)
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
        particle.makeParticles('atlas.beatOMatic',key);
        particle.minParticleSpeed.setTo(-200, -50);
        particle.maxParticleSpeed.setTo(200, -100);
        particle.minParticleScale = 0.3;
        particle.maxParticleScale = .8;
        particle.gravity = 150;
        particle.angularDrag = 30;
        particle.setAlpha(1, 0, 2000, Phaser.Easing.Cubic.In)
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

				particle.makeParticles('atlas.beatOMatic',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.beatOMatic','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.beatOMatic','smoke');
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
    
    function createParticles(){
        particleCorrect = createPart('star')
        sceneGroup.add(particleCorrect)
        
        particleWrong = createPart('smoke')
        sceneGroup.add(particleWrong)
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       //coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                    addPoint(1)
                    if(pointsBar.number !== 0 && pointsBar.number % 4 === 0){
                        lvl++
                    }
                    if(speakerNumber < 5 && pointsBar.number !== 0 && pointsBar.number % 2 === 0){
                        speakerNumber += 2
                    }
                })
            })
        })
    }
    
    function scenario(){
        
        raz = game.add.spine(game.world.centerX - 130, game.world.centerY + 230, "yogos")
        raz.setAnimationByName(0, "idle_dazzle", true)
        raz.setSkinByName("dazzle")
        raz.scale.setTo(-1, 1)
        sceneGroup.add(raz)
        
        daz = game.add.spine(game.world.centerX + 130, game.world.centerY + 230, "yogos")
        daz.setAnimationByName(0, "idle_razzle", true)
        daz.setSkinByName("razzle")
        sceneGroup.add(daz)
        
        for(var c = 0; c < 2; c++){
            
            var console = sceneGroup.create(game.world.centerX, game.world.centerY + 140, 'atlas.beatOMatic', 'console' + c)
            console.anchor.setTo(c, 0)
            
            var shadow = sceneGroup.create(game.world.centerX, game.world.centerY + 140, 'atlas.beatOMatic', 'light' + c)
            shadow.anchor.setTo(c, 0.1)
        }
        
        sceneGroup.create(game.world.centerX, game.world.height + 50, "cloud0").anchor.setTo(0.5, 1)
        var smoke = sceneGroup.create(game.world.centerX, game.world.centerY + 70, "cloud0").anchor.setTo(0.5)
        game.add.tween(smoke).to({y: 0}, 4000, Phaser.Easing.linear, true, 0, -1).yoyo(true,0)
        
        var aux = - 1
        
        for(var c = 0; c < 3; c++){
            
            var public = sceneGroup.create(game.world.centerX + (230 * aux), game.world.height + 40, 'atlas.beatOMatic', 'public' + c)
            public.anchor.setTo(0.5, 1)
            aux++
            publicTweens[c] = game.add.tween(public).to({y:public.y + 30}, game.rnd.integerInRange(300, 400), Phaser.Easing.linear, true, 0, -1).yoyo(true,0)
        }
    }
    
    function clapMeter(){
        
        sceneGroup.create(game.world.centerX, game.world.height - 120, 'atlas.beatOMatic', 'bar').anchor.setTo(0.5)
        
        meter = sceneGroup.create(game.world.centerX, game.world.height - 120, 'atlas.beatOMatic', 'meter')
        meter.anchor.setTo(0 ,0.5)
        meter.x -= meter.width * 0.35
        meter.scale.setTo(0, 1)
        
    }
    
    function theSonidero(){
        
        speakersGroup = game.add.group()
        speakersGroup.alpha = 0
        sceneGroup.add(speakersGroup)
        
        speakersAnimGroup = game.add.group()
        sceneGroup.add(speakersAnimGroup)
        
        var space = 0
        var pivotS = 2
        
        for(var s = 0; s < 6; s++){
            
            if(s === pivotS){
                pivotS += 2
                space ++
            }
            
            var speakerAnim = game.add.spine(100, 150, "beat")
            speakerAnim.setAnimationByName(0, "IDLE", true)
            speakerAnim.setSkinByName(speakercolors[s])
            speakersAnimGroup.add(speakerAnim)
            
            var speaker = speakersGroup.create(-7, 70 + (150 * space), 'atlas.beatOMatic', 'speaker' + s)
            speaker.inputEnabled = true
            speaker.events.onInputDown.add(click ,this)
            speaker.number = s
            speaker.active = false
            
            if(s % 2 === 0){
                speaker.anchor.setTo(0, 0)
                speakerAnim.y += 155 * space
            }
            else{
                speaker.anchor.setTo(1, 0)
                speaker.x = game.world.width + 20
                speakerAnim.x = game.world.width - 100
                speakerAnim.y += 148 * space
            }
        }
        
        speakerAnim.y += 20
    }
    
    function click(obj){
        
        if(!pasTutorial){
            checkTutorial(obj)
        }
        else{
            beatIt(obj)
        }
    }
    
    function beatIt(obj){
        
        if(gameActive && pivot < lvl && obj.active){

            if(secuence[pivot] === obj.number){
                
                raz.setAnimationByName(0, "good", true)
                daz.setAnimationByName(0, "good", true)
                
                sound.play('sound' + obj.number)
                game.time.events.add(1000,function(){
                    sound.stop('sound' + obj.number)
                },this)
               
                speakersAnimGroup.children[obj.number].setAnimationByName(0, "HIT", true)
                speakersAnimGroup.children[obj.number].addAnimationByName(0, "IDLE", true)
                particleCorrect.x = speakersAnimGroup.children[obj.number].x 
                particleCorrect.y = speakersAnimGroup.children[obj.number].y 
                particleCorrect.start(true, 1000, null, 8)  
                pumItUp()
                pivot++
                
                if(pivot === lvl)
                    youRock(true)
            }
            else{
                raz.setAnimationByName(0, "wrong", true)
                raz.addAnimationByName(0, "lose", true)
                daz.setAnimationByName(0, "wrong", true)
                daz.addAnimationByName(0, "lose", true)
                particleWrong.x = speakersAnimGroup.children[obj.number].x 
                particleWrong.y = speakersAnimGroup.children[obj.number].y 
                particleWrong.start(true, 1000, null, 8)  
                youRock(false)
            }
        }
    }
    
    function pumItUp(){
        
        pump += 1/lvl
        game.add.tween(meter.scale).to({x:pump}, 300, Phaser.Easing.linear, true)
       
    }
    
    function youRock(ans){
        
        gameActive = false
        
        if(ans){
            
            playAll('HIT', true)
            beatSong.volume = 0
            game.time.events.add(200,function(){
                beatSong.volume = 0.6
                sound.play('cheers')
            },this)
            addCoin()
        }
        else{
            missPoint()
            beatSong.volume = 0
        }
        game.time.events.add(2500,function(){
            if(lives !== 0){
                initGame()
            }
            else{
                playAll('IDLE', false)
                beatSong.stop()
                for(var p = 0; p < publicTweens.length; p++){
                    publicTweens[p].stop()
                }
                game.time.events.add(1000,function(){
                    stopGame(false)
                },this)
            }
        },this)
    }
    
    function playAll(anim, loop){
        
        for(var n = 0; n < speakersAnimGroup.length; n++){
            speakersAnimGroup.children[n].setAnimationByName(0, anim, loop)
        }
    }
    
    function initGame(){
        
        pivot = 0
        pump = 0
        showMustGoOn()
        
        playAll('IDLE', true)
        raz.setAnimationByName(0, "idle_dazzle", true)
        daz.setAnimationByName(0, "idle_razzle", true)
        game.add.tween(meter.scale).to({x:pump}, 300, Phaser.Easing.linear, true)

        game.time.events.add(500,function(){
            var time = cue()
            game.time.events.add(time,function(){
                gameActive = true
            },this)
        },this)
    }
	
    function showMustGoOn(){
        
        for(var s = 0; s < speakerNumber; s++){
            speakersAnimGroup.children[s].alpha = 1
            speakersGroup.children[s].active = true
        }
        
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, speakerNumber-1)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
    
    function cue(){
        
        var delay = 500
        beatSong.volume = 0.1
        
        for(var i = 0; i < lvl; i++){
            
            rnd = getRand()
            secuence[i] = rnd
            beatBox(delay, rnd)
            delay += 1000
        }
        return delay
    }
    
    function beatBox(delay, num){
        
        game.time.events.add(delay,function(){
            sound.play('sound' + num)
            speakersAnimGroup.children[num].setAnimationByName(0, "HIT", true)
            particleCorrect.x = speakersAnimGroup.children[num].x 
            particleCorrect.y = speakersAnimGroup.children[num].y 
            particleCorrect.start(true, 1000, null, 8)  
            game.time.events.add(1000,function(){
                speakersAnimGroup.children[num].setAnimationByName(0, "IDLE", true)
                sound.stop('sound' + num)
            },this)
        },this)
    }
    
    function initTutorial(){
        
        pivot = 0
        pump = 0
        
        playAll('IDLE', true)
        raz.setAnimationByName(0, "idle_dazzle", true)
        daz.setAnimationByName(0, "idle_razzle", true)

        game.time.events.add(500,function(){
            var time = cue()
            game.time.events.add(time,function(){
                gameActive = true
                handsGroup.alpha = 1
                handPos()
            },this)
        },this)
    }
    
    function handPos(){
        
        handsGroup.setAll('x', speakersGroup.children[secuence[pivot]].centerX) 
        handsGroup.setAll('y', speakersGroup.children[secuence[pivot]].centerY) 
        
        speakersGroup.setAll('active', false)
        speakersGroup.children[secuence[pivot]].active = true
        
    }
    
    function checkTutorial(obj){
        
        if(gameActive && pivot < lvl && obj.active){
   
            raz.setAnimationByName(0, "good", true)
            daz.setAnimationByName(0, "good", true)

            sound.play('sound' + obj.number)
            game.time.events.add(1000,function(){
                sound.stop('sound' + obj.number)
            },this)
            
            speakersAnimGroup.children[obj.number].setAnimationByName(0, "HIT", true)
            speakersAnimGroup.children[obj.number].addAnimationByName(0, "IDLE", true)
            particleCorrect.x = speakersAnimGroup.children[obj.number].x 
            particleCorrect.y = speakersAnimGroup.children[obj.number].y 
            particleCorrect.start(true, 1000, null, 8)  
            pumItUp()
            pivot++

            if(pivot === lvl){
                endTutorial()
            }
            else{
                 handPos()
            }
                
        }
    }
    
    function endTutorial(){
        
        lvl = 3
        speakerNumber = 2
        pasTutorial = true
        handsGroup.destroy()
        
        playAll('HIT', true)
        beatSong.volume = 0
        game.time.events.add(200,function(){
            beatSong.volume = 0.6
            sound.play('cheers')
        },this)
        
        game.time.events.add(3000,function(){
            speakersAnimGroup.setAll('alpha', 0) 
            speakersGroup.setAll('active', false)
            showMustGoOn()
            initGame()
        },this)
    }
    
    function initHand(){
        
        handsGroup = game.add.group()
        handsGroup.alpha = 0
        handsGroup.scale.setTo(0.8)
        sceneGroup.add(handsGroup)
        
        var handUp = handsGroup.create(0, 0, 'atlas.beatOMatic', 'handUp') // 0
        handUp.alpha = 0
        
        var handDown = handsGroup.create(0, 0, 'atlas.beatOMatic', 'handDown') // 1
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
    
	return {
		
		assets: assets,
		name: "beatOMatic",
		//update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*beatSong = game.add.audio('beatSong')
            game.sound.setDecodedCallback(beatSong, function(){
                beatSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            beatSong = sound.play("beatSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            initCoin()
            theSonidero()
            scenario()
            clapMeter()
            initHand()
            createParticles()
			
			buttons.getButton(beatSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()