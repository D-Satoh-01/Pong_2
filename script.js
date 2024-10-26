var randomized_number_1 = 0;
var randomized_number_2 = 0;
var counter_1 = 0;
var counter_2 = 0;
var counter_3 = 0;
var setBallVelDefault;
var score_player = 0;
var score_cpu = 0;
var level = 1;
var flag_run = false;
var game_over = false;

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
    get center_x(){
        return this.position.x + this.size.x / 2;
    }
    get center_y(){
        return this.position.y + this.size.y / 2;
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
        this.balls.position.x = 300;
        this.balls.position.y = 50;
        
        this.balls.velocity.x = 0;
        this.balls.velocity.y = 0;

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

        this.player_speed = 1
        this.cpu_speed = 0.5
        this.ball_speed_increment_paddle_x = 20;
        this.ball_speed_increment_paddle_y = 5;
        this.player_move_flag_up = false;
        this.player_move_flag_down = false;
        this.flag_run = false;
        this.game_over = false;

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

    randomize_1(){
        randomized_number_1 = Math.round(Math.random());
    }

    collide(){
        if (this.players[0].left < this.balls.right && this.players[0].right > this.balls.left && this.players[0].top < this.balls.bottom && this.players[0].bottom > this.balls.top){
            this.balls.velocity.x = -(this.balls.velocity.x) + this.ball_speed_increment_paddle_x;
            this.balls.velocity.y += -Math.abs(this.balls.velocity.y) * 0.1 - this.ball_speed_increment_paddle_y;
        }
        if (this.players[3].left < this.balls.right && this.players[3].right > this.balls.left && this.players[3].top < this.balls.bottom && this.players[3].bottom > this.balls.top){
            this.balls.velocity.x = -(this.balls.velocity.x) + this.ball_speed_increment_paddle_x;
            this.balls.velocity.y += -Math.abs(this.balls.velocity.y) * 0.1 - this.ball_speed_increment_paddle_y;
        }


        if (this.players[1].left < this.balls.right && this.players[1].right > this.balls.left && this.players[1].top < this.balls.bottom && this.players[1].bottom > this.balls.top){
            this.balls.velocity.x = -(this.balls.velocity.x) + this.ball_speed_increment_paddle_x;
        }
        if (this.players[4].left < this.balls.right && this.players[4].right > this.balls.left && this.players[4].top < this.balls.bottom && this.players[4].bottom > this.balls.top){
            this.balls.velocity.x = -(this.balls.velocity.x) + this.ball_speed_increment_paddle_x;
        }


        if (this.players[2].left < this.balls.right && this.players[2].right > this.balls.left && this.players[2].top < this.balls.bottom && this.players[2].bottom > this.balls.top){
            this.balls.velocity.x = -(this.balls.velocity.x) + this.ball_speed_increment_paddle_x;
            this.balls.velocity.y += Math.abs(this.balls.velocity.y) * 0.1 + this.ball_speed_increment_paddle_y;
        }
        if (this.players[5].left < this.balls.right && this.players[5].right > this.balls.left && this.players[5].top < this.balls.bottom && this.players[5].bottom > this.balls.top){
            this.balls.velocity.x = -(this.balls.velocity.x) + this.ball_speed_increment_paddle_x;
            this.balls.velocity.y += Math.abs(this.balls.velocity.y) * 0.1 + this.ball_speed_increment_paddle_y;
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

            if (inputtedValue.keyCode == 37){
                this.player_move_flag_left = true
            }
            if (inputtedValue.keyCode == 39){
                this.player_move_flag_right = true
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

            if (inputtedValue.keyCode == 37){
                this.player_move_flag_left = false
            }
            if (inputtedValue.keyCode == 39){
                this.player_move_flag_right = false
            }
        }
    }

    player_move(){
        if (!(this.players[0].top - 10 <= this.balls.bottom && this.players[2].bottom + 10 >= this.balls.top
            && this.players[1].left- 10 <= this.balls.right && this.players[1].right + 10 >= this.balls.left)){
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
            if (this.player_move_flag_left == true){
                this.players[0].position.x -= this.player_speed;
                this.players[1].position.x -= this.player_speed;
                this.players[2].position.x -= this.player_speed;
            }
            if (this.player_move_flag_right == true){
                this.players[0].position.x += this.player_speed;
                this.players[1].position.x += this.player_speed;
                this.players[2].position.x += this.player_speed;
            }
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
        if (this.players[1].left < 20){
            this.players[0].position.x = 25;
            this.players[1].position.x = 25;
            this.players[2].position.x = 25;
        }
        if (this.players[1].right >= 250){
            this.players[0].position.x = 235;
            this.players[1].position.x = 235;
            this.players[2].position.x = 235;
        }
    }

    setBallVelDefault(){
        if (level == 1){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -100;
            }
            else{
                this.balls.velocity.x = 100;
            }
            this.balls.velocity.y = 100;
        }
        if (level == 2){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -120;
            }
            else{
                this.balls.velocity.x = 120;
            }
            this.balls.velocity.y = 120;
        }
        if (level == 3){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -140;
            }
            else{
                this.balls.velocity.x = 140;
            }
            this.balls.velocity.y = 140;
        }
        if (level == 4){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -160;
            }
            else{
                this.balls.velocity.x = 160;
            }
            this.balls.velocity.y = 160;
        }
        if (level == 5){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -180;
            }
            else{
                this.balls.velocity.x = 180;
            }
            this.balls.velocity.y = 180;
        }
        if (level == 6){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -200;
            }
            else{
                this.balls.velocity.x = 200;
            }
            this.balls.velocity.y = 200;
        }
        if (level == 7){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -220;
            }
            else{
                this.balls.velocity.x = 220;
            }
            this.balls.velocity.y = 220;
        }
        if (level == 8){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -240;
            }
            else{
                this.balls.velocity.x = 240;
            }
            this.balls.velocity.y = 240;
        }
        if (level == 9){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -260;
            }
            else{
                this.balls.velocity.x = 260;
            }
            this.balls.velocity.y = 260;
        }
        if (level >= 10){
            if(randomized_number_1 == 0){
                this.balls.velocity.x = -280;
            }
            else{
                this.balls.velocity.x = 280;
            }
            this.balls.velocity.y = 280;
        }
    }

    reset_ball(){
        counter_3 += 1;
        
        this.balls.position.x = 300;
        this.balls.position.y = 50;
        this.balls.velocity.x = 0;
        this.balls.velocity.y = 0;
        if(counter_3 >= 140*1){
            this.setBallVelDefault();
            counter_3 = 0;
        }

    }

    return_ball(){
        if(this.balls.position.x < -10 || this.balls.position.x > 600 || this.balls.position.y < -10 || this.balls.position.y > 400){
            this.reset_ball();
        }
        if(this.balls.velocity.x > 1000 || this.balls.velocity.y > 1000){
            this.reset_ball();
        }
        if(this.balls.velocity.x < 50 || this.balls.velocity.y < 50 || this.balls.position.y < 50 || this.balls.position.y > canvas.height - 50){
            counter_2 += 1;
            
            if(this.balls.velocity.x > 20 || this.balls.velocity.y > 20){
                counter_2 = 0;
            }
            if(counter_2 >= 140*3){ //140で大体1秒
                this.reset_ball();
            }
        }
    }

    timer_ai_move_x(){
        counter_1 += 1;
        if(counter_1 == 140*1){ //140で大体1秒
            counter_1 = 0;
            randomized_number_2 = Math.round(Math.random()*10);
        }
    }

    game_manager(){
        this._context.font = "36px monospace";
        this._context.fillStyle = "#ffffff";
        this._context.fillText(score_player, canvas.width/10*2, canvas.height/10*2);
        this._context.fillText(score_cpu, canvas.width/10*8, canvas.height/10*2);
        this._context.fillText("LEVEL: " + level, canvas.width/10*4, canvas.height/10*9);

        if(this.balls.right >= 590){
            score_player += 1;
            this.reset_ball();
            if(score_player ==3){
                level += 1;
                score_player = 0;
                score_cpu = 0;
                this.cpu_speed += 0.2;
                this.ball_speed_increment_paddle_x += 20;
                this.reset_ball();
            }
        }
        
        if(this.balls.left <= 10){
            score_cpu += 1;
            this.reset_ball();
            if(score_cpu == 3){
                this.game_over = true;
                score_player = 0;
                score_cpu = 0;
                level = 1;
                this.cpu_speed = 0.5;
                this._context.fillText("Game Over", canvas.width/10*4, canvas.height/10*5);
                this.flag_run = false;
            }
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
        if(!(this.players[3].top - 10 <= this.balls.bottom && this.players[5].bottom + 10 >= this.balls.top
            && this.players[4].left- 10 <= this.balls.right && this.players[4].right + 10 >= this.balls.left)){
            if(this.players[4].position.y < this.balls.position.y){
                this.players[3].position.y += this.cpu_speed;
                this.players[4].position.y += this.cpu_speed;
                this.players[5].position.y += this.cpu_speed;
            }
            if(this.players[4].position.y > this.balls.position.y){
                this.players[3].position.y -= this.cpu_speed;
                this.players[4].position.y -= this.cpu_speed;
                this.players[5].position.y -= this.cpu_speed;
            }

            if(randomized_number_2 <= 3){
                this.players[3].position.x += this.cpu_speed;
                this.players[4].position.x += this.cpu_speed;
                this.players[5].position.x += this.cpu_speed;
            }
            if(randomized_number_2 >= 4 && randomized_number_2 <= 6){
                this.players[3].position.x = this.players[3].position.x;
                this.players[4].position.x = this.players[3].position.x;
                this.players[5].position.x = this.players[3].position.x;
            }
            if(randomized_number_2 >= 7){
                this.players[3].position.x -= this.cpu_speed;
                this.players[4].position.x -= this.cpu_speed;
                this.players[5].position.x -= this.cpu_speed;
            }
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
        if (this.players[4].right > canvas.width -20){
            this.players[3].position.x = canvas.width - 30;
            this.players[4].position.x = canvas.width - 30;
            this.players[5].position.x = canvas.width - 30;
        }
        if (this.players[4].left <= 350){
            this.players[3].position.x = 350;
            this.players[4].position.x = 350;
            this.players[5].position.x = 350;
        }
        
        this.randomize_1();
        this.collide();
        this.draw();
        this.player_move_input();
        this.player_move();
        this.return_ball();
        this.timer_ai_move_x();
        this.game_manager();
    }
}

const canvas = document.getElementById("screen");
const game = new Game(canvas);
