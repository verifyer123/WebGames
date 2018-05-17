
var soundsPath = "../../shared/minigames/sounds/"
var solarCity = function(){
    
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
                name: "atlas.solarCity",
                json: "images/solarCity/atlas.json",
                image: "images/solarCity/atlas.png",
            }
        ],
        images: [
            {
				name:'tutorial_image',
				file:"images/solarCity/gametuto.png"
			}
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "robotWhoosh",
				file: soundsPath + "robotWhoosh.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "rightChoice",
				file: soundsPath + "rightChoice.mp3"},
            {	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'gameSong',
                file: soundsPath + 'songs/wormwood.mp3'
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
				name:"city",
				file:"images/spines/build/build.json"
			},
            {
				name:"cloud",
				file:"images/spines/cloud/cloud.json"
			},
            {
				name:"panel",
				file:"images/spines/panel/panel.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 207
    var tutoGroup
    var gameSong
    var coin
    var hand
    var dirtySky
    var energyGroup
    var panelsGroup
    var TAP_LEVEL
    var PANELS_LEVEL
    var ENERGY_TIME
    var PANELS_COUNT
    var ALPHA_SKY
    var pos = []
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        TAP_LEVEL = 1
        PANELS_LEVEL = 1
        ENERGY_TIME = 10000
        PANELS_COUNT = 0
        ALPHA_SKY = 1/PANELS_LEVEL
        pos = [0, 1, 2, 3, 4, 5, 6]
        
        loadSounds()
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
    
    function missPoint(obj){
        
        sound.play("wrong")
        
        particleWrong.x = obj.x
        particleWrong.y = obj.y
        particleWrong.start(true, 1200, null, 10)
		        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.solarCity','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.solarCity','life_box')

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
        gameSong.stop()
        		
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
            
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, "atlas.solarCity", "tile"))
        
        var cleanSky = game.add.graphics(0, 0)
        cleanSky.beginFill(0x57EAED)
        cleanSky.drawRect(0, 0, game.world.width, 320)
        sceneGroup.add(cleanSky)
        
        var cleanClouds = sceneGroup.create(0, 0, "atlas.solarCity", "cleanClouds")
        cleanClouds.width = game.world.width
        cleanSky.addChild(cleanClouds)
        
        dirtySky = game.add.graphics(0, 0)
        dirtySky.beginFill(0x479FA1)
        dirtySky.drawRect(0, 0, game.world.width, 320)
        sceneGroup.add(dirtySky)
        
        var dirtyClouds = sceneGroup.create(0, 0, "atlas.solarCity", "dirtyClouds")
        dirtyClouds.width = game.world.width
        dirtySky.addChild(dirtyClouds)
        
        var backCity = game.add.tileSprite(0, 320, game.world.width, 160, "atlas.solarCity", "city")
        backCity.anchor.setTo(0, 1)
        sceneGroup.add(backCity)
        
        var city = game.add.spine(game.world.centerX, game.world.centerY - 30, "city")
        city.setAnimationByName(0, "idle", true)
        city.setSkinByName("normal")
        sceneGroup.add(city)
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
        particle.makeParticles('atlas.solarCity',key);
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

				particle.makeParticles('atlas.solarCity',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.solarCity','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.solarCity','smoke');
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
    
    function createEnergyBar(){
        
        energyGroup = game.add.group()
        //energyGroup.alpha = 0
        sceneGroup.add(energyGroup)
        
        var bar = energyGroup.create(game.world.centerX, 110, "atlas.solarCity", "bar")
        bar.anchor.setTo(0.5)
        
        var energy = energyGroup.create(bar.centerX - 146, bar.centerY - 5, "atlas.solarCity", "energy")
        energy.anchor.setTo(0, 0.5)
        energy.scale.setTo(20.2, 1)
        energyGroup.energy = energy
   }
    
    function stopTimer(){
        
        energyGroup.tweenTime.stop()
        game.add.tween(energyGroup.energy.scale).to({x:20.2}, 100, Phaser.Easing.Cubic.Out, true, 100)
   }
    
    function startTimer(time){
        
        energyGroup.tweenTime = game.add.tween(energyGroup.energy.scale).to({x:0}, time, Phaser.Easing.linear, true, 100)
        energyGroup.tweenTime.onComplete.add(function(){
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
        
        hand = game.add.sprite(0, 0, "hand")
        hand.animations.add('hand')
        hand.animations.play('hand', 24, true)
        hand.alpha = 0

    }

    function addCoin(obj){
        
        coin.x = obj.centerX
        coin.y = obj.centerY
        var time = 300
        
        particleCorrect.x = obj.centerX 
        particleCorrect.y = obj.centerY
        particleCorrect.start(true, 1200, null, 10)

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function createPanel(){
        
        var subGroup = game.add.group()
        subGroup.active = false
        
        var panel = game.add.spine(0, 0, "panel")
        panel.setAnimationByName(0, "out", false)
        panel.setSkinByName("normal")
        subGroup.add(panel)
        subGroup.panel = panel
        
        var miniBar = game.add.sprite(0, 25, "atlas.solarCity", "miniBar")
        miniBar.anchor.setTo(0.5)
        miniBar.scale.setTo(0, 1.3)
        panel.addChild(miniBar)
        subGroup.bar = miniBar
        
        var energy = game.add.sprite(-42, -3.5, "atlas.solarCity", "miniEnergy")
        energy.anchor.setTo(0, 0.5)
        energy.scale.setTo(16.4, 1)
        miniBar.addChild(energy)
        subGroup.energy = energy
        
        var cloud = game.add.spine(0, -120, "cloud")
        cloud.setAnimationByName(0, "idle", true)
        cloud.setSkinByName("normal")
        cloud.alpha = 0
        subGroup.add(cloud)
        subGroup.cloud = cloud
        
        var box = game.add.graphics(0, 0)
        box.beginFill(0x00aaff)
        box.drawRect(-75, -80, 150, 100)
        box.alpha = 0
        box.canTap = false
        box.tapCount = TAP_LEVEL
        box.inputEnabled = true
        box.events.onInputDown.add(tapCloud, this)
        cloud.addChild(box)
        subGroup.box = box
        
        return subGroup
    }
    
    function createPanelsField(){
        
        panelsGroup = game.add.group()
        sceneGroup.add(panelsGroup)
        
        for(var i = 0; i < 7; i++){
            
            var panel = createPanel()
            panel.x = game.world.centerX
            panel.y = game.world.centerY + 50
            panelsGroup.add(panel)
        }
        
        panelsGroup.children[0].x -= 180
        panelsGroup.children[0].y -= 190
        
        panelsGroup.children[1].x += 180
        panelsGroup.children[1].y -= 150
        
        panelsGroup.children[2].x -= 180
        panelsGroup.children[2].y += 70
        
        //panelsGroup.children[3].x -= 180
        panelsGroup.children[3].y += 100
        
        panelsGroup.children[4].x += 180
        panelsGroup.children[4].y += 100
        
        panelsGroup.children[5].x -= 120
        panelsGroup.children[5].y = game.world.height - 100
        
        panelsGroup.children[6].x += 130
        panelsGroup.children[6].y = game.world.height - 80
    }
    
    function tapCloud(obj){
        
        if(gameActive && obj.canTap){
            sound.play("pop")
            obj.parent.alpha -= 1/TAP_LEVEL
            obj.tapCount--
            
            if(obj.tapCount === 0){
                sound.play("rightChoice")
                obj.parent.alpha = 0
                obj.canTap = false
                obj.parent.parent.miniTween.stop()
                game.add.tween(obj.parent.parent.energy.scale).to({x:16.4}, 300, Phaser.Easing.linear, true, 0)
                obj.parent.parent.panel.setAnimationByName(0, "gain_energy", true)
                PANELS_COUNT++
                game.add.tween(dirtySky).to({alpha: dirtySky.alpha -= ALPHA_SKY}, 200, Phaser.Easing.linear, true, 0)
            }
            
            if(PANELS_COUNT === PANELS_LEVEL){
                game.add.tween(dirtySky).to({alpha: 0}, 300, Phaser.Easing.linear, true, 0)
                win(true)
            }
        }
    }
    
    function win(ans){
        
        gameActive = false
        stopTimer()
        
        if(ans){
            addCoin(game.world)
            if(pointsBar.number !== 0 && pointsBar.number % 2 === 0){
                PANELS_LEVEL < 6 ? PANELS_LEVEL++ : PANELS_LEVEL = 6
                ALPHA_SKY = 1/PANELS_LEVEL
            }
            if(pointsBar.number > 5 && pointsBar.number % 3 === 0){
                TAP_LEVEL < 4 ? TAP_LEVEL++ : TAP_LEVEL = 4
            }
            if(TAP_LEVEL === 4 && PANELS_LEVEL === 6){
                ENERGY_TIME > 5000 ? ENERGY_TIME -= 500 : ENERGY_TIME = 5000
                console.log(ENERGY_TIME)
            }
        }
        else{
            missPoint(game.world)
        }
        
        if(lives !== 0){
            game.time.events.add(1000,restarAssets)
        }
    }
    
    function restarAssets(){
        
        game.add.tween(dirtySky).to({alpha:1}, 300, Phaser.Easing.linear, true, 0)
        
        for(var i = 0; i < panelsGroup.length; i++){
            if(panelsGroup.children[i].active)
                hidePanel(panelsGroup.children[i])
        }
        
        PANELS_COUNT = 0
        
        game.time.events.add(1000,initGame)
    }
    
    function hidePanel(panel){
        
        game.add.tween(panel.bar.scale).to({x:0},250,Phaser.Easing.linear,true).onComplete.add(function(){
            panel.active = false
            panel.panel.setAnimationByName(0, "out", false)
            panel.box.canTap = false
            panel.box.tapCount = game.rnd.integerInRange(1, TAP_LEVEL)
            game.add.tween( panel.cloud).to({alpha:0},250,Phaser.Easing.linear,true)
            panel.energy.scale.setTo(16.4, 1)
        })   
    }
    
    function initGame(){
        
        ALPHA_SKY = 1/PANELS_LEVEL
        
        Phaser.ArrayUtils.shuffle(pos)
       
        var delay = 200
        for(var i = 0; i < PANELS_LEVEL; i++){
            appearPanel(panelsGroup.children[pos[i]], delay)
            delay += 300
        }
       
        for(var i = 0; i < PANELS_LEVEL; i++){
            flyCloud(panelsGroup.children[pos[i]].cloud, delay)
            panelsGroup.children[pos[i]].box.canTap = true
        }
        
        game.time.events.add(delay + 2000,function(){
            for(var i = 0; i < PANELS_LEVEL; i++){
                startMiniTimes(panelsGroup.children[pos[i]])
            }
            gameActive = true
            startTimer(ENERGY_TIME)
        })
    }
    
    function appearPanel(solar, delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("robotWhoosh")
            solar.active = true
            solar.panel.setAnimationByName(1, "appear", false)//.onComplete = barstart(celda)
            solar.panel.addAnimationByName(0, "idle", true)
            game.time.events.add(600, function(){
                game.add.tween(solar.bar.scale).to({x:1.3},250,Phaser.Easing.linear,true)
            })
        })
    }
    
    function flyCloud(cloud, delay){
        
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            cloud.alpha = 1
            game.add.tween(cloud).from({x:game.rnd.integerInRange(-300, 300), y: -900},game.rnd.integerInRange(1000, 2000),Phaser.Easing.linear,true)
        })
    }
    
    function startMiniTimes(solarPanel){
        
        solarPanel.miniTween = game.add.tween(solarPanel.energy.scale).to({x:0}, ENERGY_TIME * 0.8, Phaser.Easing.linear, true, 100)
        solarPanel.miniTween.onComplete.add(function(){
            solarPanel.box.canTap = false
            sound.play("shoot")
            PANELS_COUNT++
            if(lives !== 0)
                missPoint(solarPanel)
            
            if(PANELS_COUNT === PANELS_LEVEL){
                gameActive = false
                stopTimer()
                if(lives !== 0)
                    game.time.events.add(1000,restarAssets)
            }
        })
    }
	
	return {
		
		assets: assets,
		name: "solarCity",
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
                        			
            /*gameSong = game.add.audio('gameSong')
            game.sound.setDecodedCallback(gameSong, function(){
                gameSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            gameSong = sound.play("gameSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            createEnergyBar()
            createPanelsField()
            initCoin()
            createParticles()
			
			buttons.getButton(gameSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()