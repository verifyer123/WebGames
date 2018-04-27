
var soundsPath = "https://play.yogome.com/shared/minigames/sounds/"
var tutorialPath = "https://play.yogome.com/shared/minigames/"
var forestJustice = function(){
    
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
                name: "atlas.forestJustice",
                json: "images/forestJustice/atlas.json",
                image: "images/forestJustice/atlas.png",
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
				file:"images/forestJustice/tutorial_image_%input.png"
			}

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrongAnswer.mp3"},
            {	name: "flesh",
				file: soundsPath + "flesh.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
            {	name: "grunt",
				file: soundsPath + "grunt.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
            {   name: 'justiceSong',
                file: soundsPath + 'songs/technology_action.mp3'
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
				name:"justice",
				file:"images/spines/justice/justice.json"
			},
            {
				name:"lumberjack",
				file:"images/spines/lumberJack/lumberjack.json"
			},
            {
				name:"trees",
				file:"images/spines/trees/trees.json"
			}
		]
    }
    
        
    var lives = null
	var sceneGroup = null
    var gameActive
	var particlesGroup, particlesUsed
    var gameIndex = 169
    var tutoGroup
    var justiceSong
    var coin
    var treesGroup
    var lumberjackGroup
    var justice
    var timeToCut
    var isMoving
    var numOfTrees
    var counter
    var tile
    var stoneGroup, secondStoneGroup
    var roundCount
    
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 3
        gameActive = false
        isMoving = false
        timeToCut = 9000
        numOfTrees = 3
        counter = 0
        roundCount = 0
        
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
    
    function missPoint(){
        
        sound.play("wrong")
		        
        lives--;
        heartsGroup.text.setText('X ' + lives)
        
        var scaleTween = game.add.tween(heartsGroup.scale).to({x: 0.7,y:0.7}, 200, Phaser.Easing.linear, true)
        scaleTween.onComplete.add(function(){
            game.add.tween(heartsGroup.scale).to({x: 1,y:1}, 200, Phaser.Easing.linear, true)
        })
        
        if(lives == 0){
            gameActive = false
            justice.anim.setAnimationByName(0, "lose", true)
            justice.anim.addAnimationByName(0, "losestill", true)
            game.time.events.add(1000,function(){
                stopGame(false)
            },this)
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
        
        var pointsImg = pointsBar.create(-10,10,'atlas.forestJustice','xpcoins')
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

        var heartImg = group.create(0,0,'atlas.forestJustice','life_box')

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
        justiceSong.stop()
        		
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
        
        tile = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'atlas.forestJustice', 'tile')
        sceneGroup.add(tile)
        
        stoneGroup = game.add.group()
        sceneGroup.add(stoneGroup)
        
        secondStoneGroup = game.add.group()
        secondStoneGroup.x = game.world.width
        sceneGroup.add(secondStoneGroup)
        
        for(var i = 0; i < 10; i++){
            
            stoneGroup.create(game.world.randomX, game.world.randomY, 'atlas.forestJustice', 'stone')
            secondStoneGroup.create(game.world.randomX, game.world.randomY, 'atlas.forestJustice', 'stone')
        }
    }

	function update(){
        
        if(gameActive){
            
            justice.anim.x = justice.collider.x
            justice.anim.y = justice.collider.y + 50

            if(Phaser.Rectangle.intersects(justice.collider, justice.movil))
            {
                justice.movil.body.velocity.setTo(0, 0)
                justice.collider.body.velocity.setTo(0, 0)

                if(isMoving){
                    justice.anim.setAnimationByName(0, "idle", true)
                    isMoving = false
                }
            }

            for(var i = 0; i < numOfTrees; i++){
                game.physics.arcade.overlap(justice.collider, treesGroup.children[i].tree, stopLumberjack, null, this)
            }
            
            if(counter === numOfTrees){
                gameActive = false
                
                game.time.events.add(1000,function(){
                    if(lives !== 0){
                        restartElements()
                    }
                },this)
            }
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
        particle.makeParticles('atlas.forestJustice',key);
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

				particle.makeParticles('atlas.forestJustice',tag);
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
		
        var exp = sceneGroup.create(0,0,'atlas.forestJustice','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.forestJustice','smoke');
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
        coin.scale.setTo(0.8)
        coin.animations.add('coin');
        coin.animations.play('coin', 24, true);
        coin.alpha = 0
        sceneGroup.add(coin)
    }

    function addCoin(objectBorn){
        
        coin.x = objectBorn.centerX
        coin.y = objectBorn.centerY
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
    
    function theLastMarchOfTheEnts(){
        
        treesGroup = game.add.group()
        sceneGroup.add(treesGroup)
        
        for(var i = 0; i < 10; i++){
        
            var subGroup = game.add.group()
            subGroup.alpha = 0
            subGroup.type = game.rnd.integerInRange(1, 2)
            treesGroup.add(subGroup)

            var tree = subGroup.create(0, 0, "atlas.forestJustice", "tree" + subGroup.type)
            tree.anchor.setTo(0.5, 1)
            tree.saved = false
            game.physics.arcade.enable(tree)
            subGroup.tree = tree

            var anim = game.add.spine(0, 0, "trees")
            anim.setAnimationByName(0, "beingcut_tree" + subGroup.type, true)
            anim.setSkinByName("normal")
            anim.scale.setTo(0.55)
            anim.alpha = 0
            subGroup.add(anim)
            subGroup.anim = anim

            var lifeContainer = subGroup.create(tree.centerX, tree.centerY - 100, "atlas.forestJustice", "lifeContainer")
            lifeContainer.anchor.setTo(0.5)
            lifeContainer.scale.setTo(3)
            subGroup.lifeContainer = lifeContainer

            var lifeBar = subGroup.create(lifeContainer.centerX - lifeContainer.width * 0.4, lifeContainer.centerY, "atlas.forestJustice", "lifeBar")
            lifeBar.anchor.setTo(0, 0.5)
            lifeBar.scale.setTo(3)
            subGroup.lifeBar = lifeBar
        }
    }
    
    function treesEnemies(){
        
        lumberjackGroup = game.add.group()
        sceneGroup.add(lumberjackGroup)
        
        for(var i = 0; i < 10; i++){
            
            var anim = game.add.spine(-10, -50, "lumberjack")
            anim.setAnimationByName(0, "run", true)
            anim.setSkinByName("normal")
            anim.scale.setTo(0.9)
            anim.origin = -10
            lumberjackGroup.add(anim)
        }
    }
    
    function myNameIsTheLaw(){
        
        justice = game.add.group()
        justice.speed = 300
        sceneGroup.add(justice)
        
        var anim = game.add.spine(game.world.centerX, 150, "justice")
        anim.setAnimationByName(0, "idle", true)
        anim.setSkinByName("normal")
        anim.scale.setTo(0.9)
        justice.add(anim)
        justice.anim = anim
        
        var movil = justice.create(game.world.centerX, 100, 'atlas.forestJustice', 'star')
        movil.anchor.setTo(0.5)
        //movil.scale.setTo(0.6)
        movil.alpha = 0
        game.physics.enable(movil, Phaser.Physics.ARCADE)
        justice.movil = movil
        
        var collider = justice.create(game.world.centerX, 100, 'atlas.forestJustice', 'smoke')
        collider.anchor.setTo(0.5)
        collider.scale.setTo(0.6)
        collider.alpha = 0
        game.physics.arcade.enable(collider)
        justice.collider = collider
        
        game.input.onDown.add(clickDown,this)
    }
    
    function clickDown(){
        
       if(gameActive){
           
           sound.play('pop')
           justice.movil.x = game.input.x
           justice.movil.y = game.input.y
           game.physics.arcade.moveToObject(justice.collider, justice.movil, justice.speed)
           
           if(justice.collider.x - justice.movil.x < 0){
               justice.anim.scale.setTo(0.9)
           }
           else{
               justice.anim.scale.setTo(-0.9, 0.9)
           }
           
           justice.anim.setAnimationByName(0, "run", true)
           isMoving = true
       }    
    }
    
    function initGame(){
        
        var timer = growTrees()
        
        game.time.events.add(timer,function(){
            bringThePain()
        },this)
    }
    
    function growTrees(){
        
        var space = (game.world.height - 250)/numOfTrees
        var pivot = space + 200
        var delay = 250
        
        for(var i = 0; i < numOfTrees; i++){
        
            treesGroup.children[i].x = game.rnd.integerInRange(150, game.world.width - 150)
            treesGroup.children[i].y = pivot
            treesGroup.children[i].tree.scale.setTo(1) 
            treesGroup.children[i].tree.saved = false
            pivot += space
            
            popObject(treesGroup.children[i], delay)
            delay += 250
        }
        return delay + 100
    }
    
    function popObject(obj,delay){
         
        game.time.events.add(delay,function(){
            
            sound.play("cut")
            obj.alpha = 1
            game.add.tween(obj.scale).from({ y:0}, 300,Phaser.Easing.linear,true)
        },this)
    }
    
    function bringThePain(){
        
        for(var i = 0; i < numOfTrees; i++){
            
            lumberjackGroup.children[i].y = treesGroup.children[i].y
            lumberjackGroup.children[i].x = treesGroup.children[i].x
                
            if(i % 2 === 0){
                lumberjackGroup.children[i].scale.setTo(0.9)
                lumberjackGroup.children[i].origin = -60
                lumberjackGroup.children[i].x -= 70
            }
            else{
                lumberjackGroup.children[i].scale.setTo(-0.9, 0.9)
                lumberjackGroup.children[i].origin = game.world.width + 60
                lumberjackGroup.children[i].x += 70
            }
            
            bringLumber(i) 
        }
    }
    
    function bringLumber(i){
        
        var tree = treesGroup.children[i]
        var jack = lumberjackGroup.children[i]
        
        jack.setAnimationByName(0, "run", true)
        
         game.add.tween(jack).from({x: jack.origin}, 1000, Phaser.Easing.linear, true).onComplete.add(function(){
            jack.setAnimationByName(0, "cut", true)
            tree.tree.alpha = 0
            tree.tree.scale.setTo(0.7) 
            tree.anim.alpha = 1
            gameActive = true
             
            tree.tweenToCut = game.add.tween(tree.lifeBar.scale).to({x:0}, timeToCut, Phaser.Easing.linear, true)
             
            tree.tweenToCut.onComplete.add(function(){
                
                tree.anim.setAnimationByName(0, "cut_tree" + tree.type, false)
                sound.play('flesh')
                tree.lifeContainer.alpha = 0
                tree.tree.saved = true
                jack.setAnimationByName(0, "walk", true)
                goHomeJack(i)
                particleWrong.x = tree.centerX
                particleWrong.y = tree.centerY
                particleWrong.start(true, 1200, null, 6)
                counter++
                
                if(lives > 0){
                    missPoint()
                }
            })
        })
    }
    
    function goHomeJack(index){
        
        var jack = lumberjackGroup.children[index]
        
        if(index % 2 !== 0){
            jack.scale.setTo(0.9)
        }
        else{
            jack.scale.setTo(-0.9, 0.9)
        }
        game.add.tween(jack).to({x: jack.origin}, 2000, Phaser.Easing.linear, true)
    }
    
    function stopLumberjack(just, tree){
        
        var index = treesGroup.getChildIndex(tree.parent)
        
        if(!tree.saved && !isMoving && gameActive){
            
            counter++
            justice.movil.body.velocity.setTo(0, 0)
            justice.collider.body.velocity.setTo(0, 0)
            
            justice.anim.setAnimationByName(0, "stop_lumberjack", true)
            game.time.events.add(1000,function(){
                justice.anim.addAnimationByName(0, "idle", true)
            },this)
            
            tree.saved = true
            tree.parent.tweenToCut.stop()
            tree.scale.setTo(1) 
            tree.alpha = 1
            tree.parent.anim.alpha = 0
            sound.play('grunt')
            lumberjackGroup.children[index].setAnimationByName(0, "lose", true)
            lumberjackGroup.children[index].addAnimationByName(0, "losestill", true)
            addCoin(tree.parent)
            particleCorrect.x = tree.parent.centerX
            particleCorrect.y = tree.parent.centerY
            particleCorrect.start(true, 1200, null, 6)
            
            game.time.events.add(1000,function(){
                goHomeJack(index)
            },this)
        }
    }
    
    function restartElements(){
        
        var aux
        roundCount++
        counter = 0
           
        
        if(numOfTrees < 8){
            
            numOfTrees++
            
            if(timeToCut < 1000){
                timeToCut -= 1000
            }
        }
        else{
            timeToCut = 6000
        }
        
        
        game.time.events.add(1500,function(){
            
            for(var i = 0; i < numOfTrees; i++){
                game.add.tween(treesGroup.children[i]).to({x: treesGroup.children[i].x - game.world.width}, 2000, Phaser.Easing.linear, true)
            }
            
             game.time.events.add(1990,function(){
                 
                for(var i = 0; i < numOfTrees; i++){
                    treesGroup.children[i].x = 0
                    treesGroup.children[i].y = 0
                    treesGroup.children[i].alpha = 0
                    treesGroup.children[i].tree.saved = false
                    treesGroup.children[i].tree.scale.setTo(1)
                    treesGroup.children[i].tree.alpha = 1
                    treesGroup.children[i].lifeContainer.alpha = 1
                    treesGroup.children[i].anim.alpha = 0
                    treesGroup.children[i].anim.setAnimationByName(0, "beingcut_tree" + treesGroup.children[i].type, true)
                    treesGroup.children[i].lifeBar.scale.setTo(3)
                }
             },this)   
            
            justice.anim.setAnimationByName(0, "run", true)
            justice.anim.scale.setTo(0.9)
            
            game.add.tween(tile.tilePosition).to({x: -game.world.width}, 2000, Phaser.Easing.linear, true)
            game.add.tween(stoneGroup).to({x: -game.world.width}, 2000, Phaser.Easing.linear, true)
            game.add.tween(secondStoneGroup).to({x: 0}, 2000, Phaser.Easing.linear, true)
            game.add.tween(justice.anim).to({x: game.world.centerX, y: 150}, 2000, Phaser.Easing.linear, true).onComplete.add(function(){
                
                justice.anim.setAnimationByName(0, "idle", true)
                
                justice.movil.body.velocity.setTo(0, 0)
                justice.collider.body.velocity.setTo(0, 0)

                justice.collider.x =  justice.anim.x
                justice.collider.y =  justice.anim.y - 50

                justice.movil.x =  justice.anim.x
                justice.movil.y =  justice.anim.y - 50
                
                aux = stoneGroup
                stoneGroup = secondStoneGroup
                secondStoneGroup = aux
                
                stoneGroup.x = 0
                secondStoneGroup.x = game.world.width
                tile.tilePosition.x = 0
                    
                initGame()
            })
        },this)    
    }
	
	return {
		
		assets: assets,
		name: "forestJustice",
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
            justiceSong = sound.play("justiceSong", {loop:true, volume:0.6})
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			            
			createPointsBar()
			createHearts()
            treesEnemies()
            theLastMarchOfTheEnts()
            myNameIsTheLaw()
            initCoin()
            createParticles()
			
			buttons.getButton(justiceSong,sceneGroup)
            createTutorial()
            
            animateScene()
            
		}
	}
}()