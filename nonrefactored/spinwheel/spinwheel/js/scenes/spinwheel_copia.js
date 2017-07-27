var spinwheel = function(){

	assets = {
        atlases: [                
			{
				name: "atlas.jump",
                json: "images/spinwheel/atlas.json",
                image: "images/spinwheel/atlas.png"
			}],
        images: [],
		sounds: [],
	}
    

	
    function preload() {
        
        //game.plugins.add(Fabrique.Plugins.Spine);
        //game.stage.disableVisibilityChange = true;
        //game.load.spine('men', "img/spines/skeleton.json");		
		game.load.image("fondo", "images/spinwheel/fondo-01.png");
		game.load.image("barra1", "images/spinwheel/barra1.png");
		game.load.image('yogotar', 'images/spinwheel/yogotar.png');
		game.load.physics('fisica', 'images/spinwheel/fisicas.json');
   
	
	
	}
	
	var barra1;
	var pressButton = null;
	var moveBar = null;
	var yogotar;
	var bgSpine;
	var yogotarCollisionGroup;
	var blockCollisionGroup;
	var cursors;
	var mouseBody;
	var mouseConstraint;
	
	function initialize(){

        gameActive = false
        moveUp = false
        objectsGroup = null
        lives = 1
 
        
	}	
	
	
    function inputButton(obj){
                
		moveBar = obj.tag;
		pressButton = true;
		obj.isPressed = true
		obj.parent.children[1].alpha = 0;
    }
    
    function releaseButton(obj){
		moveBar = null;
        pressButton = false;
		obj.parent.children[1].alpha = 1;
          }	
	
    function createControls(){
        var spaceButtons = 220
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX + 135
        groupButton.y = game.world.height -85
        groupButton.scale.setTo(1,1)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','right_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','right_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'right'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
        var groupButton = game.add.group()
        groupButton.x = game.world.centerX - 135
        groupButton.y = game.world.height -85
        groupButton.scale.setTo(1,1)
        groupButton.isPressed = false
        sceneGroup.add(groupButton)
        
        var button1 = groupButton.create(0,0, 'atlas.jump','left_press')
        button1.anchor.setTo(0.5,0.5)
        
        var button2 = groupButton.create(0,0, 'atlas.jump','left_idle')
        button2.anchor.setTo(0.5,0.5)
        button2.inputEnabled = true
        button2.tag = 'left'
        button2.events.onInputDown.add(inputButton)
        button2.events.onInputUp.add(releaseButton)
        
    }	

	

    function createScene(){
	
	var barGroup = game.add.group();	
		
	game.physics.startSystem(Phaser.Physics.ARCADE);	
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.gravity.y = 500;
    
	bgSpine = game.add.sprite(0, 0,"fondo");
	bgSpine.anchor.setTo(0, 0);	
	bgSpine.x = -330;	
	
    yogotar = game.add.sprite(140, 350,"yogotar");
	yogotar.anchor.setTo(0.5, 0.5);	
	barra1 = game.add.sprite(0, 0,"barra1");
	barra1.anchor.setTo(0.5, 0.5);		
	barra1.x = 140;
	barra1.y = 400;	
	barra2 = game.add.sprite(0, 0,"barra1");	
	barra2.anchor.setTo(0.5, 0.5);	
	barra2.x = barra1.x + barra1.width + 10;
	barra2.y = barra1.y + barra1.height + 10;;		
		
	blockCollisionGroup = game.physics.p2.createCollisionGroup();
		
		
	game.physics.p2.updateBoundsCollisionGroup();
    
    //  Enable the physics bodies on all the sprites
    game.physics.p2.enable([ yogotar, barra1, barra2 ], true);
    
    yogotar.body.clearShapes();
    yogotar.body.loadPolygon('fisica', 'yogotar');
    yogotar.body.setCollisionGroup(blockCollisionGroup);
    yogotar.body.collides([blockCollisionGroup]);	
	yogotar.body.collideWorldBounds = true;
	yogotar.body.mass = 1;	
	
	
	barra1.body.clearShapes();
    barra1.body.loadPolygon('fisica', 'barra1');
    barra1.body.setCollisionGroup(blockCollisionGroup);
    barra1.body.collides([blockCollisionGroup]);
	
	
	barra2.body.clearShapes();
    barra2.body.loadPolygon('fisica', 'barra1');
    barra2.body.setCollisionGroup(blockCollisionGroup);
    barra2.body.collides(blockCollisionGroup);		
	
	barra1.body.static = true;
	barra2.body.static = true;		

		
	sceneGroup = game.add.group(); yogomeGames.mixpanelCall("enterGame",gameIndex);;
	createControls();		
		
	cursors = game.input.keyboard.createCursorKeys();
		
    barra1.inputEnabled = true;
    barra1.input.enableDrag();	
	barra1.events.onDragStart.add(dragStart,this);
	barra1.events.onDragUpdate.add(dragUpdate,this);
	
	barra2.inputEnabled = true;	
    barra2.input.enableDrag();	
	barra2.events.onDragStart.add(dragStart,this);
	barra2.events.onDragUpdate.add(dragUpdate,this);
		


		
function dragStart(object) {

    object.alpha = 0.8;

}

function dragUpdate(object) {
    //barra1.body.rotateLeft(50);

	//object.body.angle += game.physics.arcade.angleToPointer(object);
	
	object.body.angle += game.physics.arcade.angleToPointer(object);
}		
		
		
    }
	


function update() {
	
    /*if (cursors.left.isDown)
    {
    	barra1.body.rotateLeft(50);
    }
    else if (cursors.right.isDown)
    {
    	barra1.body.rotateRight(50);
    }*/
	
	if(yogotar.x >= game.world.width*0.5){
		bgSpine.x = -yogotar.x;
		blockCollisionGroup.x = 100; 
	}	
	

}
	
	return {
		assets: assets,
		name: "spinwheel",
		create: createScene,
        preload: preload,
		update:update
	}

}()