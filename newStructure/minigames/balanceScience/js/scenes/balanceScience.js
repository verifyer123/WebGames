
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"

var balanceScience = function(){
    
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
                name: "atlas.balanceScience",
                json: "images/balanceScience/atlas.json",
                image: "images/balanceScience/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/balanceScience/timeAtlas.json",
                image: "images/balanceScience/timeAtlas.png",
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
				file: soundsPath + "wrong.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {	name: "wrongAnswer",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "throw",
				file: soundsPath + "throw.mp3"},
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 122
    var overlayGroup
    var balanceSong
    var coin
    var clouds
    var offGroup
    var monsterGroup
    var auxGroup
    var okGroup
    var top
    var weight = [1, 3, 5, 10, 15]
    var lvl
    var time
    var offWeight, monsterWeight
    var cloudGroup
    var tutoLvl
    var handsGroup
    var tweenTiempo
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        top = 1
        lvl = 1
        time = 6000
        offWeight = 0
        monsterWeight = 0
        tutoLvl = 0
        tabo = false
        
        loadSounds()
	}

    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("pop")
            obj.alpha = 1
            game.add.tween(obj.scale).from({x:0.01, y:0.01}, 100, Phaser.Easing.linear,true)
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
        
        sound.play("wrongAnswer")
		        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.balanceScience','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.balanceScience','life_box')

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
        balanceSong.stop()
        		
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
        
        game.load.audio('balanceSong', soundsPath + 'songs/funny_invaders.mp3');
        
		/*game.load.image('howTo',"images/balanceScience/how" + localization.getLanguage() + ".png")
		game.load.image('buttonText',"images/balanceScience/play" + localization.getLanguage() + ".png")
		game.load.image('introscreen',"images/balanceScience/introscreen.png")*/
        
		game.load.image('background',"images/balanceScience/background.png")
		game.load.image('floor',"images/balanceScience/floor.png")
		game.load.image('clouds',"images/balanceScience/clouds.png")
		game.load.image('flyCloud0',"images/balanceScience/flyCloud0.png")
		game.load.image('flyCloud1',"images/balanceScience/flyCloud1.png")
		
        game.load.spine("balance", "images/spines/balance.json")
        game.load.spritesheet("coin", 'images/spines/coin.png', 122, 123, 12)
        
		console.log(localization.getLanguage() + ' language')

        game.load.image('tutorial_image',"images/balanceScience/tutorial_image.png")
        //loadType(gameIndex)

        
    }
    
    function createOverlay(){
        
        overlayGroup = game.add.group()
		//overlayGroup.scale.setTo(0.8,0.8)
        sceneGroup.add(overlayGroup)
        

        tutorialHelper.createTutorialGif(overlayGroup,onClickPlay)



        /*var rect = new Phaser.Graphics(game)
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
                initTuto()
            })
            
        })
        
        overlayGroup.add(rect)
        
        var plane = overlayGroup.create(game.world.centerX, game.world.centerY,'introscreen')
		plane.scale.setTo(1,1)
        plane.anchor.setTo(0.5,0.5)
		
		var tuto = overlayGroup.create(game.world.centerX, game.world.centerY - 50,'atlas.balanceScience','gametuto')
		tuto.anchor.setTo(0.5,0.5)
        
        var howTo = overlayGroup.create(game.world.centerX,game.world.centerY - 235,'howTo')
		howTo.anchor.setTo(0.5,0.5)
		howTo.scale.setTo(0.8,0.8)
		
		var inputName = 'movil'
		
		if(game.device.desktop){
			inputName = 'desktop'
		}
		
		console.log(inputName)
		var inputLogo = overlayGroup.create(game.world.centerX ,game.world.centerY + 125,'atlas.balanceScience',inputName)
        inputLogo.anchor.setTo(0.5,0.5)
		inputLogo.scale.setTo(0.7,0.7)
		
		var button = overlayGroup.create(game.world.centerX, inputLogo.y + inputLogo.height * 1.5,'atlas.balanceScience','button')
		button.anchor.setTo(0.5,0.5)
		
		var playText = overlayGroup.create(game.world.centerX, button.y,'buttonText')
		playText.anchor.setTo(0.5,0.5)*/
    }

    function onClickPlay(){
        overlayGroup.y = -game.world.height
        initTuto()
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
        
        var back = sceneGroup.create(-20,0, 'background')
        back.width = game.world.width * 1.2
        back.height = game.world.height
        
        var floor = sceneGroup.create(game.world.centerX, game.world.height, 'floor')
        floor.width = game.world.width
        floor.height = game.world.height * 0.25
        floor.anchor.setTo(0.5, 1)
        
        clouds = game.add.tileSprite(0, 0, game.world.width, 550, "clouds")
        sceneGroup.add(clouds)
    }

	function update(){
        //tutorialUpdate()

        clouds.tilePosition.x += 0.1
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
        particle.makeParticles('atlas.balanceScience',key);
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

				particle.makeParticles('atlas.balanceScience',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.balanceScience','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.balanceScience','smoke');
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
        timerGroup.y = clock.height * 0.5
   }
    
    function stopTimer(){
        
        tweenTiempo.stop()
        tweenTiempo = game.add.tween(timeBar.scale).to({x:8,y:.45}, 100, Phaser.Easing.Linear.Out, true, 100)
   }
    
    function startTimer(time){
        
        tweenTiempo = game.add.tween(timeBar.scale).to({x:0,y:.45}, time, Phaser.Easing.Linear.Out, true, 100)
        tweenTiempo.onComplete.add(function(){
            win(true)
        })
    }
    
    function initCoin(){
        
       coin = game.add.sprite(0, 0, "coin")
       coin.anchor.setTo(0.5)
       coin.scale.setTo(0.5)
       coin.animations.add('coin');
       coin.animations.play('coin', 24, true);
       coin.alpha = 0

    }

    function addCoin(){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        var timer = 200

        game.add.tween(coin).to({alpha:1}, timer, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, timer + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function equilibrium(){
        
        balance = game.add.spine(game.world.centerX -10, game.world.height - 50, "balance")
        balance.setAnimationByName(0, "IDLE", true)
        balance.setSkinByName("normal")
        balance.autoUpdateTransform()
        balance.scale.setTo(0.8)
        sceneGroup.add(balance)
    }
    
	function heavyWeight(){
        
        offGroup = game.add.group()
        offGroup.scale.setTo(0.9)
        sceneGroup.add(offGroup)
        
        monsterGroup = game.add.group()
        sceneGroup.add(monsterGroup)
        
        auxGroup = game.add.group()
        sceneGroup.add(auxGroup)
        
        var pivot = -2
        
        for(var w = 0; w < 5; w++){
            
            var offSide = offGroup.create(game.world.centerX, game.world.centerY * 0.65, 'atlas.balanceScience', 'weight' + w)
            offSide.x += pivot * 100
            offSide.anchor.setTo(0.5, 1)
            offSide.weight = weight[w]
            offSide.popX = offSide.x
            offSide.popY = offSide.y
            offSide.inputEnabled = true
            offSide.val = w
            //offSide.input.enableDrag()
            //offSide.events.onDragStop.add(putThatThingDown,this)
            offSide.events.onInputDown.add(putThatThingDown,this)
            pivot++
            
            var monsterSide = monsterGroup.create(0, 90, 'atlas.balanceScience', 'weight' + w)
            monsterSide.anchor.setTo(0.5, 1)
            monsterSide.alpha = 0
            monsterSide.weight = weight[w]
            monsterSide.val = w
        }
        
        offGroup.sort('val', Phaser.Group.SORT_ASCENDING)
        monsterGroup.sort('val', Phaser.Group.SORT_ASCENDING)
    }
    
    function putThatThingDown(mass){
        
        var slot
        
        sound.play('cut')
        okGroup.setAll('tint', 0xffffff)
        okBtn.inputEnabled = true

        mass.inputEnabled = false
        offGroup.remove(mass)
        mass.x = 0
        mass.y = 90

        slot = getSpineSlot(balance, "emptyO" + top)
        slot.add(mass)
        sortOnDrop()

        offWeight += mass.weight
        top++
        
        if(handsGroup !== undefined){
            posHand(okGroup)
        }
    }
    
    function sortOnDrop(){
        
        var slot
        var slotNext
        var aux
        var auxNext
        
        for(var w = 5; w > 1; w--){
            slot = getSpineSlot(balance, "emptyO" + w)
            slotNext = getSpineSlot(balance, "emptyO" + (w - 1))
            
            if(slot.children[1] !== undefined && slotNext.children[1] !== undefined){
                if(slot.children[1].val > slotNext.children[1].val){
                    aux = slot.children[1]
                    auxNext = slotNext.children[1]
                    slot.remove(aux)
                    slotNext.remove(auxNext)
                    slot.add(auxNext)
                    slotNext.add(aux)
                }
            }
        }
    }
    
    function ok(){
        
        okGroup = game.add.group()
        okGroup.x = game.world.centerX 
        okGroup.y = game.world.height - 50
        okGroup.scale.setTo(1.5)
        sceneGroup.add(okGroup)
        
        okBtn = okGroup.create(0, 0, "atlas.balanceScience", "okOff")
        okBtn.anchor.setTo(0.5) 
        okBtn.inputEnabled = false
        okBtn.events.onInputDown.add(okPressed,this)   
        okBtn.events.onInputUp.add(okRelased,this) 
 
        var okBtnOn = okGroup.create(0, 0, "atlas.balanceScience", "okOn")
        okBtnOn.anchor.setTo(0.5) 
        okBtnOn.alpha = 0
        
        var fontStyle = {font: "38px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var okTxt = new Phaser.Text(sceneGroup.game, 0, 2, 'OK', fontStyle)
        okTxt.anchor.setTo(0.5)
        okGroup.add(okTxt)
        
        okGroup.setAll('tint', 0x909090)
        
        //cloud = sceneGroup.create(0, 0, "clouds")
    }
    
    function okPressed(btn){
        
        if(gameActive){
            sound.play('pop')
            btn.parent.children[0].alpha = 0
            btn.parent.children[1].alpha = 1
            btn.parent.children[2].scale.setTo(0.9)
            
            if(tutoLvl > 1){
                win()
            }
            else{
                checkTuto()
            }
        }
    }
    
    function okRelased(btn){
        
        btn.parent.children[0].alpha = 1
        btn.parent.children[1].alpha = 0
        btn.parent.children[2].scale.setTo(1)
    }
    
    function win(ans){
        
        gameActive = false
        stopTimer()
        offGroup.setAll('inputEnabled', false)
        
        if(ans){
            offWeight = -1
        }
        
        if(offWeight === monsterWeight){
            sound.play('rightChoice')
            addCoin()
            balance.setAnimationByName(0, "WIN", true)
            lvl = getRand()
            if(pointsBar.number > 8){
                time -= 300
            }
        }
        else{
            balance.setAnimationByName(0, "LOSE", false)
            balance.addAnimationByName(0, "LOSESTILL", true)
            sound.play('throw')
            missPoint()
        }
        
        game.time.events.add(2800,function(){
            balance.setAnimationByName(0, "IDLE", true)
            okGroup.setAll('tint', 0x909090)
            okBtn.inputEnabled = false
            bringItOff()
        },this)
        
        game.time.events.add(1000,function(){
            game.add.tween(cloudGroup).to({x: game.world.width}, 2600, Phaser.Easing.linear,true).onComplete.add(function(){
                cloudGroup.x = game.world.width * - 2.5
                initGame()                                                                                               
            })
        },this)
    }
    
    function getSpineSlot(spine, slotName){
		
		var slotIndex
		for(var index = 0, n = spine.skeletonData.slots.length; index < n; index++){
			var slotData = spine.skeletonData.slots[index]
			if(slotData.name === slotName){
				slotIndex = index
			}
		}

		if (slotIndex){
			return spine.slotContainers[slotIndex]
		}
	}
    
    function initGame(){
        
        offGroup.setAll('inputEnabled', false)
        offWeight = 0
        monsterWeight = 0
        top = 1
        shuffle()
        sortWeight() 
        var startTime = bringItOn()
        
         game.time.events.add(startTime,function(){
             offGroup.setAll('inputEnabled', true)
             gameActive = true
             startTimer(time)
            },this)
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(1, 4)
        if(x === lvl)
            return getRand()
        else
            return x     
    }
    
    function bringItOn(){
            
        var spriteIn
        var slot
        var delay = 300

        for(var w = 0; w < lvl; w++){
            spriteIn = auxGroup.children[0]
            auxGroup.remove(spriteIn)
            slot = getSpineSlot(balance, "emptyM" + (w + 1))
            slot.add(spriteIn)
            popObject(spriteIn, delay)
            delay += 300
            monsterWeight += spriteIn.weight
        }
        
        return delay
    }
    
    function getWeight(kg){
        
        var index
        
        for(var w = 0; w < monsterGroup.length; w++){
            if(kg === monsterGroup.children[w].weight){
                index = w
                break
            }
        }
        return index
    }
    
    function sortWeight(){
        
        var index 
        var element
    
        for(var w = 0; w < lvl; w++){
            index = getWeight(weight[w])
            element = monsterGroup.children[index]
            monsterGroup.remove(element)
            auxGroup.add(element)
        }
        
        auxGroup.sort('val', Phaser.Group.SORT_DESCENDING)
        offGroup.sort('val', Phaser.Group.SORT_ASCENDING)
    }
    
    function shuffle(){
        
        Phaser.ArrayUtils.shuffle(weight)

        if(lvl === 2){
            if(weight[0] === 1 && weight[1] === 3 || weight[0] === 3 && weight[1] === 1 ){
                shuffle()
            }
        }
    }
    
    function bringItOff(){
        
        var monMass
        var monSlot
        
        var offMass
        var offSlot
        
        for(var w = 1; w < 6; w++){
            monSlot = getSpineSlot(balance, "emptyM" + w)
            monMass =  monSlot.children[1]
            if(monMass !== undefined){
                monSlot.remove(monMass)
                monsterGroup.add(monMass)
                monMass.alpha = 0 
            }
            
            offSlot = getSpineSlot(balance, "emptyO" + w)
            offMass =  offSlot.children[1]
            if(offMass !== undefined){
                offSlot.remove(offMass)
                offGroup.add(offMass)
                offMass.x = offMass.popX
                offMass.y = offMass.popY
            }
        }
        
        offGroup.sort('val', Phaser.Group.SORT_ASCENDING)
        monsterGroup.sort('val', Phaser.Group.SORT_ASCENDING)
    }
    
    function flyingCloud(){
        
        cloudGroup = game.add.group()
        cloudGroup.x = - game.world.width * 2.5
        cloudGroup.scale.setTo(1.1)
        sceneGroup.add(cloudGroup)
        
        for(var w = 0; w < 2; w++){
            var flyCloud = cloudGroup.create(0, 50, 'flyCloud' + w)
            flyCloud.x += 500 * w
            flyCloud.y += 150 * w
        }
    }
    
    function initTuto(){
        
        offGroup.setAll('inputEnabled', false)
        offGroup.setAll('tint', 0x909090)
        offWeight = 0
        monsterWeight = 0
        top = 1
        
        game.time.events.add(500,function(){
             fillTuto()
             gameActive = true
        },this)
    }
    
    function fillTuto(){
        
        var aux
        var slot
    
        if(tutoLvl === 0){
            var rnd = game.rnd.integerInRange(0, 4)
            aux = monsterGroup.children[rnd]
            slot = getSpineSlot(balance, "emptyM1")
            monsterGroup.remove(aux)
            slot.add(aux)
            popObject(aux, 100)

            offGroup.children[rnd].tint = 0xffffff
            offGroup.children[rnd].inputEnabled = true
            posHand(offGroup.children[rnd])
        }
        else{
            aux = monsterGroup.children[4]
            slot = getSpineSlot(balance, "emptyM1")
            monsterGroup.remove(aux)
            slot.add(aux)
            popObject(aux, 100)
            
            offGroup.children[2].tint = 0xffffff
            offGroup.children[2].inputEnabled = true
            offGroup.children[3].tint = 0xffffff
            offGroup.children[3].inputEnabled = true
        }
    }
    
    function checkTuto(){
        
        if(tutoLvl === 0 && top === 2 || tutoLvl === 1 && top === 3){
           
            gameActive = false
            balance.setAnimationByName(0, "WIN", true)
            sound.play('rightChoice')
            tutoLvl++
            handsGroup.alpha = 0
            
           // game.time.events.add(500,function(){
                
            //})
            
            game.time.events.add(2800,function(){
                balance.setAnimationByName(0, "IDLE", true)
                okGroup.setAll('tint', 0x909090)
                okBtn.inputEnabled = false
                bringItOff()
                offGroup.setAll('tint', 0x909090)
            })
            
            game.time.events.add(1000,function(){
                game.add.tween(cloudGroup).to({x: game.world.width}, 2600, Phaser.Easing.linear,true).onComplete.add(function(){
                    cloudGroup.x = - game.world.width * 2.5                                                                                         
                    if(tutoLvl < 2){
                        initTuto()
                    }
                    else{
                        game.add.tween(timerGroup).to({alpha:1}, 400, Phaser.Easing.linear, true)
                        offGroup.setAll("tint", 0xffffff)
                        handsGroup.destroy()
                        initGame()
                    }                                                                                               
                })
            },this)
        }
        else{
            sound.play("wrongAnswer")
        }
    }
    
    function initHand(){
        
        handsGroup = game.add.group()
        handsGroup.alpha = 0
        sceneGroup.add(handsGroup)
        
        var handUp = handsGroup.create(0, 0, 'atlas.balanceScience', 'handUp') // 0
        handUp.alpha = 0
        
        var handDown = handsGroup.create(0, 0, 'atlas.balanceScience', 'handDown') // 1
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
    
    function posHand(pos){
        
        handsGroup.setAll("x", pos.x)
        handsGroup.setAll("y", pos.y - 40)
        handsGroup.alpha = 1
    }
	
	return {
		
		assets: assets,
		name: "balanceScience",
		update: update,
        preload:preload,getGameData:function () { var games = yogomeGames.getGames(); return games[gameIndex];},
		create: function(event){
            
			sceneGroup = game.add.group()
			
			createBackground()
			addParticles()
                        			
            balanceSong = game.add.audio('balanceSong')
            game.sound.setDecodedCallback(balanceSong, function(){
                balanceSong.loopFull(0.5)
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
            equilibrium()
            heavyWeight()
            ok()
            flyingCloud()
            initCoin()
            initHand()
            createParticles()
			
			buttons.getButton(balanceSong,sceneGroup)
            createOverlay()
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()