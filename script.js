let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

context.font = '2em "Rubik Bubbles"';

class Block {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.width = width;
    }
}

class Tower {
    constructor() {
        this.blocks = [];
        this.debris = new Block(0, 0, 0);
        this.scrollCounter = 0;
        this.cameraY = 0;
        this.current = 1;
        this.mode = 'bounce';
        this.xSpeed = 2;
        this.ySpeed = 5;
        this.height = 50;

        this.blocks.push(new Block(300, 300, 200));
        this.newBlock();
    }

    newBlock() {
        this.blocks[this.current] = new Block(0, (this.current + 10) * this.height, this.blocks[this.current - 1].width);
    }

    gameOver() {
        this.mode = 'gameOver';
        context.fillText('Game over. Click to play again!', 50, 100);
    }

    animate() {
        if (this.mode != 'gameOver') {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillText('Score: ' + (this.current - 1).toString(), 100, 200);

            let red = 70;
            let green = 10;
            let blue = 150;
            let redF = true;
            let greenF = true;
            let blueF = true;

            for (let n = 0; n < this.blocks.length; n++) {
                let box = this.blocks[n];
                if (redF) red += 30;
                else red -= 30;
                if (greenF) green += 20;
                else green -= 20;
                if (blueF) blue += 30;
                else blue -= 30;

                if (red >= 255) redF = false;
                else if (red <= 0) redF = true;
                if (blue >= 255) blueF = false;
                else if (blue <= 0) blueF = true;
                if (green >= 255) greenF = false;
                else if (green <= 0) greenF = true;

                let color = `rgb(${red},${green},${blue})`;
                context.fillStyle = color;
                context.fillRect(box.x, 600 - box.y + this.cameraY, box.width, this.height);
            }
            context.fillStyle = 'white';
            context.fillRect(this.debris.x, 600 - this.debris.y + this.cameraY, this.debris.width, this.height);

            if (this.mode == 'bounce') {
                this.blocks[this.current].x += this.xSpeed;
                if (this.blocks[this.current].x + this.blocks[this.current].width > canvas.width || this.blocks[this.current].x < 0) {
                    this.xSpeed = -this.xSpeed;
                }
            } else if (this.mode == 'fall') {
                this.blocks[this.current].y -= this.ySpeed;
                if (this.blocks[this.current].y <= this.blocks[this.current - 1].y + this.height) {
                    this.handleFall();
                }
            }

            this.debris.y -= this.ySpeed;
            if (this.scrollCounter) {
                this.cameraY++;
                this.scrollCounter--;
            }
        }
        window.requestAnimationFrame(() => this.animate());
    }

    handleFall() {
        this.mode = 'bounce';
        let difference = this.blocks[this.current].x - this.blocks[this.current - 1].x;
        if (Math.abs(difference) >= this.blocks[this.current].width) {
            this.gameOver();
        } else {
            this.debris = new Block(this.blocks[this.current].x > this.blocks[this.current - 1].x
                ? this.blocks[this.current].x + this.blocks[this.current].width
                : this.blocks[this.current].x - difference,
                this.blocks[this.current].y, difference);

            if (this.blocks[this.current].x > this.blocks[this.current - 1].x) {
                this.blocks[this.current].width -= difference;
            } else {
                this.blocks[this.current].width += difference;
                this.blocks[this.current].x = this.blocks[this.current - 1].x;
            }

            this.xSpeed = this.xSpeed > 0 ? this.xSpeed + 1 : this.xSpeed - 1;
            this.current++;
            this.scrollCounter = this.height;
            this.newBlock();
        }
    }

    restart() {
        this.blocks.splice(1, this.blocks.length - 1);
        this.mode = 'bounce';
        this.cameraY = 0;
        this.scrollCounter = 0;
        this.xSpeed = 2;
        this.current = 1;
        this.newBlock();
        this.debris.y = 0;
    }
}

let tower = new Tower();

canvas.onpointerdown = () => {
    if (tower.mode == 'gameOver') {
        tower.restart();
    } else if (tower.mode == 'bounce') {
        tower.mode = 'fall';
    }
};

document.addEventListener('keydown', (event) => {
    if (event.keyCode === 32) {
        if (tower.mode == 'gameOver') {
            tower.restart();
        } else if (tower.mode == 'bounce') {
            tower.mode = 'fall';
        }
    }
});


document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        tower.restart();
    }
});

tower.restart();
tower.animate();



