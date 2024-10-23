class Vector {
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(w, h){
        this.position = new Vector;
        this.size = new Vector(w, h);
    }

    //四角形の左右上下の端の座標を定義しておく
    get left(){
        return this.position.x;
    }
    get right(){
        return this.position.x + this.size.x;
    }
    get top(){
        return this.position.y;
    }
    get bottom(){
        return this.position.y + this.size.y;
    }
}

class Ball extends Rect { //extendsでクラスの継承
    constructor(){
        super(10, 10);
        this.velocity = new Vector;
    }
}

class Player extends Rect{
    constructor(){
        super(10, 30);
        this.score = 0;
    }
}

class Game {
    constructor(canvas){
        this._canvas = canvas; //ｱﾝﾀﾞｰﾊﾞｰから始まる変数はクラス内でのみ使われるものであることを示す
        this._context = canvas.getContext("2d");

        //Ballのインスタンス化
        this.balls = new Ball;
        this.balls.position.x = 100;
        this.balls.position.y = 50;

        this.balls.velocity.x = 150;
        this.balls.velocity.y = 150;

        //プレイヤークラスのインスタンスの生成
        this.players = [
            new Player,
            new Player,
            new Player,
            new Player,
            new Player,
            new Player
        ];

        this.players[0].position.x = 40;
        this.players[0].position.y = canvas.height/2 - 30;
        this.players[1].position.x = 40;
        this.players[1].position.y = canvas.height/2;
        this.players[2].position.x = 40;
        this.players[2].position.y = canvas.height/2 + 30;

        this.players[3].position.x = canvas.width - 40;
        this.players[3].position.y = canvas.height/2 - 30;
        this.players[4].position.x = canvas.width - 40;
        this.players[4].position.y = canvas.height/2;
        this.players[5].position.x = canvas.width - 40;
        this.players[5].position.y = canvas.height/2 + 30;

        this.player_speed = 3
        this.ai_speed = 2
        this.player_move_flag_up = false;
        this.player_move_flag_down = false;

        this.player_move_input();

        let lastTime;

        const callback = (milli_second) => {
            if(lastTime){
                this.update((milli_second - lastTime) / 1000);
            }
            lastTime = milli_second;
            requestAnimationFrame(callback);
        }
    callback();
    }

    collide(){
        if(this.players[0].top < this.balls.bottom && this.players[0].right > this.balls.left && this.players[0].bottom > this.balls.top && this.players[0].left < this.balls.right || this.players[3].top < this.balls.bottom && this.players[3].left < this.balls.right && this.players[3].bottom > this.balls.top){
            this.balls.velocity.x = -this.balls.velocity.x;
            this.balls.velocity.y -= this.balls.velocity.y * 0.9 + 50;
        }

        if(this.players[1].top < this.balls.bottom && this.players[1].right > this.balls.left && this.players[1].bottom > this.balls.top && this.players[1].left < this.balls.right){
            this.balls.velocity.x = - this.balls.velocity.x;
        }
        if(this.players[4].top < this.balls.bottom && this.players[4].right > this.balls.left && this.players[4].bottom > this.balls.top && this.players[4].left < this.balls.right){
            this.balls.velocity.x = - this.balls.velocity.x;
        }

        if(this.players[2].top < this.balls.bottom && this.players[2].right > this.balls.left && this.players[2].bottom > this.balls.top  && this.players[2].left < this.balls.right || this.players[5].top < this.balls.bottom && this.players[5].left < this.balls.right && this.players[5].bottom > this.balls.top){
            this.balls.velocity.x = -this.balls.velocity.x;
            this.balls.velocity.y += this.balls.velocity.y * 0.9 + 50;
        }
    }

    draw(){
        this._context.fillStyle = "#222222";
        this._context.fillRect(0,0,canvas.width,canvas.height);
    
        this.drawRect(this.balls);

        this.players.forEach(player => this.drawRect(player));
    }

    drawRect(rect) {
        this._context.fillStyle = "#ffffff";
        this._context.fillRect(rect.position.x, rect.position.y, rect.size.x, rect.size.y);
    }

    player_move_input(){
        window.onkeydown = (inputtedValue) => {
            //上下の入力
            if (inputtedValue.keyCode == 38){
                this.player_move_flag_up = true
            }
            if (inputtedValue.keyCode == 40){
                this.player_move_flag_down = true
            }
        }

        window.onkeyup = (inputtedValue) => {
            //上下の入力停止
            if (inputtedValue.keyCode == 38){
                this.player_move_flag_up = false
            }
            if (inputtedValue.keyCode == 40){
                this.player_move_flag_down = false
            }
        }
    }

    player_move(){
        if (this.player_move_flag_down == true){
            this.players[0].position.y += this.player_speed;
            this.players[1].position.y += this.player_speed;
            this.players[2].position.y += this.player_speed;
        }
        if (this.player_move_flag_up == true){
            this.players[0].position.y -= this.player_speed;
            this.players[1].position.y -= this.player_speed;
            this.players[2].position.y -= this.player_speed;
        }

        //プレイヤーの壁への当たり判定
        if (this.players[0].top <= 0){
            this.players[0].position.y = 0;
            this.players[1].position.y = 30;
            this.players[2].position.y = 60;
        }
        if (this.players[2].bottom >= canvas.height){
            this.players[0].position.y = canvas.height - 90;
            this.players[1].position.y = canvas.height - 60;
            this.players[2].position.y = canvas.height - 30;
        }
    }

    update(delta_time){
        this.balls.position.x += this.balls.velocity.x * delta_time;
        this.balls.position.y += this.balls.velocity.y * delta_time;

        //壁の定義
        if(this.balls.left < 0 || this.balls.right > this._canvas.width){
            this.balls.velocity.x = -this.balls.velocity.x;
        }
        if(this.balls.top < 0 || this.balls.bottom > this._canvas.height){
            this.balls.velocity.y = -this.balls.velocity.y;
        }

        //AIの挙動
        if (this.players[4].position.y < this.balls.position.y){
            this.players[3].position.y += this.ai_speed;
            this.players[4].position.y += this.ai_speed;
            this.players[5].position.y += this.ai_speed;
        }
        if (this.players[4].position.y > this.balls.position.y){
            this.players[3].position.y -= this.ai_speed;
            this.players[4].position.y -= this.ai_speed;
            this.players[5].position.y -= this.ai_speed;
        }
        
        //AIの壁への当たり判定
        if (this.players[3].top <= 0){
            this.players[3].position.y = 0;
            this.players[4].position.y = 30;
            this.players[5].position.y = 60;
        }
        if (this.players[5].bottom >= canvas.height){
            this.players[3].position.y = canvas.height - 90;
            this.players[4].position.y = canvas.height - 60;
            this.players[5].position.y = canvas.height - 30;
        }
        
        this.collide();

        this.draw();
        this.player_move();
        
    }
}

const canvas = document.getElementById("screen");
const game = new Game(canvas);
