//import { width } from "window-size";
let x;
let y;
let width;
let height;
let platforms;
let player;
let gameover = false;
let cursors;
let playimage1, playimage2, playimage3, playimage4, playimage5, playimage6;
let hitted = false;

let player1;
let player2;

let door;
let diamond1;
let diamond2;
let doorCheck = false;

//import pic from '../../images/map';
class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image('setting', '../../images/button/setting.png');
        this.load.image('setting_point', '../../images/button/setting_point.png');
        this.load.image('setting_page', '../../images/button/setting_page.png');
        this.load.image('menu', '../../images/button/menu.png');
        this.load.image('resume', '../../images/button/resume.png');
        this.load.image('sound_on', '../../images/button/sound_on.png');
        this.load.image('sound_off', '../../images/button/sound_off.png');
        
        this.load.image('bg', '../../images/map/bg.jpg');
        this.load.image('ground', '../../images/map/ground.png');
        this.load.image('sao', '../../images/map/sao.png');
        this.load.image('short_path', '../../images/map/short_path.png');
        this.load.image('fire', '../../images/map/fire.png');
        this.load.image('long_path', '../../images/map/long_path.png');
        this.load.image('lamp_on', '../../images/map/lamp_on.png');
        this.load.image('lamp_off', '../../images/map/lamp_off.png');

        this.load.spritesheet('door', '../../images/door/door_complete.png', { frameWidth: 99, frameHeight: 124 });

        this.load.image('diamond', '../../images/items/diamond.png');
        this.load.image('diamond1', '../../images/items/diamond.png');
        this.load.image('diamond2', '../../images/items/diamond.png');

        this.load.image('fire', '../../images/map/fire.png');

        this.load.spritesheet('yang', '../../images/yang/eat1.png', { frameWidth: 80, frameHeight:107 });
        this.load.spritesheet('ying', '../../images/ying/walkying.png', { frameWidth: 85, frameHeight: 57 });


    }

    create() {
        width = this.scene.scene.physics.world.bounds.width;
        height = this.scene.scene.physics.world.bounds.height;
        x = width * 0.5;
        y = height * 0.5;

        this.add.image(x, y, 'bg');
        width = this.scene.scene.physics.world.bounds.width;
        height = this.scene.scene.physics.world.bounds.height;
        x = width * 0.5;
        y = height * 0.5;

        this.add.image(x, y, 'bg');

        platforms = this.physics.add.staticGroup();

        //platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(10, 570, 'ground');
        platforms.create(400, 570, 'ground');

        platforms.create(x, 385, 'sao');
        platforms.create(x, 225, 'long_path');

        platforms.create(100, y, 'long_path');
        platforms.create(685, y, 'long_path');

        platforms.create(290, 425, 'short_path');
        platforms.create(510, 425, 'short_path');

        door = this.physics.add.staticSprite(x, 155, 'door'); 

        player1 = this.physics.add.sprite(50, 400, 'yang').setScale(0.5);
        player2 = this.physics.add.sprite(750, 400, 'ying').setScale(0.75);

        player1.setBounce(0.2);
        player1.setCollideWorldBounds(true);

        player2.setBounce(0.2);
        player2.setCollideWorldBounds(true);


        this.physics.add.collider(door,platforms);
        this.physics.add.collider(player1, platforms);
        this.physics.add.collider(player2, platforms);

        cursors = this.input.keyboard.createCursorKeys();

        playimage1 = this.add.image(770, 30, 'setting');
        playimage1.setInteractive();
        playimage1.input.useHandCursor = true;
        playimage1.on ('pointerup', () => { 
            playimage2 = this.add.image(x, y, 'setting_page');
            playimage2.setInteractive();

            playimage3 = this.add.image(380,210, 'sound_on');
            playimage3.setInteractive();

            playimage4 = this.add.image(380,270, 'sound_off');
            playimage4.setInteractive();

            playimage5 = this.add.image(380,350, 'resume');
            playimage5.setInteractive();
            playimage5.on ('pointerup', () => {
                this.input.on('gameobjectup',clickHandler, this);
            });

            playimage6 = this.add.image(380,410, 'menu');
            playimage6.setInteractive();
            playimage6.on ('pointerup', () => {
                this.scene.start('Map1');
            });
        });
        
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        diamond1 = this.physics.add.staticGroup();
        this.physics.add.collider(diamond1, platforms);
        this.physics.add.collider(player1, diamond1);

        //diamond1
        diamond1 = this.physics.add.staticGroup({
            key: 'diamond1',
            repeat: 1,
            setXY: { x: 12, y: 270, stepX: 500, stepY: 250 }

        });

        /*diamond1.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
        });*/

        // this.physics.add.collider(player1,door);
        // this.physics.add.collider(player2,door);

        this.physics.add.collider(diamond1, platforms);
        this.physics.add.overlap(player1, door, player1Crash);
        this.physics.add.overlap(player2, door, player2Crash);
        this.physics.add.overlap(player1, diamond1, this.collectDiamond);
        this.physics.add.overlap(player1,player2, this.nextLevel);

        //diamond2
        diamond2 = this.physics.add.group();
        this.physics.add.collider(diamond2, platforms);
        //this.physics.add.collider(player2, diamond1);

        /*diamond2 = this.physics.add.group({
            key: 'diamond2',
            repeat: 1,
            setXY: { x: 700, y: 500, stepX: 0 }

        });

        diamond2.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));
            child.disableBody(true, true)
        });


        this.physics.add.collider(diamond2, platforms);
        this.physics.add.overlap(player1, diamond2, this.collectDiamond);*/

        //door anime
        this.anims.create({
            key: 'doors',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }),
            frameRate: 10
        });

        //anime yang
        this.anims.create({
             key: 'left',
             frames: this.anims.generateFrameNumbers('yang', { start: 3, end: 5 }),
             frameRate: 10,
             repeat: -1
         });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'yang', frame: 0 }],
            frameRate: 20
        });

        this.anims.create({
             key: 'right',
             frames: this.anims.generateFrameNumbers('yang', { start: 0, end: 2 }),
             frameRate: 10,
             repeat: -1
         });

        //anime ying
        this.anims.create({
            key: 'keyA',
            frames: this.anims.generateFrameNumbers('ying', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'ying', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
             key: 'keyD',
             frames: this.anims.generateFrameNumbers('ying', { start: 0, end: 2 }),
             frameRate: 10,
             repeat: -1
         });

    }

    update() {
        if (cursors.left.isDown) {
            player1.setVelocityX(-160);
            player1.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player1.setVelocityX(160);
            player1.anims.play('right', true);

        } else {
            player1.setVelocityX(0);

        }
        if (cursors.up.isDown && player1.body.onFloor()) {
            player1.setVelocityY(-330);
        }


        //control ying
        if (this.keyA.isDown) {
            player2.setVelocityX(-160);
            player2.anims.play('keyA', true);

        } else if (this.keyD.isDown) {
            player2.setVelocityX(160);
            player2.anims.play('keyD', true);

        } else {
            player2.setVelocityX(0);
        }
        if (this.keyW.isDown && player2.body.onFloor()) {
            player2.setVelocityY(-330);
        }
        if (doorCheck === true && pc1 === true && pc2 === true) {
            // if ()
            this.scene.start('Game_lv2', true);
        }
    }
    collectDiamond(player1, diamondtmep) {

        diamondtmep.disableBody(true, true);
        //diamond2.disableBody(true, true);
        
        if (diamond1.countActive(true) === 0 ) {
            door.anims.play('doors', true);
            //doorCheck === true;
        }
    }
    nextLevel( player1 ,player2, door) {
        if (diamond1.countActive(true) === 0) {
            doorCheck = true;
        }
        
    }
    /* hitdoor(player1,door){
        player1.collider(player1,door)
        hitted = true;
    }*/
    
}

/*function hitDoor(player1,door){ 
    player2.collider(player1,door)
}*/

function hitDoor(player1, door) {
    console.log("hit")
}

function hitFire(player, fire) {
    player.setTint(0xff0000);
    player.anims.play('turn');
    
    gameover = true;
}

function clickHandler () {
    playimage2.setVisible(false);
    playimage3.setVisible(false);
    playimage4.setVisible(false);
    playimage5.setVisible(false);
    playimage6.setVisible(false);
}

export default GameScene;


let pc1 = false;
let pc2 = false;
// let playerCrash;
function player1Crash(player1, door){
    pc1 = true;
}
function player2Crash(player2, door){
    pc2 = true
}