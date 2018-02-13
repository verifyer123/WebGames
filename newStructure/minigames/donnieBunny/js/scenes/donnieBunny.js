
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var donnieBunny = function(){
    
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
                name: "atlas.donnieBunny",
                json: "images/donnieBunny/atlas.json",
                image: "images/donnieBunny/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/donnieBunny/timeAtlas.json",
                image: "images/donnieBunny/timeAtlas.png",
            },
             {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }

        ],
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 131
    var overlayGroup
    var donnieSong
    var coin
    var timerGroup
    var donnie
    var appleGroup
    var rnd
    var shuffle = [0,1,2]
    var answer
    var time
    var timeAttack
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rnd = -1
        time = 4000
        timeAttack = false
        
        if(localization.getLanguage() === 'EN'){
            namesTxt = [
            {0:'orejas', 1: 'oregas', 2: 'horejas'},
            {0:'ojos', 1: 'ohos', 2: 'ojosh'},
            {0:'boca', 1: 'boka', 2: 'voca'},
            {0:'nariz', 1: 'naris', 2: 'narriz'},
            ]
        }
        else{
            namesTxt = [
            {0:'ears', 1: 'hears', 2: 'eairs'},
            {0:'eyes', 1: 'ayes', 2: 'aies'},
            {0:'mouth', 1: 'mount', 2: 'mauth'},
            {0:'nose', 1: 'nouse', 2: 'nous'},
            ]
        }
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0},250,Phaser.Easing.linear,true)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.donnieBunny','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.donnieBunny','life_box')

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
        donnieSong.stop()
        		
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1300)
		tweenScene.onComplete.add(function(){
			var resultScreen = sceneloader.getScene("result")
			resultScreen.setScore(true, pointsBar.number,gameIndex)

			//amazing.saveScore(pointsBar.number) 			
            sceneloader.show("result")
		})
    }
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('donnieSong', soundsPath + 'songs/marioSong.mp3');
        
		/*game.load.image('howTo',"images/donnieBunny/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/donnieBunny/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/donnieBunny/introscreen.png")*/

        game.load.image('tutorial_image',"images/donnieBunny/tutorial_image.png")
        //loadType(gameIndex)

        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
        game.load.image('background',"images/donnieBunny/background.png")
        
        game.load.spine("donnie", "images/spines/bunny.json")
		
		console.log(localization.getLanguage() + ' language')
        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)

        createTutorialGif(overlayGroup,onClickPlay)

    }
    
    function onClickPlay(){
        overlayGroup.y = -game.world.height
        initGame()
    }

    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var background = sceneGroup.create(game.world.centerX, game.world.centerY, 'background')
        background.anchor.setTo(0.5)
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
        particle.makeParticles('atlas.donnieBunny',key);
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

				particle.makeParticles('atlas.donnieBunny',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.donnieBunny','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.donnieBunny','smoke');
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
        
        particleWrong = createPart('wrong')
        sceneGroup.add(particleWrong)
    }
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
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
        timerGroup.y = clock.height * 0.4
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            stopTimer()
            win(false)
        })
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.8)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
        timer = 300

        game.add.tween(coin).to({alpha:1}, timer, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, timer + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function theBirthOfDonnieBonnie(){
        
        donnie = game.add.spine(game.world.centerX, game.world.height - 50, "donnie")
        //donnie.scale.setTo(0.8)
        donnie.setAnimationByName(0, "IDLE", true)
        donnie.setSkinByName("normal")
        sceneGroup.add(donnie)
    }
    
    function moveDatPart(opt){
        
        switch(opt){
            case 0:
                donnie.setAnimationByName(0, "EARS", true)
            break
            case 1:
                donnie.setAnimationByName(0, "EYES", true)
            break
            case 2:
                donnie.setAnimationByName(0, "MOUTH", true)
            break
            case 3:
                donnie.setAnimationByName(0, "NOSE", true)
            break
            case 4:
                donnie.setAnimationByName(0, "IDLE", true)
            break
            case 5:
                donnie.setAnimationByName(0, "WIN", true)
            break
            case 6:
                donnie.setAnimationByName(0, "HIT", true)
            break
            case 7:
                donnie.setAnimationByName(0, "LOSE", false)
                donnie.addAnimationByName(0, "LOSESTILL", true)
            break
        }
    }
    
    function threeAppleTree(){
        
        var fontStyle = {font: "36px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        appleGroup = game.add.group()
        sceneGroup.add(appleGroup)
        
        var pos = -1
        
        for(var a = 0; a < 3; a++){
            
            var appleName = game.add.group()
            appleName.x = game.world.centerX + (170 * pos)
            appleName.y = game.world.centerY * 0.5
            appleGroup.add(appleName)
            
            var apple = appleName.create(0, 0, 'atlas.donnieBunny', 'apple')
            apple.anchor.setTo(0.5)
            apple.inputEnabled = true
            apple.events.onInputDown.add(select ,this)
            apple.text = ''
            pos++
            
            var name = new Phaser.Text(sceneGroup.game, apple.x, apple.y + 15, '0', fontStyle)
            name.anchor.setTo(0.5)
            name.setText('')
            appleName.add(name) 
            appleName.text = name
        }
    }
    
    function select(btn){
        
        if(gameActive){
            gameActive = false
            
            game.add.tween(btn.parent.scale).to({x:0.5, y:0.5}, 150, Phaser.Easing.linear, true).onComplete.add(function() 
            {
                sound.play('cut')
                game.add.tween(btn.parent.scale).to({x: 1, y: 1}, 150, Phaser.Easing.linear, true).onComplete.add(function(){
                    gameActive = true
                    if(btn.parent.text.text === answer){
                        win(true)
                        addCoin(btn.parent)
                        particleCorrect.x = btn.parent.x
                        particleCorrect.y = btn.parent.y
                        particleCorrect.start(true, 1200, null, 10)
                    }
                    else{
                        win(false)
                    }
                })
            })
        }
    }
    
    function win(ans){
        
        gameActive = false
        if(timeAttack)
            stopTimer()
        
        if(ans){
            moveDatPart(5)
            sound.play('rightChoice')
        }
        else{
            missPoint()
            if(lives !== 0){
                moveDatPart(6)
            }
            else{
                moveDatPart(7)
            }
        }
        
        if(pointsBar.number === 5){
            game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
            timeAttack = true
        }
        else if(pointsBar.number > 25 && time > 800)
            time -= 400
        
        game.time.events.add(1500,function(){
            for(var n = 0; n < 3; n++){
                appleGroup.children[n].text.setText('')
            }
            if(lives !== 0){
                moveDatPart(4)
                initGame()
            }
         },this)
    }
    
    function initGame(){
        
        rnd = getRand()
        answer = namesTxt[rnd][0]
        
        game.time.events.add(1000,function(){
            gameActive = true
            sayMyName()
            moveDatPart(rnd)
            if(timeAttack){
                startTimer(time)
            }
         },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === rnd)
            return getRand()
        else
            return x     
    }
    
    function sayMyName(){
        
        Phaser.ArrayUtils.shuffle(shuffle)
        
        for(var n = 0; n < 3; n++){
            appleGroup.children[n].text.setText(namesTxt[rnd][shuffle[n]])
            game.add.tween(appleGroup.children[n].text.scale).from({x: 2, y: 2}, 150, Phaser.Easing.linear, true)
        }
    }
	
	return {
		
		assets: assets,
		name: "donnieBunny",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            donnieSong = game.add.audio('donnieSong')
            game.sound.setDecodedCallback(donnieSong, function(){
                donnieSong.loopFull(0.6)
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
            theBirthOfDonnieBonnie()
            threeAppleTree()
            initCoin()
            createParticles()
			
			buttons.getButton(donnieSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()