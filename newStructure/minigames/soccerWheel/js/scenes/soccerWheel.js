
var soundsPath = "../../shared/minigames/sounds/"
var tutorialPath = "../../shared/minigames/"
var soccerWheel = function(){
    
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
                name: "atlas.soccerWheel",
                json: "images/soccerWheel/atlas.json",
                image: "images/soccerWheel/atlas.png",
            },
            {   
                name: "atlas.tutorial",
                json: tutorialPath+"images/tutorial/tutorial_atlas.json",
                image: tutorialPath+"images/tutorial/tutorial_atlas.png"
            }
        ],
        images: [
            {
				name:'ball',
				file:"images/soccerWheel/soccer/ball.png"
			},
            {
				name:'field',
				file:"images/soccerWheel/soccer/field.png"
			},
            {
				name:'foul',
				file:"images/soccerWheel/soccer/foul.png"
			},
            {
				name:'goal',
				file:"images/soccerWheel/soccer/goal.png"
			},
            {
				name:'penalty',
				file:"images/soccerWheel/soccer/penalty.png"
			},
            {
				name:'player',
				file:"images/soccerWheel/soccer/player.png"
			},
            {
				name:'red',
				file:"images/soccerWheel/soccer/red_card.png"
			},
            {
				name:'referee',
				file:"images/soccerWheel/soccer/referee.png"
			},
            {
				name:'score',
				file:"images/soccerWheel/soccer/score.png"
			},
            {
				name:'whistle',
				file:"images/soccerWheel/soccer/whistle.png"
			},
            {
				name:'yellow',
				file:"images/soccerWheel/soccer/yellow_card.png"
			},

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
            {   name: 'soccerSong',
                file: soundsPath + 'songs/timberman.mp3'
            }
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
				name:"ball",
				file:"images/spines/ball/ball.json"
			},
            {
				name:"cards",
				file:"images/spines/cards/cards.json"
			},
            {
				name:"foul",
				file:"images/spines/foul/foul.json"
			},
            {
				name:"goal",
				file:"images/spines/goal/goal.json"
			},
            {
				name:"penalty",
				file:"images/spines/penalty/penalty.json"
			},
            {
				name:"player",
				file:"images/spines/player/player.json"
			},
            {
				name:"referee",
				file:"images/spines/referee/referee.json"
			},
            {
				name:"whistle",
				file:"images/spines/whistle/whistle.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 155
    var tutoGroup
    var soccerSong
    var coin
    var items = ['ball', 'field', 'foul', 'goal', 'penalty', 'player', 'red', 'referee', 'score', 'whistle', 'yellow']
    var tvGroup
    var namesGroup
    var wheelGroup
    var rand
    var arrow
    var speed
    var lvl
    var shadow
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        rand = -1
        speed = 1
        lvl = 0
        
        loadSounds()
        
        if(localization.getLanguage() === 'EN'){
            words = ['Ball',
                     'Field',
                     'Foul',
                     'Goal',
                     'Penalty',
                     'Player',
                     'Red Card',
                     'Referee',
                     'Score',
                     'Whistle',
                     'Yellow Card']
        }
        else{
            words = ['Balón',
                     'Cancha',
                     'Lesión',
                     'Portería',
                     'Penal',
                     'Jugador',
                     'Tarjeta Roja',
                     'Árbitro',
                     'Marcador',
                     'Silbato',
                     'Tarjeta Amarilla']
        }
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.soccerWheel','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.soccerWheel','life_box')

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
        soccerSong.stop()
        		
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
        game.load.image('tutorial_image', "images/soccerWheel/gametuto" + localization.getLanguage() + ".png")
        
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
        
        sceneGroup.add(game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.soccerWheel', 'tile'))
        
        var back = sceneGroup.create(-50, 0, 'atlas.soccerWheel', 'background')
        back.width = game.world.width + 100
        back.height = game.world.height
    }

	function update(){
      
        if(gameActive){
            
            wheelGroup.angle += speed
            //console.log(wheelGroup.angle)
            if(wheelGroup.angle > 360 || wheelGroup.angle < -360)
                wheelGroup.angle = 0
        }
        
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
        particle.makeParticles('atlas.soccerWheel',key);
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

				particle.makeParticles('atlas.soccerWheel',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.soccerWheel','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.soccerWheel','smoke');
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

    function addCoin(objectBorn){
        
        coin.x = game.world.centerX
        coin.y = game.world.centerY
        time = 300

        game.add.tween(coin).to({alpha:1}, time, Phaser.Easing.linear, true)
        
        game.add.tween(coin).to({y:coin.y - 100}, time + 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
           game.add.tween(coin).to({x: pointsBar.centerX, y:pointsBar.centerY}, 200, Phaser.Easing.Cubic.InOut,true).onComplete.add(function(){
               game.add.tween(coin).to({alpha:0}, 200, Phaser.Easing.Cubic.In, true).onComplete.add(function(){
                   addPoint(1)
               })
           })
        })
    }
    
    function TV(){
        
        var screen = sceneGroup.create(game.world.centerX, game.world.centerY - 100, 'atlas.soccerWheel', 'screen')
        screen.anchor.setTo(0.5, 1)
        //screen.scale.setTo(1.2)
        
        tvGroup = game.add.group()
        sceneGroup.add(tvGroup)
        
        for(var i = 0; i < items.length; i++){
            var item = tvGroup.create(screen.centerX, screen.centerY, items[i])
            item.anchor.setTo(0.5)
            item.scale.setTo(0.8)
            item.alpha = 0
        }
    }
    
    function sayMyName(){
        
        namesGroup = game.add.group()
        namesGroup.x = game.world.centerX
        namesGroup.y = game.world.centerY - 50
        sceneGroup.add(namesGroup)
        
        var bar = namesGroup.create(0, 0, 'atlas.soccerWheel', 'bar')
        bar.scale.setTo(1, 0.7)
        bar.anchor.setTo(0.5)
        
        var fontStyle = {font: "42px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        
        var name = new Phaser.Text(sceneGroup.game, bar.centerX, bar.centerY, '0', fontStyle)
        name.anchor.setTo(0.5, 0.4)
        name.setText('')
        name.stroke = "#000000"
        name.strokeThickness = 10
        namesGroup.add(name)
        namesGroup.text = name
    }
   
    function fortuneWheel(){
        
        var fontStyle = {font: "27px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var wheelText
         
        if(localization.getLanguage() === 'ES'){
            wheelText = ['         Ball',
                         '        Field',
                         '         Foul',
                         '        Goal',
                         '       Penalty',
                         '        Player',
                         '     Red Card',
                         '       Referee',
                         '        Score',
                         '       Whistle',
                         '        Yellow Card']
        }
        else{
            wheelText = ['        Balón',
                         '       Cancha',
                         '        Lesión',
                         '      Portería',
                         '        Penal',
                         '      Jugador',
                         '       Tarjeta Roja',
                         '       Árbitro',
                         '     Marcador',
                         '       Silbato',
                         '     Tarjeta Amarilla']
        }
        
        shadow = sceneGroup.create(game.world.centerX -10, game.world.height - 230, 'atlas.soccerWheel', 'shadow')
        shadow.anchor.setTo(0.5)
        shadow.scale.setTo(0.9)
            
        wheelGroup = game.add.group()
        wheelGroup.x = game.world.centerX
        wheelGroup.y = game.world.height - 240
        wheelGroup.angle = (32.72 * 0.5)
        sceneGroup.add(wheelGroup)
        
        var wheel = wheelGroup.create(0, 0, 'atlas.soccerWheel', 'wheel')
        wheel.anchor.setTo(0.5)
        wheel.scale.setTo(0.9)
        wheelGroup.wheel = wheel
        
        arrow = sceneGroup.create(wheelGroup.centerX , wheelGroup.centerY - 80, 'atlas.soccerWheel', 'stop')
        arrow.anchor.setTo(0.5, 1)
        arrow.scale.setTo(0.9)
        //arrow.angle = 90
        //arrow.alpha = 0.5
        arrow.inputEnabled = true
        arrow.events.onInputDown.add(stopWheel ,this)
        arrow.tint = 0x505050 
         
        for(i = 0 ; i < 11; i++){
            
            var name = new Phaser.Text(sceneGroup.game, 0, 0, '0', fontStyle)
            name.anchor.setTo(0, 0.4)
            name.setText(wheelText[i])
            name.stroke = "#000000"
            name.strokeThickness = 5
            name.angle = (i * 32) - (10 - i)
            name.word = words[i]
            wheelGroup.add(name)
		}
        
        if(localization.getLanguage() === 'ES'){
            wheelGroup.children[11].style.font = "22px VAGRounded"
        }
        else{
            wheelGroup.children[11].style.font = "20px VAGRounded"
            wheelGroup.children[7].style.font = "22px VAGRounded"
        }
        
    }
    
    function stopWheel(){
        
        if(gameActive){
            sound.play('pop')
            gameActive = false
            arrow.tint = 0x505050 
            
            var twist = true
            if(speed < 0)
                twist = false
            
            var ans = getPosition(twist)
            win(ans)
        }
    }
    
    function getPosition(twist){
        
        var spin = 32.72
        var initAng = (32.72 * 0.5) 
        var ang = Math.abs(wheelGroup.angle)
      
        for(var s = 0; s < 11; s++){
          
            if(ang < initAng + (spin * 0.5) && ang > initAng - (spin * 0.5)){
                if(twist){
                    return (8 - s)
                }
                else{
                    return (s - 2)
                }
                break
            }
            else{
                initAng += spin 
            }
            
            if(initAng >= 360)
                initAng = 0
        }
        return 1
    }
    
    function win(ans){
        
        var rise = false
        
        if(ans === -2){
            ans = 9
        }
        else if(ans === -1){
            ans = 10
        }
       
        if(rand === ans){
            addCoin()
            if(pointsBar.number !== 0 && pointsBar.number % 10 === 0){
                rise = true
                if(lvl < 3)
                    lvl++
            }
        }
        else{
            missPoint()
        }
        
        namesGroup.text.setText('')
        digitalTV(rise)
    }
    
    function digitalTV(rise){
        
        var anim = ['ball', '', 'foul', 'goal', 'penalty', 'player', 'cards', 'referee', '', 'whistle', 'cards']
        
        if(rand === 1 || rand === 8){
            game.add.tween(tvGroup.children[rand]).to({ angle: 360}, 800, Phaser.Easing.linear, true)
            game.add.tween(tvGroup.children[rand]).to({ alpha: 0}, 1200, Phaser.Easing.linear, true).onComplete.add(function(){
                tvGroup.children[rand].angle = 0
            })
        }
        else{
            game.add.tween(tvGroup.children[rand]).to({ alpha: 0}, 500, Phaser.Easing.linear, true)
            
            var animation = game.add.spine(wheelGroup.centerX, wheelGroup.centerY + 150, anim[rand])
            animation.scale.setTo(1.3)
            
            if(rand === 6){
                animation.setAnimationByName(0, "red_card", true)
            }
            else if(rand === 10){
                animation.setAnimationByName(0, "yellow_card", true)
            }
            else{
                animation.setAnimationByName(0, "idle", true)
            }
            
            animation.setSkinByName("normal")
            sceneGroup.add(animation)
            
            game.time.events.add(1500,function(){
                game.add.tween(animation).to({ alpha: 0}, 500, Phaser.Easing.linear, true)
            })
        }
        
        game.time.events.add(2300,function(){
            if(lives !== 0)
                initGame(rise)
        })
        
    }
    
    function initGame(rise){
 
        var delay = 0
        rand = getRand()

        if(rise){
            delay = lvlTransition()
        }
        lvlUp(delay)
        
        game.time.events.add(delay,function(){
            changeImage(rand, tvGroup)
            sound.play('cut')
            game.add.tween(tvGroup.children[rand].scale).to({x:1.2, y:1.2}, 150, Phaser.Easing.linear, true,0,0).yoyo(true,0).onComplete.add(function(){
                sound.play('pop')
                namesGroup.text.setText(words[rand])
                game.add.tween(namesGroup.scale).to({x:1.2, y:1.2}, 150, Phaser.Easing.linear, true,0,0).yoyo(true,0).onComplete.add(function(){
                    game.time.events.add(600,function(){
                        arrow.tint = 0xffffff
                        gameActive = true
                    })
                })
            })
        })
    }
    
    function lvlTransition(){
          
        arrow.alpha = 0
        shadow.alpha = 0
        game.add.tween(wheelGroup).to({y: game.world.centerY}, 1000, Phaser.Easing.linear, true)
        game.add.tween(wheelGroup.scale).to({ x: 4, y: 4}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
            game.add.tween(wheelGroup).to({ alpha: 0}, 500, Phaser.Easing.linear, true).onComplete.add(function(){
                wheelGroup.scale.setTo(1)
                wheelGroup.y = game.world.centerY + 220
                arrow.alpha = 1
                game.add.tween(shadow).to({ alpha: 1}, 100, Phaser.Easing.linear, true)
                game.add.tween(wheelGroup).to({ alpha: 1}, 100, Phaser.Easing.linear, true)
            })
        })
        return 2300
    }
    
    function lvlUp(){
       
         switch(lvl){
                 
            case 1:
                randomTurn()
            break
            
            case 2:
                randomTurn()
                game.time.events.add(1000,function(){
                    namesGroup.alpha = 0
                })
            break
            
            case 3:
                if(speed < 8){
                    if(speed > 0)
                        speed++
                     else 
                        speed--
                }
                 
                randomTurn()
            break
         }
    }
    
    function randomTurn(){

        game.time.events.add(game.rnd.integerInRange(4000, 8000),function(){
            if(gameActive){
                speed *= -1
                randomTurn()
            }
        })
    }
    
    function getRand(){
        var x = game.rnd.integerInRange(0, 10)
        if(x === rand)
            return getRand()
        else
            return x     
    }
	
	return {
		
		assets: assets,
		name: "soccerWheel",
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
                        			
            /*soccerSong = game.add.audio('soccerSong')
            game.sound.setDecodedCallback(soccerSong, function(){
                soccerSong.loopFull(0.6)
            }, this);*/
            
            initialize()
            soccerSong = sound.play("soccerSong", {loop:true, volume:0.6})
            
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
            TV()
            sayMyName()
            fortuneWheel()
           
            createParticles()
			
			buttons.getButton(soccerSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()