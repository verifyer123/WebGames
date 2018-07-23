var soundsPath = "../../shared/minigames/sounds/"
var megablockTower = function(){

    assets = {
        atlases: [
            {   
                name: "atlas.game",
                json: "images/megablockTower/atlas.json",
                image: "images/megablockTower/atlas.png",
            },
        ],
        images: [
            {
                name:"arbusto",
                file:"images/megablockTower/arbusto.png"
            },
            {
                name:"mountains",
                file:"images/megablockTower/mountains.png"
            },
            {
                name:"pasto",
                file:"images/megablockTower/pasto.png"
            },
            {
                name:"pinos",
                file:"images/megablockTower/pinos.png"
            },
            {
                name:"tierra",
                file:"images/megablockTower/tierra.png"
            }

        ],
        sounds: [
            {   name: "magic",
                file: soundsPath + "magic.mp3"},
            {   name: "wrong",
                file: soundsPath + "wrong.mp3"},
            {   name: "pop",
                file: soundsPath + "pop.mp3"},
            {   name: "gameLose",
                file: soundsPath + "gameLose.mp3"},
            {   name: "punch",
                file: soundsPath + "punch1.mp3"},  
        ],
        
    }
    
    var INITIAL_LIVES = 3
    var ROPE_VELOCITY = 0.5
    var QUAD_FALLING_VELOCITY = 5
    var TOWER_VELOCITY = 3

    var DELTA_TOWER = 150
    var MIN_CHARACTERS_PER_FLOOR = 2
    var MAX_CHARACTERS_PER_FLOOR = 5
    var IN_TO_START_COMBO = 3
    var DELTA_COMBO = 2
    var MAX_COMBO = 8

    var OFFSET_EMOJI = {x:-40,y:-40}
    var CLOUD_MIN_VEL =0.5
    var CLOUD_MAX_VEL =1.5

    var DIVISOR_TOWER = 200
    var DELTA_FALL_VELOCITY = 0.05
    
    var gameIndex = 31
    var gameId = 100012
    var marioSong = null
    var sceneGroup = null
    var pointsGroup = null
    var gameActive = false
    var lives = null

    var particlesGroup
    var particlesUsed
    var heartsGroup = null

    var rope
    var lastQuad, currentQuad
    var canTouch
    var towerGroup, floorGroup

    var currentInCombo
    var currentCombo
    var peopleGroup
    var cloudGroup 
    var lastCloud
    var currentQuadVelocity, currentDivisor

    function loadSounds(){
        sound.decode(assets.sounds)
    }


    function initialize(){
        gameIndex = amazing.getId(gameId)
        game.stage.backgroundColor = "#ffffff"
        lives = INITIAL_LIVES
        canTouch = true
        currentInCombo = 0
        currentCombo = 1
        currentQuadVelocity = QUAD_FALLING_VELOCITY
        currentDivisor = DIVISOR_TOWER
    }
    

    
    function animateScene() {
                
        gameActive = false
        
        var startGroup = new Phaser.Group(game)
        sceneGroup.add(startGroup)        
        
        sceneGroup.alpha = 0
        game.add.tween(sceneGroup).to({alpha:1},400, Phaser.Easing.Cubic.Out,true)

        gameActive = true

    }
    
    
    function preload() {
        
        game.forceSingleUpdate = true
        game.stage.disableVisibilityChange = false;
                
        if(amazing.getMinigameId()){
            marioSong = sound.setSong(soundsPath + 'songs/timberman.mp3',0.3)
        }else{
            game.load.audio('arcadeSong', soundsPath + 'songs/timberman.mp3');
        }


    }

    
    function stopGame(win){

        heartsGroup.text.setText('X ' + 0)
        sound.play("gameLose")

        gameActive = false

        
        if(amazing.getMinigameId() && marioSong!=null){
            marioSong.pause()
        }else{
            marioSong.stop()
        }
                
        tweenScene = game.add.tween(sceneGroup).to({alpha: 0}, 500, Phaser.Easing.Cubic.In, true, 1500)
        tweenScene.onComplete.add(function(){
            
            var resultScreen = sceneloader.getScene("result")
            resultScreen.setScore(true, pointsBar.number,gameIndex)
        
            sceneloader.show("result")
        })
    }
    
    function addPoint(number,obj){
        
        //sound.play("pop")
        createPart('star', obj)
        createTextPart('+' + number, obj)
        
        pointsBar.number+= number

        pointsBar.text.setText(pointsBar.number)
   
    }

    function createPointsBar(){
        
        pointsBar = game.add.group()
        sceneGroup.add(pointsBar)
        
        var pointsImg = pointsBar.create(0,10,'atlas.game','xpcoins')
        pointsImg.x = game.world.width - pointsImg.width * 1.2
        pointsImg.width *=1
        pointsImg.height *=1
    
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 5, "0", fontStyle)
        pointsText.x = pointsImg.x + pointsImg.width * 0.75
        pointsText.y = pointsImg.height * 0.3
        pointsBar.add(pointsText)
        
        pointsBar.text = pointsText
        pointsBar.number = 0
        
    }

    function createHearts(){
        
        heartsGroup = game.add.group()
        heartsGroup.y = 10
        sceneGroup.add(heartsGroup)
        
        
        var pivotX = 15
        var group = game.add.group()
        group.x = pivotX
        heartsGroup.add(group)

        group.create(0,0,'atlas.game','life_box')

        pivotX+= 47
        
        var fontStyle = {font: "30px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = new Phaser.Text(sceneGroup.game, 0, 10, "0", fontStyle)
        pointsText.x = pivotX
        pointsText.y = 2
        pointsText.setText('X ' + lives)
        heartsGroup.add(pointsText)
        
        pointsText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
        
        heartsGroup.text = pointsText
                
    }
    
    
    function createTextPart(text,obj){
        
        var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
        var pointsText = lookParticle('textPart')
        
        if(pointsText){
            
            pointsText.x = obj.x
            pointsText.y = obj.y - 60
            pointsText.setText(text)

            game.add.tween(pointsText).to({y:pointsText.y - 75},750,Phaser.Easing.linear,true)
            game.add.tween(pointsText).to({alpha:0},500,Phaser.Easing.linear,true, 250)

            deactivateParticle(pointsText,750)
        }
        
    }
    
    function starParticles(obj,idString){
        
        particlesNumber = 8
            
        var particlesGood = game.add.emitter(0, 0, 100);

        particlesGood.makeParticles('atlas.game',idString);
        particlesGood.minParticleSpeed.setTo(-200, -50);
        particlesGood.maxParticleSpeed.setTo(200, -100);
        particlesGood.minParticleScale = 0.6;
        particlesGood.maxParticleScale = 1.5;
        particlesGood.gravity = 150;
        particlesGood.angularDrag = 30;

        particlesGood.x = obj.x;
        particlesGood.y = obj.y- 25;
        particlesGood.start(true, 1000, null, particlesNumber);

        game.add.tween(particlesGood).to({alpha:0},1000,Phaser.Easing.Cubic.In,true)
        sceneGroup.add(particlesGood)
        
    }
    
    function lookParticle(key){
        
        for(var i = 0;i<particlesGroup.length;i++){
            
            var particle = particlesGroup.children[i]
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
    
    function createPart(key,obj){
        
        key+='Part'
        var particle = lookParticle(key)
        if(particle){
            
            particle.x = obj.x
            particle.y = obj.y
            particle.scale.setTo(1,1)
            game.add.tween(particle).to({alpha:0},300,Phaser.Easing.Cubic.In,true)
            game.add.tween(particle.scale).to({x:2,y:2},300,Phaser.Easing.Cubic.In,true)
            deactivateParticle(particle,300)
        }
         
    }
    
    function createParticles(tag,number){
        
        tag+='Part'
        
        for(var i = 0; i < number;i++){
            
            var particle
            if(tag == 'textPart'){
                
                var fontStyle = {font: "50px VAGRounded", fontWeight: "bold", fill: "#ffffff", align: "center"}
                
                var particle = new Phaser.Text(sceneGroup.game, 0, 10, '0', fontStyle)
                particle.setShadow(3, 3, 'rgba(0,0,0,1)', 0);
                particlesGroup.add(particle)
                
            }else{
                particle = particlesGroup.create(-200,0,'atlas.game',tag)
            }
            
            particle.alpha = 0
            particle.tag = tag
            particle.used = false
            particle.anchor.setTo(0.5,0.5)
            particle.scale.setTo(1,1)
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

        stopTouch = true
        
        if(lives === 0){
            stopGame()
        }
    
    }

    

    function update(){

    	if(!gameActive){
    		return
    	}


        if(rope!=null){
        	rope.x = rope.radiusCircle*Math.cos(rope.currentAngle) + rope.initialPoint.x
        	rope.y = (rope.radiusCircle*Math.sin(rope.currentAngle)*0.7) + rope.initialPoint.y
        	var h = Math.sqrt(Math.pow(rope.x - rope.imaginPivot.x,2)+Math.pow(rope.y - rope.imaginPivot.y,2))
        	var x = rope.x - rope.imaginPivot.x

        	var ang = Math.acos(x/h)*(180/Math.PI)-90
        	rope.angle = ang
        	rope.currentAngle+=rope.deltaAngle
        }

        if(towerGroup!=null){

            towerGroup.angle+=(towerGroup.direction*towerGroup.delta)
            if((towerGroup.direction==1 && towerGroup.angle>towerGroup.maxAngle) || (towerGroup.direction==-1 && towerGroup.angle<-towerGroup.maxAngle)){
                //console.log(towerGroup.maxAngle,Math.abs(towerGroup.angle))
                towerGroup.direction*=-1
            }
        }


        for(var i =0; i < cloudGroup.length;i++){
            if(cloudGroup.children[i].visible){
                
                cloudGroup.children[i].x += (cloudGroup.children[i].direction * cloudGroup.children[i].vel)
                if(cloudGroup.children[i].x < -100){
                    cloudGroup.children[i].x = game.world.width+100
                }

                if(cloudGroup.children[i].x > game.world.width+100){
                    cloudGroup.children[i].x = -100
                }
            }
        }


        var y = towerGroup.y - (game.world.height-100)
        //console.log(y,lastQuad.y)
        y = y + lastQuad.y - lastQuad.collision.correctHeight


        //console.log(y)
        if(y < -200){
            towerGroup.y += TOWER_VELOCITY
            if(floorGroup.y < game.world.height + 100){
                floorGroup.y += TOWER_VELOCITY
            }

             for(var i =0; i < cloudGroup.length;i++){
                if(cloudGroup.children[i].visible){
                    cloudGroup.children[i].y += TOWER_VELOCITY
                    if(cloudGroup.children[i].y > game.world.height){
                        cloudGroup.children[i].visible = false
                        lastCloud = getCloud(game.rnd.integerInRange(lastCloud.y-150,lastCloud.y -250))
                    }
                }
            }

        }

        for(var i =0; i < peopleGroup.length; i++){
            if(peopleGroup.children[i].visible){
                var person = peopleGroup.children[i]
                person.x = lerp(person.quad.world.x,person.x,0.95)
                person.y = lerp(person.quad.world.y,person.y,0.95)
                var d = Math.sqrt(Math.pow(person.quad.world.x-person.x,2)+Math.pow(person.quad.world.y-person.y,2))
                if(d < 50){
                    if(person.peopleType == person.quad.worldType){
                        addPoint(2,{x:game.world.width-80,y:80})

                    }
                    else{
                        addPoint(1,{x:game.world.width-80,y:80})
                    }
                    person.visible = false

                    for(var j =0; j < person.quad.people.length; j++){
                    	if(!person.quad.people[j].visible){
                    		person.quad.people[j].loadTexture("atlas.game","person"+person.id)
                            person.quad.people[j].firstY = person.quad.people[j].y
                            person.quad.people[j].y += 100
                            game.add.tween(person.quad.people[j]).to({y:person.quad.people[j].firstY},300,Phaser.Easing.linear,true)
                            var s = game.rnd.integerInRange(0,1)
                            if(s ==0){
                                s=-1
                            }
                            person.quad.people[j].angle = s*10
                            var t = game.add.tween(person.quad.people[j]).to({angle:(-s*10)},500,Phaser.Easing.linear,true)
                            t.loop(true)
                            t.yoyo(true)
                    		person.quad.people[j].visible = true
                            person.quad.people[j].emoji.loadTexture("atlas.game","emoji"+person.id)
                            person.quad.people[j].emoji.scale.setTo(0)
                            game.add.tween(person.quad.people[j].emoji.scale).to({x:1,y:1},300,Phaser.Easing.linear,true)
                            person.quad.people[j].emoji.visible = true
                    		break
                    	}
                    }
                }
            }
        }

        if(game.input.activePointer.isDown){
            if(canTouch){
                var x = currentQuad.world.x
                var y = currentQuad.world.y
                sceneGroup.addChild(currentQuad)
                currentQuad.x = x
                currentQuad.y = y
                canTouch = false

            }
        }
        else{

        }

        if(!canTouch){
            currentQuad.y+=currentQuadVelocity

            if(checkOverlap(currentQuad.collision,lastQuad.collision)){
                
                if(towerGroup.length>0){
                	var rad = (towerGroup.angle+90)*(Math.PI/180)
                	var moduleJ = 1
                	var j = {x:moduleJ*Math.cos(rad),y:moduleJ*Math.sin(rad)}
                	var moduleI = 1
                	rad = (towerGroup.angle)*(Math.PI/180)
                	var i = {x:moduleI*Math.cos(rad),y:moduleI*Math.sin(rad)}

                	var vec = {x:currentQuad.x - lastQuad.world.x,y:currentQuad.y - lastQuad.world.y}
                	var moduleVec = Math.sqrt(Math.pow(vec.x,2)+Math.pow(vec.y,2))

                	var x = ((i.x*vec.x)+(i.y*vec.y))/moduleI
                	var y = ((j.x*vec.x)+(j.y*vec.y))/moduleJ

                	/*if(Math.abs(x)>80){
                		return
                	}*/

                	if(y > -lastQuad.collision.correctHeight+150){
                		return
                	}

                	//console.log(y,)

                	

                    deltaX = x
                    console.log(deltaX)
                    if(Math.abs(deltaX)<10){
                        console.log("setCombo")
                        currentQuad.x = lastQuad.x
                        currentInCombo++
                        createPart('star',{x:currentQuad.world.x,y:(lastQuad.world.y - lastQuad.collision.correctHeight)})
                        addPoint(currentCombo,{x:game.world.width-80,y:80})
                        
                        if(currentInCombo>=IN_TO_START_COMBO){
                            if(currentCombo<MAX_COMBO){
                                currentCombo+=DELTA_COMBO
                            }
                        }
                    }
                    else{
                        currentCombo = 1
                        x = lastQuad.x+x

                        var minLast = lastQuad.x - (lastQuad.collision.correctWidth/2)
                        var maxLast = lastQuad.x + (lastQuad.collision.correctWidth/2)
                        var minCurrent = x - (currentQuad.collision.correctWidth/2)

                        var deltaConexion = (lastQuad.collision.correctWidth/lastQuad.collision.totalConexions)
                        var maxLastConexion = maxLast - (deltaConexion/2)
                        var currentConexion 

                        if(minLast<minCurrent){
                            currentConexion = minLast + (deltaConexion/2)
                        }
                        else{
                            currentConexion = minLast - (deltaConexion/2)
                            while(currentConexion > minCurrent){
                                currentConexion -= deltaConexion
                            }
                        }

                        //console.log(currentConexion,deltaConexion,minCurrent)

                        //for(var i =0; i < lastQuad.collision.totalConexions-1; i++){
                        //var i =0
                        while(true){
                            if(minCurrent < currentConexion){
                                var d = (currentConexion - deltaConexion) - minCurrent
                                x -= d
                                //currentQuad.x = x
                                break
                            }
                            else{
                                currentConexion+=deltaConexion

                                if(currentConexion > maxLast){
                                    currentConexion -= deltaConexion
                                    var d = (currentConexion - deltaConexion) - minCurrent
                                    x -= d
                                    x -= (deltaConexion/2)
                                    //currentQuad.x = x -
                                    break
                                }
                                //i++
                            }
                        }

                        if((x- (currentQuad.collision.correctWidth/2) > maxLast) || (x+ (currentQuad.collision.correctWidth/2) < minLast)){
                            return
                        }

                        currentQuad.x = x
                    }




                	
                	currentQuad.y = (lastQuad.y - lastQuad.collision.correctHeight )
                	//currentQuad.y = lastQuad.y

                    var deltaX = game.world.centerX - currentQuad.x
                    
                    towerGroup.maxAngle += (deltaX/DELTA_TOWER)

                    towerGroup.maxAngle = Math.abs(towerGroup.maxAngle)
                    
                    /*if(towerGroup.maxAngle<0){
                    	towerGroup.delta = 0
                    }
                    else{
                    	towerGroup.delta = towerGroup.maxAngle/200
                    }*/

                    towerGroup.delta = towerGroup.maxAngle/currentDivisor
                    currentDivisor-=1

                    currentQuadVelocity+=DELTA_FALL_VELOCITY

                    //x = Math.abs(currentQuad.x)
                    //if( x > game.world.centerX){
                    //	x = game.world.centerX
                    //}
                    x = game.world.centerX
                    var xTemp = Math.abs(currentQuad.x)
                    if( xTemp > game.world.centerX){
                    	x = xTemp - game.world.centerX
                    }
                    
                    //console.log(x)
                    x+=200
                    var h = Math.sqrt(Math.pow(x,2)+Math.pow(currentQuad.y-100,2))
                    //console.log(h)
                    var ang = ((Math.acos(x/h)*(180/Math.PI))-90)*-1
                    //console.log(towerGroup.maxAngle,ang)
                    if(towerGroup.maxAngle > ang){
                    	towerGroup.maxAngle = ang
                    }

                    /*console.log(deltaX)
                    console.log(towerGroup.maxAngle)*/

                    
                }
                else{
                	currentQuad.x -= towerGroup.x
                	currentQuad.y -= towerGroup.y
                }

                lastQuad = currentQuad
                canTouch = true
                //
                towerGroup.add(currentQuad)
                
                //var peopleCount = game.rnd.integerInRange(currentQuad.minPeople,currentQuad.minPeople+1)
                var peopleCount = currentQuad.minPeople
                //peopleCount*=currentCombo
                for(var i =0; i < peopleCount; i++){
                    getPeople(lastQuad)
                }

                getQuad()
            }

            if(currentQuad.y >= game.world.height+currentQuad.collision.correctHeight){
                canTouch = true
                currentQuad.y = currentQuad.collision.correctHeight - 125
                currentQuad.x = 0
        		//currentQuad.worldType = game.rnd.integerInRange(0,1)
        		rope.addChild(currentQuad)
                missPoint()
                //getQuad()
            }
        }

    }

    function getPeople(quad){

        var side = game.rnd.integerInRange(0,1)
        if(side == 0){
            side = -1
        }

        var peopleType = game.rnd.integerInRange(1,2)

        for(var i=0; i < peopleGroup.length; i++){
            if(!peopleGroup.children[i].visible){
                
                var person = peopleGroup.children[i]
                person.id = game.rnd.integerInRange(1,10)
                person.textu.loadTexture("atlas.game","person"+person.id)
                person.textu.scale.setTo(-side,1)
                person.visible = true
                person.x = game.world.centerX + ((game.world.centerX + 100)*side)
                person.y = quad.world.y-100-game.rnd.integerInRange(0,100)
                person.quad = quad
                person.peopleType = peopleType
                return
            }
        }
        var random = game.rnd.integerInRange(1,10)
        var person = sceneGroup.create(0,0,"atlas.game","paracaidas")
        person.id = random
        person.anchor.setTo(0.5,1)
        person.x = game.world.centerX + ((game.world.centerX + 100)*side)
        person.y = quad.world.y-100-game.rnd.integerInRange(0,200)
        person.quad = quad
        person.peopleType = peopleType
        peopleGroup.add(person)

        var texture = game.add.sprite(0,0,"atlas.game","person"+random)
        texture.anchor.setTo(0.5)
        texture.scale.setTo(-side,1)
        person.addChild(texture)
        person.textu = texture

        person.angle = -20
        person.tween = game.add.tween(person).to({angle:20},game.rnd.integerInRange(300,500),Phaser.Easing.Bounce.out,true)
        person.tween.yoyo(true)
        person.tween.loop(true)

    }


    function setRound(){
      
    }

    function getCloud(_y){

        var side = game.rnd.integerInRange(0,1)
        if(side == 0){
            side = -1
        }

        for(var i =0; i < cloudGroup.length; i++){
            if(!cloudGroup.children[i].visible){
                cloudGroup.children[i].visible = true
                cloudGroup.children[i].loadTexture("atlas.game","nube"+game.rnd.integerInRange(1,3))
                cloudGroup.children[i].x = game.rnd.integerInRange(0,game.world.width)
                cloudGroup.children[i].y = _y
                cloudGroup.children[i].direction = -side 
                cloudGroup.children[i].vel = lerp(CLOUD_MIN_VEL,CLOUD_MAX_VEL,game.rnd.frac())
                return cloudGroup.children[i]
            }
        }

        var cloud = cloudGroup.create(game.rnd.integerInRange(0,game.world.width), _y,"atlas.game","nube"+game.rnd.integerInRange(1,3))
        cloud.anchor.setTo(0.5)
        cloud.direction = -side 
        cloud.vel = lerp(CLOUD_MIN_VEL,CLOUD_MAX_VEL,game.rnd.frac())
        return cloud

    }


    function createBackground(){

        var bmd = game.add.bitmapData(game.world.width, game.world.height)

        var y = 0;

        for (var i = 0; i < game.world.height/2; i++)
        {
            var c = Phaser.Color.interpolateColor(0x73e5f4, 0xaff7f1, game.world.height, i);

            bmd.rect(0, y, game.world.width, y+2, Phaser.Color.getWebRGB(c));
            y += 2;
        }

        var background = game.add.sprite(0, 0, bmd);
        sceneGroup.add(background)

        floorGroup = game.add.group()
        sceneGroup.add(floorGroup)


        

        var mountain = game.add.tileSprite(0, game.world.height-650,game.world.width,512,"mountains")
        floorGroup.add(mountain)

        var pino = game.add.tileSprite(0, game.world.height-470,game.world.width,256,"pinos")
        floorGroup.add(pino)

        var arbusto = game.add.tileSprite(0, game.world.height-400,game.world.width,256,"arbusto")
        floorGroup.add(arbusto)

        var floor = game.add.tileSprite(0, game.world.height-100,game.world.width,100,"tierra")
        floorGroup.add(floor)

        var pasto = game.add.tileSprite(0, game.world.height-200,game.world.width,128,"pasto")
        floorGroup.add(pasto)
        
        towerGroup = game.add.group()
        sceneGroup.add(towerGroup)
        towerGroup.x = game.world.centerX
        towerGroup.y = game.world.height-100
        towerGroup.direction = 1
        towerGroup.maxAngle = 0
        towerGroup.delta = 0


        peopleGroup = game.add.group()
        sceneGroup.add(peopleGroup)

        cloudGroup = game.add.group()
        sceneGroup.add(cloudGroup)

        var cloudY = 200
        while(cloudY > -game.world.height){
            lastCloud = getCloud(game.rnd.integerInRange(cloudY, cloudY-200))
            cloudY-=250

        }

    }

    function createRope(){
        rope = game.add.graphics()
        rope.x = game.world.centerX+50
        rope.y = 200
        //rope.beginFill(0xff0000)
        rope.drawRect(-10,-500,20,500)
        //rope.endFill()
        rope.maxDeltaAng = 25
        rope.direction = -1
        rope.angle = rope.maxDeltaAng
        //rope.alpha = 0.4
        sceneGroup.add(rope)

        rope.currentAngle = 0
        rope.radiusCircle = 100
        rope.deltaAngle = 0.03
        rope.imaginPivot = {x:game.world.centerX,y:-300}
        rope.initialPoint = {x:game.world.centerX,y:200}

        var cuerda = sceneGroup.create(50,-200,"atlas.game","cuerda")
        cuerda.anchor.setTo(0.5,1)
        rope.addChild(cuerda)

        cuerda = sceneGroup.create(-50,-200,"atlas.game","cuerda")
        cuerda.anchor.setTo(0.5,1)
        rope.addChild(cuerda)

        var claw = sceneGroup.create(0,-200,"atlas.game","pinza")
        claw.anchor.setTo(0,0)
        rope.addChild(claw)
        rope.claw1 = claw

        claw = sceneGroup.create(0,-200,"atlas.game","pinza")
        claw.anchor.setTo(0,0)
        claw.scale.setTo(-1,1)
        rope.addChild(claw)
        rope.claw2 = claw

        var base = sceneGroup.create(0,-200,"atlas.game","Base_pinza")
        base.anchor.setTo(0.5)
        rope.addChild(base)

        getQuad()
        lastQuad = currentQuad
        towerGroup.add(lastQuad)

        lastQuad.y = 0
        lastQuad.x = 0

        for(var i =0; i < lastQuad.people.length; i++){
            lastQuad.people[i].visible = true
            var id = game.rnd.integerInRange(1,10)
            lastQuad.people[i].loadTexture("atlas.game","person"+id)
            lastQuad.people[i].emoji.visible = true
            lastQuad.people[i].emoji.loadTexture("atlas.game","emoji"+id)
            var s = game.rnd.integerInRange(0,1)
            if(s ==0){
                s=-1
            }
            lastQuad.people[i].angle = s*10
            var t = game.add.tween(lastQuad.people[i]).to({angle:(-s*10)},500,Phaser.Easing.linear,true)
            t.loop(true)
            t.yoyo(true)
        }

    }


    function getQuad(){
    	currentQuad = sceneGroup.create(0,0,"atlas.game","bloque1_1")
    	currentQuad.worldType = game.rnd.integerInRange(1,2)
    	//currentQuad.worldType = 2
    	var indexOfType = game.rnd.integerInRange(1,6)
    	//indexOfType = 6
    	currentQuad.loadTexture("atlas.game","bloque"+currentQuad.worldType+"_"+indexOfType)
    	currentQuad.anchor.setTo(0.5,1)

    	currentQuad.collision = game.add.graphics()
        currentQuad.collision.beginFill(0x00ff00)
        currentQuad.people = []

        if(currentQuad.worldType == 1 && indexOfType== 1){

        	currentQuad.collision.drawRect(-65,-172,130,172)
        	currentQuad.collision.correctHeight = 172
            currentQuad.collision.correctWidth = 130
            currentQuad.collision.totalConexions = 3
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(0,-50,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[0].mask.endFill()
        	//currentQuad.people[0].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }
        else if(currentQuad.worldType == 1 && indexOfType== 2){
        	currentQuad.collision.drawRect(-125,-172,250,172)
        	currentQuad.collision.correctHeight = 172
            currentQuad.collision.correctWidth = 250
            currentQuad.collision.totalConexions = 5
        	currentQuad.minPeople = 2

        	currentQuad.people[0] = sceneGroup.create(-55,-50,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[0].mask.endFill()
        	currentQuad.people[0].mask.x =-60
        	//currentQuad.people[0].maskT.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)

        	currentQuad.people[1] = sceneGroup.create(62,-50,"atlas.game","person1")
        	currentQuad.people[1].anchor.setTo(0.5)
        	currentQuad.people[1].mask = game.add.graphics()
        	currentQuad.people[1].mask.beginFill(0xff0000)
        	currentQuad.people[1].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[1].mask.endFill()
        	currentQuad.people[1].mask.x =65
        	currentQuad.people[1].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[1])
        	currentQuad.addChild(currentQuad.people[1].mask)
            currentQuad.people[1].emoji = sceneGroup.create(currentQuad.people[1].x+OFFSET_EMOJI.x,currentQuad.people[1].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[1].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[1].emoji)
        }
        else if(currentQuad.worldType == 1 && indexOfType== 3){
        	currentQuad.collision.drawRect(-125,-147,250,147)
        	currentQuad.collision.correctHeight = 147
            currentQuad.collision.correctWidth = 250
            currentQuad.collision.totalConexions = 6
        	currentQuad.minPeople = 2

        	currentQuad.people[0] = sceneGroup.create(-55,-50,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[0].mask.endFill()
        	currentQuad.people[0].mask.x =-60
        	//currentQuad.people[0].maskT.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)

        	currentQuad.people[1] = sceneGroup.create(62,-50,"atlas.game","person1")
        	currentQuad.people[1].anchor.setTo(0.5)
        	currentQuad.people[1].mask = game.add.graphics()
        	currentQuad.people[1].mask.beginFill(0xff0000)
        	currentQuad.people[1].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[1].mask.endFill()
        	currentQuad.people[1].mask.x =65
        	//currentQuad.people[1].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[1])
        	currentQuad.addChild(currentQuad.people[1].mask)
            currentQuad.people[1].emoji = sceneGroup.create(currentQuad.people[1].x+OFFSET_EMOJI.x,currentQuad.people[1].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[1].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[1].emoji)
        }
        else if(currentQuad.worldType == 1 && indexOfType== 4){
        	currentQuad.collision.drawRect(-55,-300,110,300)
        	currentQuad.collision.correctHeight = 300
            currentQuad.collision.correctWidth = 110
            currentQuad.collision.totalConexions = 3
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(0,-190,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-260,70,90)
        	currentQuad.people[0].mask.endFill()
        	//currentQuad.people[0].maskT.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }
        else if(currentQuad.worldType == 1 && indexOfType== 5){
        	currentQuad.collision.drawRect(-125,-160,250,160)
        	currentQuad.collision.correctHeight = 160
            currentQuad.collision.correctWidth = 250
            currentQuad.collision.totalConexions = 6
        	currentQuad.minPeople = 3


        	currentQuad.people[0] = sceneGroup.create(-85,-50,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[0].mask.endFill()
        	currentQuad.people[0].mask.x =-90
        	//currentQuad.people[0].maskT.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)

        	currentQuad.people[1] = sceneGroup.create(0,-50,"atlas.game","person1")
        	currentQuad.people[1].anchor.setTo(0.5)
        	currentQuad.people[1].mask = game.add.graphics()
        	currentQuad.people[1].mask.beginFill(0xff0000)
        	currentQuad.people[1].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[1].mask.endFill()
        	currentQuad.people[1].mask.x =0
        	currentQuad.people[1].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[1])
        	currentQuad.addChild(currentQuad.people[1].mask)

            currentQuad.people[1].emoji = sceneGroup.create(currentQuad.people[1].x+OFFSET_EMOJI.x,currentQuad.people[1].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[1].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[1].emoji)

        	currentQuad.people[2] = sceneGroup.create(90,-50,"atlas.game","person1")
        	currentQuad.people[2].anchor.setTo(0.5)
        	currentQuad.people[2].mask = game.add.graphics()
        	currentQuad.people[2].mask.beginFill(0xff0000)
        	currentQuad.people[2].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[2].mask.endFill()
        	currentQuad.people[2].mask.x =90
        	currentQuad.people[2].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[2])
        	currentQuad.addChild(currentQuad.people[2].mask)

            currentQuad.people[2].emoji = sceneGroup.create(currentQuad.people[2].x+OFFSET_EMOJI.x,currentQuad.people[2].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[2].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[2].emoji)
        }
        else if(currentQuad.worldType == 1 && indexOfType== 6){
        	currentQuad.collision.drawRect(-125,-160,250,160)
        	currentQuad.collision.correctHeight = 160
            currentQuad.collision.correctWidth = 250
            currentQuad.collision.totalConexions = 6
        	currentQuad.minPeople = 2

        	currentQuad.people[0] = sceneGroup.create(-55,-50,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[0].mask.endFill()
        	currentQuad.people[0].mask.x =-60
        	//currentQuad.people[0].maskT.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)

        	currentQuad.people[1] = sceneGroup.create(62,-50,"atlas.game","person1")
        	currentQuad.people[1].anchor.setTo(0.5)
        	currentQuad.people[1].mask = game.add.graphics()
        	currentQuad.people[1].mask.beginFill(0xff0000)
        	currentQuad.people[1].mask.drawRect(-35,-120,70,90)
        	currentQuad.people[1].mask.endFill()
        	currentQuad.people[1].mask.x =65
        	//currentQuad.people[1].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[1])
        	currentQuad.addChild(currentQuad.people[1].mask)

            currentQuad.people[1].emoji = sceneGroup.create(currentQuad.people[1].x+OFFSET_EMOJI.x,currentQuad.people[1].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[1].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[1].emoji)
        }
        else if(currentQuad.worldType == 2 && indexOfType== 1){
        	currentQuad.collision.drawRect(-75,-142,150,142)
        	currentQuad.collision.correctHeight = 142
            currentQuad.collision.correctWidth = 150
            currentQuad.collision.totalConexions = 4
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(0,-49,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-118,70,90)
        	currentQuad.people[0].mask.endFill()
        	//currentQuad.people[0].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }
        else if(currentQuad.worldType == 2 && indexOfType== 2){
        	currentQuad.collision.drawRect(-55,-215,110,215)
        	currentQuad.collision.correctHeight = 215
            currentQuad.collision.correctWidth = 110
            currentQuad.collision.totalConexions = 3
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(0,-78,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-146,70,90)
        	currentQuad.people[0].mask.endFill()
        	//currentQuad.people[0].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }
        else if(currentQuad.worldType == 2 && indexOfType== 3){
        	currentQuad.collision.drawRect(-125,-145,250,145)
        	currentQuad.collision.correctHeight = 145
            currentQuad.collision.correctWidth = 110
            currentQuad.collision.totalConexions = 6
        	currentQuad.minPeople = 2

        	currentQuad.people[0] = sceneGroup.create(-55,-44,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-114,70,90)
        	currentQuad.people[0].mask.endFill()
        	currentQuad.people[0].mask.x =-60
        	//currentQuad.people[0].maskT.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)

        	currentQuad.people[1] = sceneGroup.create(62,-44,"atlas.game","person1")
        	currentQuad.people[1].anchor.setTo(0.5)
        	currentQuad.people[1].mask = game.add.graphics()
        	currentQuad.people[1].mask.beginFill(0xff0000)
        	currentQuad.people[1].mask.drawRect(-35,-114,70,90)
        	currentQuad.people[1].mask.endFill()
        	currentQuad.people[1].mask.x =65
        	//currentQuad.people[1].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[1])
        	currentQuad.addChild(currentQuad.people[1].mask)

            currentQuad.people[1].emoji = sceneGroup.create(currentQuad.people[1].x+OFFSET_EMOJI.x,currentQuad.people[1].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[1].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[1].emoji)
        }
        else if(currentQuad.worldType == 2 && indexOfType== 4){
        	currentQuad.collision.drawRect(-70,-195,140,195)
        	currentQuad.collision.correctHeight = 195
            currentQuad.collision.correctWidth = 110
            currentQuad.collision.totalConexions = 3
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(0,-70,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-138,70,90)
        	currentQuad.people[0].mask.endFill()
        	//currentQuad.people[0].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }
        else if(currentQuad.worldType == 2 && indexOfType== 5){
        	currentQuad.collision.drawRect(-70,-260,140,260)
        	currentQuad.collision.correctHeight = 260
            currentQuad.collision.correctWidth = 140
            currentQuad.collision.totalConexions = 3
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(0,-70,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-138,70,90)
        	currentQuad.people[0].mask.endFill()
        	//currentQuad.people[0].mask.alpha = 0.4
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }
        else if(currentQuad.worldType == 2 && indexOfType== 6){
        	currentQuad.collision.drawRect(-120,-260,260,260)
        	currentQuad.collision.correctHeight = 260
            currentQuad.collision.correctWidth = 260
            currentQuad.collision.totalConexions = 5
        	currentQuad.minPeople = 1

        	currentQuad.people[0] = sceneGroup.create(-80,-70,"atlas.game","person1")
        	currentQuad.people[0].anchor.setTo(0.5)
        	currentQuad.people[0].mask = game.add.graphics()
        	currentQuad.people[0].mask.beginFill(0xff0000)
        	currentQuad.people[0].mask.drawRect(-35,-138,70,90)
        	currentQuad.people[0].mask.endFill()

        	currentQuad.people[0].mask.x = -80
        	currentQuad.addChild(currentQuad.people[0])
        	currentQuad.addChild(currentQuad.people[0].mask)

            currentQuad.people[0].emoji = sceneGroup.create(currentQuad.people[0].x+OFFSET_EMOJI.x,currentQuad.people[0].y+OFFSET_EMOJI.y,"atlas.game","emoji1")
            currentQuad.people[0].emoji.anchor.setTo(0.5)
            currentQuad.addChild(currentQuad.people[0].emoji)
        }

        for(var i =0; i < currentQuad.minPeople; i++){
        	currentQuad.people[i].visible = false
            currentQuad.people[i].emoji.visible = false
        }

        currentQuad.collision.alpha = 0
        currentQuad.collision.endFill()
        currentQuad.addChild(currentQuad.collision)
        rope.addChild(currentQuad)

        currentQuad.y = currentQuad.collision.correctHeight - 125

    }
    

    function createObjects(){
        
        particlesGroup = game.add.group()
        sceneGroup.add(particlesGroup)
        
        particlesUsed = game.add.group()
        sceneGroup.add(particlesUsed)
        
        createParticles('star',5)
        createParticles('wrong',1)
        createParticles('text',8)
                
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA , boundsB);

    }
    
    function create(){
    	
        sceneGroup = game.add.group()

        game.camera.focusOnXY(game.world.centerX, game.world.centerY);

        initialize()

        createBackground()

        if(!amazing.getMinigameId()){
			marioSong = game.add.audio('timberman')
			game.sound.setDecodedCallback(marioSong, function(){
				marioSong.loopFull(0.6)
			}, this);	
		}

        game.onPause.add(function(){
			
			if(amazing.getMinigameId()){
				marioSong.pause()
			}

           
			
	        game.sound.mute = true
	    } , this);

	    game.onResume.add(function(){
			
			if(amazing.getMinigameId()){
				if(lives > 0){
					marioSong.play()
				}
			}
			
	        game.sound.mute = false
	    }, this);

        //spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        

        

        animateScene()

        loadSounds()

        createObjects()
        createRope()
        getQuad()

        createPointsBar()
        createHearts()
        //setRound()
    }

    
    return {
        assets: assets,
        name: "megablockTower",
        create: create,
        preload: preload,
        update: update
    }

}()

function lerp(a,b,t){
   return a + t * (b - a);
}
