"use strict";
console.clear();
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}


var pol = 40;

var trans = 1;
var strings1 = ['Good Work!', '5 x Perfects!', 'Keep It Up!'];
var randomArray = [
   '#ffcccc','#ffd9cc', '#ffe6cc', '#fff2cc','#ffffcc','#f2ffcc','#e6ffcc','#d9ffcc','#ccffcc','#ccffd9','#ccffe6'
];

var randomElement = randomArray.random()
// alert(randomElement)
if (localStorage.getItem("highScore") === null) {
  //...
  localStorage.setItem('highScore',0);

} else {
           this.highscores = localStorage.getItem("highScore");
           // alert(this.highscores)
}
        var counter = 0;
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();


// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'img/music.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.3 );
	sound.play();
});

class Stage {
    constructor() {
        // container
        this.render = function () {
            this.renderer.render(this.scene, this.camera);
        };
        this.add = function (elem) {
            this.scene.add(elem);
        };
        this.remove = function (elem) {
            this.scene.remove(elem);
        };
        this.container = document.getElementById('game');
        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor('#595959', 0.1);
        //this.renderer.setClearColor('#6f655d', 1);

        this.container.appendChild(this.renderer.domElement);
        // scene
        this.scene = new THREE.Scene();
        // camera
        let aspect = window.innerWidth / window.innerHeight;
        let d = 20;
        this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, -100, 500);
        this.camera.position.x = 2;
        this.camera.position.y = 2;
        this.camera.position.z = 2;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        //light
        this.light = new THREE.DirectionalLight(0xffffff, 0.7);
        this.light.position.set(0, 499, 0);
        this.scene.add(this.light);
        this.softLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.softLight);
        window.addEventListener('resize', () => this.onResize());
        this.onResize();
    }
    setCamera(y, speed = 0.2) {
        TweenLite.to(this.camera.position, speed, { y: y + 4, ease: Power1.easeInOut });
        TweenLite.to(this.camera.lookAt, speed, { y: y, ease: Power1.easeInOut });
    }
    onResize() {
        let viewSize = pol;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.left = window.innerWidth / -viewSize;
        this.camera.right = window.innerWidth / viewSize;
        this.camera.top = window.innerHeight / viewSize;
        this.camera.bottom = window.innerHeight / -viewSize;
        this.camera.updateProjectionMatrix();

    }

    onResize2(vr) {
            let viewSize = vr;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.left = window.innerWidth / -viewSize;
            this.camera.right = window.innerWidth / viewSize;
            this.camera.top = window.innerHeight / viewSize;
            this.camera.bottom = window.innerHeight / -viewSize;
            this.camera.updateProjectionMatrix();

        }
}
class Block {
    constructor(block) {
        // set size and position
        this.STATES = { ACTIVE: 'active', STOPPED: 'stopped', MISSED: 'missed' };
        this.MOVE_AMOUNT = 12;
        this.dimension = { width: 0, height: 0, depth: 0 };
        this.position = { x: 0, y: 0, z: 0 };
        this.targetBlock = block;
        this.index = (this.targetBlock ? this.targetBlock.index : 0) + 1;
        this.workingPlane = this.index % 2 ? 'x' : 'z';
        this.workingDimension = this.index % 2 ? 'width' : 'depth';
        // set the dimensions from the target block, or defaults.
        this.dimension.width = this.targetBlock ? this.targetBlock.dimension.width : 10;
        this.dimension.height = this.targetBlock ? this.targetBlock.dimension.height : 2;
        this.dimension.depth = this.targetBlock ? this.targetBlock.dimension.depth : 10;
        this.position.x = this.targetBlock ? this.targetBlock.position.x : 0;
        this.position.y = this.dimension.height * this.index;
        this.position.z = this.targetBlock ? this.targetBlock.position.z : 0;
        this.colorOffset = this.targetBlock ? this.targetBlock.colorOffset : Math.round(Math.random() * 200);
        // set color
        if (!this.targetBlock) {
            //this.color = 0x6e6e91;
             this.color = 0x333344;

                    //this.scoreContainer.innerHTML = this.color;

        }
        else {
            let offset = this.index + this.colorOffset;
            var r = Math.sin(0.3 * offset) * 55 + 250;
            var g = Math.sin(0.3 * offset + 2) * 55 + 250;
            var b = Math.sin(0.3 * offset + 4) * 55 + 250;
            this.color = new THREE.Color(r / 255, g / 255, b / 255);
            this.scoreContainer = document.getElementById('score');

            console.log(this.color);

        }
        // state
        this.state = this.index > 1 ? this.STATES.ACTIVE : this.STATES.STOPPED;
        // set direction
        this.speed = -0.1 - (this.index * 0.005);
        if (this.speed < -4)
            this.speed = -4;
        this.direction = this.speed;
        // create block
        let geometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
        this.material = new THREE.MeshToonMaterial({ color: this.color, shading: THREE.FlatShading });
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.position.set(this.position.x, this.position.y + (this.state == this.STATES.ACTIVE ? 0 : 0), this.position.z);
        if (this.state == this.STATES.ACTIVE) {
            this.position[this.workingPlane] = Math.random() > 0.5 ? -this.MOVE_AMOUNT : this.MOVE_AMOUNT;
        }
    }
    reverseDirection() {
        this.direction = this.direction > 0 ? this.speed : Math.abs(this.speed);
    }
    place() {
        //alert(this.targetBlock.colorOffset)
        this.state = this.STATES.STOPPED;
        let overlap = this.targetBlock.dimension[this.workingDimension] - Math.abs(this.position[this.workingPlane] - this.targetBlock.position[this.workingPlane]);
        let blocksToReturn = {
            plane: this.workingPlane,
            direction: this.direction
        };
        if (this.dimension[this.workingDimension] - overlap < 0.2) {
            //alert('perd')

            overlap = this.dimension[this.workingDimension];
            blocksToReturn.bonus = true;
            this.position.x = this.targetBlock.position.x;
            this.position.z = this.targetBlock.position.z;
            this.dimension.width = this.targetBlock.dimension.width;
            this.dimension.depth = this.targetBlock.dimension.depth;
        }
        if (overlap > 0) {
            //counter = 0;
            let choppedDimensions = { width: this.dimension.width, height: this.dimension.height, depth: this.dimension.depth };
            choppedDimensions[this.workingDimension] -= overlap;
            this.dimension[this.workingDimension] = overlap;
            let placedGeometry = new THREE.BoxGeometry(this.dimension.width, this.dimension.height, this.dimension.depth);
            placedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimension.width / 2, this.dimension.height / 2, this.dimension.depth / 2));
            let placedMesh = new THREE.Mesh(placedGeometry, this.material);
            let choppedGeometry = new THREE.BoxGeometry(choppedDimensions.width, choppedDimensions.height, choppedDimensions.depth);
            choppedGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(choppedDimensions.width / 2, choppedDimensions.height / 2, choppedDimensions.depth / 2));
            let choppedMesh = new THREE.Mesh(choppedGeometry, this.material);
            let choppedPosition = {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            };
            if (this.position[this.workingPlane] < this.targetBlock.position[this.workingPlane]) {
                this.position[this.workingPlane] = this.targetBlock.position[this.workingPlane];
            }
            else {
                choppedPosition[this.workingPlane] += overlap;
            }
            placedMesh.position.set(this.position.x, this.position.y, this.position.z);
            choppedMesh.position.set(choppedPosition.x, choppedPosition.y, choppedPosition.z);
            blocksToReturn.placed = placedMesh;
            if (!blocksToReturn.bonus)
                blocksToReturn.chopped = choppedMesh;
        }
        else {
            this.state = this.STATES.MISSED;
        }
        this.dimension[this.workingDimension] = overlap;
        return blocksToReturn;
    }
    tick() {
        if (this.state == this.STATES.ACTIVE) {
            let value = this.position[this.workingPlane];
            if (value > this.MOVE_AMOUNT || value < -this.MOVE_AMOUNT)
                this.reverseDirection();
            this.position[this.workingPlane] += this.direction;
            this.mesh.position[this.workingPlane] = this.position[this.workingPlane];
        }
    }
}
class Game {
    constructor() {
        this.STATES = {
            'LOADING': 'loading',
            'PLAYING': 'playing',
            'READY': 'ready',
            'ENDED': 'ended',
            'RESETTING': 'resetting'
        };
        this.blocks = [];
        this.state = this.STATES.LOADING;
        this.stage = new Stage();
        this.mainContainer = document.getElementById('container');
        this.scoreContainer = document.getElementById('score');
                this.scoreContainer2 = document.getElementById('scoreBestMain');

        this.startButton = document.getElementById('start-button');
        this.aboutme = document.getElementById('aboutme');
        this.instructions = document.getElementById('instructions');
        this.scoreContainer.innerHTML = '0';
        //this.scoreContainer2.innerHTML = '0';
        this.newBlocks = new THREE.Group();
        this.placedBlocks = new THREE.Group();
        this.choppedBlocks = new THREE.Group();
        this.stage.add(this.newBlocks);
        this.stage.add(this.placedBlocks);
        this.stage.add(this.choppedBlocks);
        this.addBlock();
        this.tick();
        this.updateState(this.STATES.READY);
        document.addEventListener('keydown', e => {
            if (e.keyCode == 32)
                this.onAction();
        });
        document.addEventListener('click', e => {
            this.onAction();
        });
        document.addEventListener('touchstart', e => {
            e.preventDefault();
            // this.onAction();
            // ☝️ this triggers after click on android so you
            // insta-lose, will figure it out later.
        });
        /*
        let banner

        document.addEventListener('deviceready', async () => {
          banner = new admob.BannerAd({
            //adUnitId: 'ca-app-pub-5068089641717062/3797730853',
            adUnitId: 'ca-app-pub-3940256099942544/6300978111',

            // ca-app-pub-3940256099942544/6300978111
          })

          banner.on('impression', async (evt) => {
            //await banner.hide()
          })

          await banner.show()
        }, false)
        */
    }
    updateState(newState) {
        for (let key in this.STATES)
            this.mainContainer.classList.remove(this.STATES[key]);
        this.mainContainer.classList.add(newState);
        this.state = newState;
    }
    onAction() {
        switch (this.state) {
            case this.STATES.READY:
                    this.aboutme.innerHTML = '';

                this.startGame();
                //
                break;
            case this.STATES.PLAYING:
                this.placeBlock();

                break;
            case this.STATES.ENDED:
                this.restartGame();
                break;
        }
    }
    startGame() {
        if (this.state != this.STATES.PLAYING) {
            this.scoreContainer.innerHTML = '0';
            this.scoreContainer2.innerHTML = '0';

            //this.instructions.innerHTML = '';
            this.updateState(this.STATES.PLAYING);
            this.addBlock();
        }
    }
    restartGame() {

        pol = 40;
        this.stage.onResize2(pol)
        //this.stage.renderer.setClearColor(randomArray.random(), 1);

        this.updateState(this.STATES.RESETTING);
        let oldBlocks = this.placedBlocks.children;
        let removeSpeed = 0.2;
        let delayAmount = 0.02;
        for (let i = 0; i < oldBlocks.length; i++) {
            TweenLite.to(oldBlocks[i].scale, removeSpeed, { x: 0, y: 0, z: 0, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn, onComplete: () => this.placedBlocks.remove(oldBlocks[i]) });
            TweenLite.to(oldBlocks[i].rotation, removeSpeed, { y: 0.5, delay: (oldBlocks.length - i) * delayAmount, ease: Power1.easeIn });
        }
        let cameraMoveSpeed = removeSpeed * 2 + (oldBlocks.length * delayAmount);
        this.stage.setCamera(5, cameraMoveSpeed );
        let countdown = { value: this.blocks.length - 1 };
        TweenLite.to(countdown, cameraMoveSpeed, { value: 0, onUpdate: () => { this.scoreContainer.innerHTML = String(Math.round(countdown.value)); } });
        this.blocks = this.blocks.slice(0, 1);
        setTimeout(() => {
            this.startGame();
        }, cameraMoveSpeed * 100);
    }
    placeBlock() {

        var tt =getRandomInt(20,30);

        pol = pol - 0.2;
        this.stage.onResize2(pol);

        trans = trans - 0.05;
        //this.stage.renderer.setClearColor(randomElement, trans );

        this.aboutme = document.getElementById('aboutme');

        let currentBlock = this.blocks[this.blocks.length - 1];
        //alert(currentBlock)
        let newBlocks = currentBlock.place();
        this.newBlocks.remove(currentBlock.mesh);
        if (newBlocks.placed)
          var audio = new Audio('img/ding1.wav');
           audio.play()
            counter = counter + 1;
            if(counter == 5 ){
                this.aboutme.innerHTML = strings1.random()
                counter = 0;
            } else {
                this.aboutme.innerHTML = '';

            }
            this.placedBlocks.add(newBlocks.placed);
        if (newBlocks.chopped) {
            counter = 0;
            this.choppedBlocks.add(newBlocks.chopped);
            let positionParams = { y: '-=30', ease: Power1.easeIn, onComplete: () => this.choppedBlocks.remove(newBlocks.chopped) };
            let rotateRandomness = 10;
            let rotationParams = {
                delay: 0.05,
                x: newBlocks.plane == 'z' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                z: newBlocks.plane == 'x' ? ((Math.random() * rotateRandomness) - (rotateRandomness / 2)) : 0.1,
                y: Math.random() * 0.3,
            };
            if (newBlocks.chopped.position[newBlocks.plane] > newBlocks.placed.position[newBlocks.plane]) {
                positionParams[newBlocks.plane] = '+=' + (40 * Math.abs(newBlocks.direction));
            }
            else {
                positionParams[newBlocks.plane] = '-=' + (40 * Math.abs(newBlocks.direction));
            }
            TweenLite.to(newBlocks.chopped.position, 1, positionParams);
            TweenLite.to(newBlocks.chopped.rotation, 1, rotationParams);
        }
        this.addBlock();
    }
    addBlock() {
        let lastBlock = this.blocks[this.blocks.length - 1];
        if (lastBlock && lastBlock.state == lastBlock.STATES.MISSED) {
            return this.endGame();
        }
        this.scoreContainer.innerHTML = String(this.blocks.length - 1);
        //alert(this.blocks.length - 1)
        //if(this.blocks.length == 3){
        //    this.instructions.innerHTML = "Good work!";
        //}
        let newKidOnTheBlock = new Block(lastBlock);
        this.newBlocks.add(newKidOnTheBlock.mesh);
        this.blocks.push(newKidOnTheBlock);
        this.stage.setCamera(this.blocks.length * 2);
        if (this.blocks.length >= 5)
              this.instructions.classList.add('hide');
    }
    endGame() {
        pol = 20;
                this.stage.onResize2(pol)

         this.highscores = localStorage.getItem("highScore");

        this.aboutme = document.getElementById('aboutme');
        this.aboutme.innerHTML = 'Click to Start Again';

        this.stage.setCamera(5, 3 );
        counter = 0;

        var t = this.blocks.length - 1;

        if(t > this.highscores){

              localStorage.setItem('highScore',t - 1);
              this.scoreContainer2 = document.getElementById('scoreBestMain');

              this.scoreContainer2.innerHTML = t - 1;

        } else {
        this.scoreContainer2.innerHTML = this.highscores;
        }
            //scoreBestMain
            let interstitial

            document.addEventListener('deviceready', async () => {
              interstitial = new admob.InterstitialAd({
                adUnitId: 'ca-app-pub-5068089641717062/1993980008',
              })

              interstitial.on('load', (evt) => {
                // evt.ad
              })

              await interstitial.load()
              await interstitial.show()
            }, false)

            document.addEventListener('admob.ad.dismiss', async () => {
              // Once a interstitial ad is shown, it cannot be shown again.
              // Starts loading the next interstitial ad as soon as it is dismissed.
              await interstitial.load()
            })

        this.updateState(this.STATES.ENDED);
    }
    tick() {
        this.blocks[this.blocks.length - 1].tick();

        this.stage.render();
        requestAnimationFrame(() => { this.tick(); });
    }
}
let game = new Game();
