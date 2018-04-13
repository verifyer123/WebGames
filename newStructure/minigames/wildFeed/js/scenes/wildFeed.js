
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var wildFeed = function(){
    
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
                name: "atlas.wildFeed",
                json: "images/wildFeed/atlas.json",
                image: "images/wildFeed/atlas.png",
            },
            {   
                name: "atlas.time",
                json: "images/wildFeed/timeAtlas.json",
                image: "images/wildFeed/timeAtlas.png",
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
				file:"images/wildFeed/gametuto.png"
			},
            {
				name:'back',
				file:"images/wildFeed/back.jpg"
			}

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
            {   name: 'wildSong',
                file: soundsPath + 'songs/happy_game_memories.mp3'
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
            //herbivorous
            {
				name:"bonny",
				file:"images/spines/bonny/bonny.json"
			},
            {
				name:"deer",
				file:"images/spines/deer/deer.json"
			},
            {
				name:"elephant",
				file:"images/spines/elephant/elephant.json"
			},
            {
				name:"giraffe",
				file:"images/spines/giraffe/giraffe.json"
			},
            {
				name:"koala",
				file:"images/spines/koala/koala.json"
			},
            
            //omnivores
            {
				name:"mouse",
				file:"images/spines/mouse/mouse.json"
			},
            {
				name:"chipmunk",
				file:"images/spines/chipmunk/chipmunk.json"
			},
            {
				name:"gorilla",
				file:"images/spines/gorilla/gorilla.json"
			},
            {
				name:"pig",
				file:"images/spines/pig/pig.json"
			},
             {
				name:"raccoon",
				file:"images/spines/raccoon/raccoon.json"
			},
            
            //carnivorous
            {
				name:"crocodile",
				file:"images/spines/cocodile/cocodile.json"
			},
            {
				name:"fox",
				file:"images/spines/fox/fox.json"
			},
            {
				name:"lion",
				file:"images/spines/lion/lion.json"
			},
            {
				name:"wolf",
				file:"images/spines/wolf/wolf.json"
			},
            {
				name:"bear",
				file:"images/spines/bear/bear.json"
			},
            {
				name:"emojys",
				file:"images/spines/emojys/emojys.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 175
    var tutoGroup
    var wildSong
    var coin
    var hand
    var animalsGroup
    var buttonsGroup
    var textGroup
    var emojys
    var rand
    var index
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        index = 0
        
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.wildFeed','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.wildFeed','life_box')

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
        wildSong.stop()
        		
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
            
        var back = sceneGroup.create(0, 0, "back")
        back.width = game.world.width
        back.height = game.world.height
        
        var purplePipe = sceneGroup.create(game.world.centerX + 50, 0, "atlas.wildFeed", "purplePipe")
        purplePipe.anchor.setTo(0.5, 0)
        purplePipe.scale.setTo(1.1)
        
        var greenPipe = sceneGroup.create(game.world.centerX - 130, 0, "atlas.wildFeed", "greenPipe")
        greenPipe.anchor.setTo(0.5, 0)
        greenPipe.scale.setTo(1.1)
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
        particle.makeParticles('atlas.wildFeed',key);
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

				particle.makeParticles('atlas.wildFeed',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.wildFeed','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.wildFeed','smoke');
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
        //timerGroup.alpha = 0
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
            stopTimer()
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

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function noahArk(){
        
        animalsGroup = game.add.group()
        sceneGroup.add(animalsGroup)
        
        for(var i = 0; i < 3; i++){
            
            var subGroup = game.add.group()
            subGroup.tag = i
            animalsGroup.add(subGroup)
        }    
        
        var aux = 0
        
        for(var i = 0; i < 15; i++){
            
            if(i === 5 || i === 10)
                aux++
            
            var anim = game.add.spine(game.world.width + 350, game.world.height - 195, assets.spines[i].name)
            anim.scale.setTo(0.7)
            anim.setAnimationByName(0, "IDLE", true)
            anim.setSkinByName("normal")
            animalsGroup.children[aux].add(anim)
        }
        
        animalsGroup.children[0].children[3].y += 45
        animalsGroup.children[0].children[4].y += 40
        animalsGroup.children[0].children[1].y += 10
        animalsGroup.children[1].children[2].y += 40
        animalsGroup.children[1].children[3].y += 10
        animalsGroup.children[2].children[0].y += 60
        animalsGroup.children[2].children[1].y += 10
        animalsGroup.children[2].children[4].y += 20
        
        emojys = game.add.spine(0, 0, "emojys")
        emojys.scale.setTo(0.8)
        emojys.alpha = 0
        emojys.setAnimationByName(0, "CONFUCED", true)
        emojys.setSkinByName("normal")
        sceneGroup.add(emojys)
    }
    
    function createText(){
        
        textGroup = game.add.group()
        textGroup.alpha = 0
        sceneGroup.add(textGroup)
        
        var fontStyle = {font: "60px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var container = textGroup.create(game.world.centerX, game.world.centerY + 150, "atlas.wildFeed", "container")
        container.anchor.setTo(0.5)
        
        var name = new Phaser.Text(sceneGroup.game, container.centerX, container.centerY + 10, '', fontStyle)
        name.anchor.setTo(0.5)
        //name.setText('')
        textGroup.add(name)
        textGroup.text = name
        
        if(localization.getLanguage() === 'EN'){
            textGroup.words = ["Herbivorous", "Omnivores", "Carnivorous"]
        }
        else{
            textGroup.words = ["Herbívoros", "Omnívoros", "Carnívoros"]
        }
    }
    
    function superSizeMe(){
        
        var fontStyle = {font: "28px VAGRounded", fontWeight: "bold", fill: "#FFFFFF", align: "center"}
        
        var board = sceneGroup.create(0, game.world.height, "atlas.wildFeed", "board")
        board.anchor.setTo(0, 1)
        board.width = game.world.width
        
        var name = ["green", "blue", "purple"]
        var pivot = -1
        
        buttonsGroup = game.add.group()
        buttonsGroup.posX = []
        sceneGroup.add(buttonsGroup)
        
        var buttonsName = game.add.group()
        
        for(var i = 0; i < name.length; i++){
            
            var button = buttonsGroup.create(board.centerX + (200 * pivot), board.centerY - 11, "atlas.wildFeed", name[i])
            button.anchor.setTo(0.5)
            button.scale.setTo(1.4, 1.2)
            button.tag = i
            button.inputEnabled = true
            button.events.onInputDown.add(feedThem, this)
            button.text
            pivot++
            buttonsGroup.posX[buttonsGroup.posX.length] = button.x
            
            var text = new Phaser.Text(sceneGroup.game, button.centerX, button.centerY + 40, textGroup.words[i], fontStyle)
            text.anchor.setTo(0.5, 0)
            //text.setText('')
            buttonsName.add(text)
        }
        
        buttonsGroup.setAll("tint", 0x606060)
        
        var meat = sceneGroup.create(game.world.centerX + 50, game.world.centerY + 50, "atlas.wildFeed", "meat")
        meat.anchor.setTo(0.5)
        meat.scale.setTo(1.5)
        meat.alpha = 0
        
        var vegan = sceneGroup.create(game.world.centerX - 130, game.world.centerY + 50, "atlas.wildFeed", "vegan")
        vegan.anchor.setTo(0.5)
        vegan.scale.setTo(1.5)
        vegan.alpha = 0
       
        buttonsGroup.children[0].food = vegan
        buttonsGroup.children[2].food = meat
        
        buttonsGroup.add(buttonsName)
        buttonsGroup.buttonsName = buttonsName
    }
    
    function feedThem(btn){
        
        if(gameActive){
            
            gameActive = false
            sound.play("pop")
            buttonsGroup.setAll("tint", 0x606060)
            btn.tint = 0xFFFFFF
            var ans
            
            if(btn.tag === animalsGroup.children[rand].tag){
                ans = true
            }
            else{
                ans = false
            }
            
            if(btn.food){
                btn.food.alpha = 1
                game.add.tween(btn.food).from({y: game.world.centerY - 200}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
                    btn.food.alpha = 0
                    win(ans, btn.food)
                })
            }
            else{
                btn.parent.children[0].food.alpha = 1
                btn.parent.children[2].food.alpha = 1
                game.add.tween(btn.parent.children[0].food).from({y: game.world.centerY - 200}, 800, Phaser.Easing.linear, true)
                game.add.tween(btn.parent.children[2].food).from({y: game.world.centerY - 200}, 800, Phaser.Easing.linear, true).onComplete.add(function(){
                    btn.parent.children[0].food.alpha = 0
                    btn.parent.children[2].food.alpha = 0
                    win(ans, btn.parent.children[0].food, btn.parent.children[2].food)
                })
            }
        }
    }
    
    function win(ans, obj1, obj2){
        
        var animal = animalsGroup.children[rand].children[index]
        
        if(ans){
            sound.play("rightChoice")
            addCoin()
            emojys.setAnimationByName(0, "HAPPY", true)
            animal.setAnimationByName(0, "WIN", true)
            particleCorrect.x = obj1.x - 20
            particleCorrect.y = obj1.y
            particleCorrect.start(true, 1200, null, 10)
            
            if(obj2){
                particleCorrect.x = obj2.x - 20
                particleCorrect.y = obj2.y
                particleCorrect.start(true, 1200, null, 10)
            }
        }
        else{
            missPoint()
            emojys.setAnimationByName(0, "ANGRY", true)
            animal.setAnimationByName(0, "LOSE", true)
            particleWrong.x = obj1.x - 20
            particleWrong.y = obj1.y
            particleWrong.start(true, 1200, null, 10)
            
            if(obj2){
                particleWrong.x = obj2.x - 20
                particleWrong.y = obj2.y
                particleWrong.start(true, 1200, null, 10)
            }
        }
        
        game.add.tween(textGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true).yoyo(true, 1000)
        
        if(lives !== 0){
            game.time.events.add(1500,function(){
                emojys.alpha = 0
                animal.setAnimationByName(0, "WALK", true)
                game.add.tween(animal).to({x: -250}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
                    animal.x = game.world.width + 350
                    initGame()
                })
            },this)
        }
    }
    
    function initGame(){
        
        buttonsGroup.setAll("tint", 0x606060)
        rand = 0//getRand()
        textGroup.text.setText(textGroup.words[rand])
        index = 3//game.rnd.integerInRange(0, animalsGroup.children[rand].length - 1)
        animalsGroup.setAll("alpha", 0)
        animalsGroup.children[rand].alpha = 1
        changeImage(index, animalsGroup.children[rand])
        var animal = animalsGroup.children[rand].children[index]
        animal.setAnimationByName(0, "WALK", true)
        
        var delay = 0
        
        game.add.tween(animal).to({x: game.world.centerX + 120}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
            animal.setAnimationByName(0, "IDLE", true)
            emojys.x = game.world.centerX - animal.width * 0.7
            emojys.y = game.world.height - 150 - animal.height * 0.7
            if(pointsBar.number > 9){
                delay = scramble()
            }
            game.time.events.add(delay,function(){
                buttonsGroup.setAll("tint", 0xffffff)
                emojys.alpha = 1
                emojys.setAnimationByName(0, "CONFUCED", true)
                gameActive = true
            },this)
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 2)
        if(x === rand)
            return getRand()
        else
            return x     
    }
    
    function scramble(){
        
        Phaser.ArrayUtils.shuffle(buttonsGroup.posX)
                 
        game.add.tween(buttonsGroup).to({alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
            
            for(var i = 0; i < buttonsGroup.length - 1; i++){
                buttonsGroup.children[i].x = buttonsGroup.posX[i]
                buttonsGroup.buttonsName.children[i].x = buttonsGroup.posX[i]
            }
            
            if(pointsBar.number > 19){
                buttonsGroup.buttonsName.alpha = 0
            }
            
            game.add.tween(buttonsGroup).to({alpha: 1}, 500, Phaser.Easing.linear, true)
        })
        
        return 1100
    }
	
	return {
		
		assets: assets,
		name: "wildFeed",
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
            
            initialize()
            wildSong = sound.play("wildSong", {loop:true, volume:0.6})
            
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
            noahArk()
            createText()
            superSizeMe()
            createParticles()
			
			buttons.getButton(wildSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()