
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var tileARoid = function(){
    
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
                name: "atlas.tileARoid",
                json: "images/tileARoid/atlas.json",
                image: "images/tileARoid/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/tileARoid/timeAtlas.json",
                image: "images/tileARoid/timeAtlas.png",
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
				file:"images/tileARoid/gametuto.png"
			},
            {
				name:'pic0',
				file:"images/tileARoid/pic0.png"
			},
            {
				name:'pic1',
				file:"images/tileARoid/pic1.png"
			},
            {
				name:'pic2',
				file:"images/tileARoid/pic2.png"
			},
            {
				name:'pic3',
				file:"images/tileARoid/pic3.png"
			},
            {
				name:'frame',
				file:"images/tileARoid/frame.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "swipe",
				file: soundsPath + "swipe.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "snapshot",
				file: soundsPath + "snapshot.mp3"},
            {	name: "drag",
				file: soundsPath + "drag.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'tileSong',
                file: soundsPath + 'songs/marioSong.mp3'
            }
		],
        spritesheets: [
            {   name: "coin",
                file: "images/spines/coin.png",
                width: 122,
                height: 123,
                frames: 12
            },
            {   name: "hand",
                file: "images/spines/hand.png",
                width: 115,
                height: 111,
                frames: 23
            }
        ],
        spines:[
			{
				name:"anim0",
				file:"images/spines/frame1/frame1.json"
			},
            {
				name:"anim1",
				file:"images/spines/frame2/frame2.json"
			},
            {
				name:"anim2",
				file:"images/spines/frame3/frame3.json"
			},
            {
				name:"anim3",
				file:"images/spines/frame4/frame4.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 182
    var tutoGroup
    var tileSong
    var coin
    var hand
    var timerGroup
    var pictureGroup
    var animGroup
    var picsSelection
    var rand
    var level
    var timeAtack
    var gameTime
    var actionWords
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        picsSelection = []
        rand = -1
        level = 2
        timeAtack = false
        gameTime = 60000
        
        loadSounds()
	}
    
    function animateScene() {
                
        gameActive = false
                
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.tileARoid','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.tileARoid','life_box')

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
        tileSong.stop()
        		
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
        initGame()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.tileARoid", "background"))
        
        var camera = sceneGroup.create(game.world.centerX, game.world.centerY - 150, "atlas.tileARoid", "camera")
        //camera.width = game.world.width
        camera.anchor.setTo(0.5, 1)
        camera.scale.setTo(1.1, 1)
        
        var frame = sceneGroup.create(camera.x, camera.y - 75, "frame")
        frame.anchor.setTo(0.5, 0)
        frame.scale.setTo(1.05, 1)
        sceneGroup.frame = frame
        
        var shadow = sceneGroup.create(frame.x, frame.y, "atlas.tileARoid", "shadow")
        shadow.anchor.setTo(0.5, 0)
        shadow.scale.setTo(1.05, 1)
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
        particle.makeParticles('atlas.tileARoid',key);
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

				particle.makeParticles('atlas.tileARoid',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.tileARoid','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.tileARoid','smoke');
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
    
    function positionTimer(){
        
        timerGroup = game.add.group()
        timerGroup.scale.setTo(1.5)
        timerGroup.alpha = 0
        sceneGroup.add(timerGroup)
        
        var clock = game.add.image(0, 0, "atlas.time", "clock")
        clock.scale.setTo(0.7)
        timerGroup.add(clock)
        
        var timeBar = game.add.image(clock.position.x + 40, clock.position.y + 40, "atlas.time", "bar")
        timeBar.scale.setTo(8, 0.45)
        timerGroup.add(timeBar)
        timerGroup.timeBar = timeBar
        
        timerGroup.x = game.world.centerX - clock.width * 0.75
        timerGroup.y = clock.height * 0.3
   }
    
    function stopTimer(){
        
        timerGroup.tweenTiempo.stop()
        game.add.tween(timerGroup.timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        timerGroup.tweenTiempo = game.add.tween(timerGroup.timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        timerGroup.tweenTiempo.onComplete.add(function(){
            gameActive = false
            win(false)
        })
    }
	
	function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var time = 300

        sound.play("rightChoice")
        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createAnimations(){
        
        animGroup = game.add.group()
        sceneGroup.add(animGroup)
        
        for(var i = 0; i < 4; i++){
            
            var anim = game.add.spine(sceneGroup.frame.centerX, sceneGroup.frame.centerY * 1.4, "anim" + i)
            anim.setAnimationByName(0, "idle", true)
            anim.setSkinByName("normal")
            anim.alpha = 0
            animGroup.add(anim)
        }
    }
    
    function createPictures(){
        
        pictureGroup = game.add.group()
        sceneGroup.add(pictureGroup)
        
        var picWidth = 460
        var picHeight = 515
        
        var miniX = Math.round(picWidth / 4)
        var miniY = Math.round(picHeight / 4)
        
        var initX = sceneGroup.frame.centerX - miniX * 2 + (miniX * 0.45)
        var initY = sceneGroup.frame.centerY - (miniY * 2) + (miniY * 0.2)
        
        for(var k = 0; k < 4; k++){
            
            var spaceX = 0
            var spaceY = 0
            var tag = 0
            
            var subGroup = game.add.group()
            pictureGroup.add(subGroup)
        
            for(var i = 0; i < 4; i ++ ){
                for(var j = 0; j < 4; j++){

                    var image  = subGroup.create(initX + (miniX * i), initY + (miniY * j), "pic" + k)
                    image.anchor.setTo(0.5)
                    image.crop(new Phaser.Rectangle(miniX * i, miniY * j, miniX, miniY))
                    image.inputEnabled = true
                    image.events.onInputDown.add(clickImage,this)
                    image.updateCrop()
                    image.changed = false
                    image.x += spaceX * 5
                    image.y += spaceY * 5
                    image.originX = image.x
                    image.originY = image.y
                    image.tag = tag
                    image.startTag = tag
                    spaceY++

                    if(spaceY === 4){
                        spaceY = 0
                        spaceX ++
                    }
                    tag++
                }
            }
        }
        pictureGroup.setAll("x", game.world.width)
    }
    
    function clickImage(obj){
        
        if(gameActive){
            
            sound.play("pop")
            
            if(picsSelection.length < 1){
                obj.tint = 0x191A4F
                picsSelection[picsSelection.length] = obj
            }
            else{
                obj.tint = 0x191A4F
                picsSelection[picsSelection.length] = obj
                gameActive = false
                changePics()
            }
        }
    }
    
    function changePics(){
        
        var tag = picsSelection[0].tag
        
        picsSelection[0].tag = picsSelection[1].tag
        picsSelection[1].tag = tag
        
        var aux = picsSelection[0].position
        
        game.add.tween(picsSelection[0]).to({x: picsSelection[1].x, y: picsSelection[1].y}, 500, Phaser.Easing.Cubic.InOut,true)
        game.add.tween(picsSelection[0].scale).to({x: 0.5, y: 0.5}, 250, Phaser.Easing.Cubic.InOut,true, 0, 0).yoyo(true, 0)
        sound.play("swipe")
        game.add.tween(picsSelection[1]).to({x: aux.x, y: aux.y}, 500, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
            picsSelection[0].tint = 0xFFFFFF
            picsSelection[1].tint = 0xFFFFFF
            
            !checPosition() ? gameActive = true : win(true)
            
            picsSelection = []
        })
    }
    
    function checPosition(){
        
        var picture = pictureGroup.children[rand]
        
        for(var i = 0; i < picture.length; i++){
            
            if(picture.children[i].tag !== picture.children[i].startTag){
                return false
                break
            }
        }
        return true
    }
    
    function win(ans){
        
        if(timeAtack)
            stopTimer()
        
        if(ans){
            addCoin()
            particleCorrect.x = game.world.centerX
            particleCorrect.y = game.world.centerY
            particleCorrect.start(true, 1200, null, 10)
            
            level < pictureGroup.children[rand].length ? level++ : level = pictureGroup.children[rand].length
        }
        else{
            missPoint()
            particleWrong.x = game.world.centerX
            particleWrong.y = game.world.centerY
            particleWrong.start(true, 1200, null, 10)
        }
        
        if(pointsBar.number === 13){
            timeAtack = true
            game.add.tween(timerGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
        }
        
        if(pointsBar.number !== 0 && pointsBar.number > 15){
            gameTime -= 1000
        }
        
        if(lives !== 0){
            if(ans)
                game.add.tween(animGroup.children[rand]).to({alpha: 1}, 800, Phaser.Easing.Cubic.InOut,true)
            game.add.tween(pictureGroup.children[rand]).to({alpha: 0}, 800, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                actionWords.alpha = 0
                pictureGroup.children[rand].x = game.world.width
                pictureGroup.children[rand].alpha = 1
                game.time.events.add(1000,function(){
                    game.add.tween(animGroup.children[rand]).to({alpha: 0}, 800, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
                        initGame()
                    })
                })
            })
        }
    }
    
    function initGame(){
        
        
        rand = getRand()
        picsSelection = []
        showAnimation()
        
        game.time.events.add(3000,function(){
            gameActive = true
            actionWords.text.setText(actionWords.words[rand])
            actionWords.alpha = 1
            if(timeAtack)
                startTimer(gameTime)
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 3)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function showAnimation(){
        
        game.add.tween(animGroup.children[rand]).to({alpha: 1}, 300, Phaser.Easing.Cubic.InOut,true)
        game.time.events.add(1500,function(){
            animateScene()
            sound.play("snapshot")
            animGroup.children[rand].alpha = 0
            takePicture()
        })
        
    }
    
    function takePicture(){
        
        var picture = pictureGroup.children[rand]
        
        picture.x = 0
        
        for(var i = 0; i < picture.length; i++){
            picture.children[i].x = picture.children[i].originX
            picture.children[i].y = picture.children[i].originY
            picture.children[i].tag = i
            picture.children[i].startTag = i
            picture.children[i].changed = false
        }
        
        for(var i = 0; i < level; i++){
            
            var pic1 = selectFirstPic()
            var pic2 = selectSecondPic(pic1)
            
            var tag = picture.children[pic1].tag
            picture.children[pic1].tag = picture.children[pic2].tag
            picture.children[pic2].tag = tag
            
            var aux = picture.children[pic1].position
            picture.children[pic1].position = picture.children[pic2].position
            picture.children[pic2].position = aux
            
            picture.children[pic1].changed = true
            picture.children[pic2].changed = true
        }
        
        for(var i = 0; i < picture.length; i++){
            game.add.tween(picture.children[i]).from({y: -100}, game.rnd.integerInRange(800, 1500), Phaser.Easing.Cubic.InOut,true)
        }
    }
    
    function selectFirstPic(){
        
         var x = game.rnd.integerInRange(0, 15)
        if(pictureGroup.children[rand].children[x].changed)
            return selectSecondPic()
        else
            return x   
    }
    
    function selectSecondPic(pic){
        
        var x = game.rnd.integerInRange(0, 15)
        if(x === pic && pictureGroup.children[rand].children[x].changed)
            return selectSecondPic(pic)
        else
            return x   
    }
    
    function createText(){
        
        var fontStyle = {font: "70px VAGRounded", fontWeight: "bold", fill: "#191A4F", align: "center"}
        
        actionWords = game.add.group()
        actionWords.alpha = 0
        sceneGroup.add(actionWords)
        
        var name = new Phaser.Text(sceneGroup.game, sceneGroup.frame.centerX, sceneGroup.frame.centerY + 300, '', fontStyle)
        name.anchor.setTo(0.5)
        actionWords.add(name)
        actionWords.text = name
        
        if(localization.getLanguage() === 'EN'){
            var words = ["Nadar", "Esquiar", "Surfear", "Ciclismo"]
        }
        else{
            var words = ["Swimming", "Skiing", "Surfing" , "Cycling"]
        }
        
        actionWords.words = words
    }
	
	return {
		
		assets: assets,
		name: "tileARoid",
		update: update,
        preload:preload,
        getGameData:function () {
			var games = yogomeGames.getGames()
			return games[gameIndex]
		},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            /*tileSong = game.add.audio('tileSong')
            game.sound.setDecodedCallback(tileSong, function(){
                tileSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            tileSong = sound.play("tileSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createPictures()
            createAnimations()
            positionTimer()
            createText()
            initCoin()
            createParticles()
			
			buttons.getButton(tileSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()