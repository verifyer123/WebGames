
var soundsPath = "../../shared/minigames/sounds/"
var vs = function(){
    
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
                name: "atlas.vs",
                json: "images/vs/atlas.json",
                image: "images/vs/atlas.png",
            },
        ],
        images: [
			{   name:"background",
				file: "images/vs/fondo.png"},
		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
            {	name: "cut",
				file: soundsPath + "cut.mp3"},
            {	name: "wrong",
				file: soundsPath + "wrong.mp3"},
            {	name: "explosion",
				file: soundsPath + "laserexplode.mp3"},
			{	name: "pop",
				file: soundsPath + "pop.mp3"},
			{	name: "shoot",
				file: soundsPath + "shoot.mp3"},
			{	name: "gameLose",
				file: soundsPath + "gameLose.mp3"},
			{	name: "energyCharge2",
				file: soundsPath + "energyCharge2.mp3"},
			
			
		],
    }
    
        
    var lives = null
	var sceneGroup = null
	var background, stars
    var gameActive = true
	var shoot
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
	var vsSpine
	var whiteFade
	var spineList
	var characterGroup
	var characterList
	
	var colorsGradient = {
    	fire:0xff2e2e,
		water:0x436bff,
		wind:0xfffd73,
		earth:0x4cff39
    }
	

	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        lives = 1

        
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
        game.add.tween(sceneGroup).to({alpha:1},500, Phaser.Easing.Cubic.Out,true)
		
		sound.play("energyCharge2")
		
		game.time.events.add(1000,function(){
			
			vsSpine.alpha = 1
			vsSpine.setAnimationByName(0,"START",false)
			vsSpine.addAnimationByName(0,"IDLE",true)
			
			vsSpine.tween = game.add.tween(vsSpine.scale).to({x:0.95,y:1.05},350,"Linear",true,0,-1)
			vsSpine.tween.yoyo(true,0)
			
			var posFromX = -game.world.width * 0.5
			var posFromY = game.world.height * 1.5
			for(var i = 0; i < characterGroup.length;i++){
				
				var character = characterGroup.children[i]
				character.alpha = 1
				game.add.tween(character).from({x:posFromX,y:posFromY},200,"Linear",true)
				
				posFromX+= game.world.width * 2
				posFromY-= game.world.height * 2
			
			}
			
			game.time.events.add(200,function(){
				
				whiteFade.alpha = 1
				game.add.tween(whiteFade).to({alpha:0},300,"Linear",true)
				
				var spine = characterGroup.children[1].anim
				characterGroup.children[1].remove(spine)
				sceneGroup.add(spine)
				spine.x = game.world.centerX + 160
				spine.y = game.world.centerY - 50
				spine.scale.x*=-1
				
				var textUp = characterGroup.children[1].text
				characterGroup.children[1].remove(textUp)
				textUp.x = game.world.centerX + 175
				textUp.y = game.world.centerY - 25
				textUp.scale.x*=-1
				sceneGroup.add(textUp)
				
				sceneGroup.remove(whiteFade)
				sceneGroup.add(whiteFade)
				
				game.stage.backgroundColor = "#ffffff";
				
				game.time.events.add(6000,function(){
					
					game.add.tween(sceneGroup.scale).to({x:2,y:2},500,"Linear",true)
					sound.play("energyCharge2")
					//game.add.tween(whiteFade).to({alpha:1},500,"Linear",true)
					game.add.tween(sceneGroup).to({alpha:0, x:-game.world.width * 0.5,y:-game.world.height * 0.45},500,"Linear",true).onComplete.add(function(){
						
						spaceSong.stop()
						sceneloader.show("battle")
					})
				})
			})
						
		})

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
    
    function stopGame(win){
        
		sound.play("wrong")
		sound.play("gameLose")
		
        gameActive = false
        spaceSong.stop()
        		
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
        
        game.load.spine('vs', "images/spines/vsLight/VS.json")  
        game.load.audio('spaceSong', soundsPath + 'songs/versusSong.mp3');
		
		console.log(localization.getLanguage() + ' language')

		// for(var i = 0; i < spineList.length;i++){
		//
		// 	var character = spineList[i]
		// 	game.load.spine(character.name,character.dir)
		// }
        
    }
    
    function releaseButton(obj){
        
        obj.parent.children[1].alpha = 1
    }

	function createBackground(){
		
		background = game.add.tileSprite(0,0,game.world.width,game.world.height,'atlas.vs','gradiente_versus')
		sceneGroup.add(background)
		
		var tween = game.add.tween(background.scale).to({y:1.5},3000,Phaser.Easing.Cubic.In,true,0,-1)
		tween.yoyo(true,0)
		
		stars = game.add.tileSprite(game.world.centerX,game.world.centerY,game.world.width * 2,game.world.height*2,'atlas.vs','stars_versus')
		stars.anchor.setTo(0.5,0.5)
		sceneGroup.add(stars)
	}
	
	function update(){
		
		stars.tilePosition.x-= 3
		stars.tilePosition.y-= 3
		
		
		//stars.angle++
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
    
    function createPart(key,obj,offsetX){
        
        var offX = offsetX || 0
        var particle = lookParticle(key)
		
        if(particle){
            
            particle.x = obj.world.x + offX
            particle.y = obj.world.y
            particle.scale.setTo(1,1)
            //game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            //game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            particle.start(true, 1500, null, 6);
			
			game.add.tween(particle).to({alpha:0},500,"Linear",true,1000).onComplete.add(function(){
				deactivateParticle(particle,0)
			})
			
        }
        
        
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

				particle.makeParticles('atlas.vs',tag);
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
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        whiteFade.endFill()
		
		whiteFade = new Phaser.Graphics(game)
        whiteFade.beginFill(0xffffff)
        whiteFade.drawRect(0,0,game.world.width * 2, game.world.height * 2)
        whiteFade.alpha = 0
        whiteFade.endFill()
		sceneGroup.add(whiteFade)

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
		
        var exp = sceneGroup.create(0,0,'atlas.vs','cakeSplat')
        exp.x = posX
        exp.y = posY
        exp.anchor.setTo(0.5,0.5)

        exp.scale.setTo(6,6)
        game.add.tween(exp.scale).from({x:0.4,y:0.4}, 400, Phaser.Easing.Cubic.In, true)
        var tweenAlpha = game.add.tween(exp).to({alpha:0}, 300, Phaser.Easing.Cubic.In, true,100)
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.vs','smoke');
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
	
	function inputButton(obj){
		
		if(!gameActive){
			return
		}
		
	}
	
	function setCharacters(characters){
		
		spineList = []
		
		for(var i = 0; i < characters.length;i++){
			
			var character = characters[i]
			spineList[i]= {}
			spineList[i].id = character.data.id
			spineList[i].name = character.data.name
			spineList[i].dir = character.data.directory
			spineList[i].scale = character.data.spine.options.scale
			spineList[i].element = character.data.stats.element
		}
		
		console.log(spineList + ' list')
	}
	
	function createVsEffect(){
		
		vsSpine = game.add.spine(game.world.centerX,game.world.centerY - 25,"vs")
		vsSpine.setSkinByName("normal")
		vsSpine.alpha = 0
		sceneGroup.add(vsSpine)
	}
	
	function createCharacters(){
		
		characterGroup = game.add.group()
		sceneGroup.add(characterGroup)
		
		Phaser.ArrayUtils.shuffle(colorsGradient)
		
		var pivotX = game.world.centerX - 150
		var pivotY = game.world.centerY + 175
		for(var i = 0; i < spineList.length;i++){
			
			var group = game.add.group()
			group.alpha = 0
			group.x = pivotX
			group.y = pivotY
			characterGroup.add(group)
			
			var gradient = group.create(3.5,-2,'atlas.vs','container_gradient')
			gradient.anchor.setTo(0.5,0.5)
			
			var back = group.create(0,0,'atlas.vs','container_border')
			back.anchor.setTo(0.5,0.5)
			
			var char = spineList[i]
			var spine = game.add.spine(0,110,char.id)
			spine.setSkinByName("normal")
			spine.setAnimationByName(0,"IDLE",true)
			spine.scale.setTo(char.scale * 0.9,char.scale * 0.9)
			group.anim = spine
			group.add(spine)
			gradient.tint = colorsGradient[char.element]
			
			var groupName = game.add.group()
			groupName.x = 35
			groupName.y = 150
			group.add(groupName)
			
			var fontStyle = {font: "35px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
			var textName = new Phaser.Text(sceneGroup.game, 0, 27, char.name, fontStyle)
			textName.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
			textName.anchor.setTo(0.5,0.5)
			
			var rect = new Phaser.Graphics(game)
			rect.beginFill(0x000000)
			rect.drawRoundedRect(0,0,textName.width +40,50)
			rect.x-= rect.width * 0.5
			rect.endFill()
			groupName.add(rect)
			
			groupName.add(textName)
			group.text = groupName
			
			groupName.scale.setTo(0.9,0.9)
			if(char.name.length >= 10){
				groupName.scale.setTo(0.75,0.75)
			}
			
			
			if(i==1){
				group.scale.x*=-1
				groupName.scale.x*=-1
			}
			
			pivotX+= 300
			pivotY-= 350
			
		}
	}
	
	return {
		
		assets: assets,
		name: "vs",
		update: update,
        preload:preload,
		setCharacters:setCharacters,
		create: function(event){
            
			var preloadAlpha = document.getElementById("preloadBattle");
        	preloadAlpha.style.visibility = "hidden";
			
			sceneGroup = game.add.group()
			
			createBackground()
			createCharacters()
			createVsEffect()
			
			addParticles()
                        	
            spaceSong = game.add.audio('spaceSong')
            game.sound.setDecodedCallback(spaceSong, function(){
				game.time.events.add(1000,function(){
					spaceSong.loopFull(0.8)
				})
                
            }, this);
            
            game.onPause.add(function(){
                game.sound.mute = true
            } , this);

            game.onResume.add(function(){
                game.sound.mute = false
            }, this);
            
            initialize()
			
			buttons.getButton(spaceSong,sceneGroup)
            
            animateScene()
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()