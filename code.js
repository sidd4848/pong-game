window.onload = function(){
	var canvas = document.getElementById("pong");
	var ctx = canvas.getContext("2d");
	var x = canvas.width/2;
	var y = canvas.height - 30;
	var dx=2;
	var dy=-2;
	var ballRadius = 4;
	var paddleHeight = 3;
	var paddleWidth = 75;
	var paddleX = (canvas.width-paddleWidth)/2;
	var rightPressed = false;
	var leftPressed = false;
	var brickRowCount=6;
	var brickColumnCount = 13;
	var brickWidth = 40;
	var brickHeight =20;
	var brickPadding = 3;
	var brickOffsetTop = 30;
	var brickOffsetleft = 30;
	var score = 0;
	var HighScore = 0;
	var highest;//improve the set cookie
	var lives=3;
	var speed=10;
	
	var bricks =[];
	for(var c=0;c<brickColumnCount;c++){
		bricks[c] = [];
		for(var r=0;r<brickRowCount;r++)
	     bricks[c][r]={x:0, y:0, status:1};
	}
	
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
		while (c.charAt(0)==' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length,c.length);
			}
		}
    return "";
	}
	function drawLives(){
		ctx.font ="25px Arial";
		ctx.fillStyle= "red";
		ctx.fillText("lives::"+lives,((canvas.width)/2)-50,20)
	}
	
	function drawBall(){
	    ctx.beginPath();
		ctx.arc(x,y,ballRadius,0,Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}
	
	function drawPaddle(){
		ctx.beginPath();
		ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
		ctx.fillStyle="#0095DD";
		ctx.fill();
		ctx.closePath();
	}
	function drawBricks(){
		for(var c=0;c<brickColumnCount;c++){
			for(var r=0;r<brickRowCount;r++){
				if(bricks[c][r].status==1){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetleft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x=brickX;
				bricks[c][r].y=brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle="#0095DD";
				ctx.fill();
				ctx.closePath();
				}
			}
		}
	}
	function check(){ //randomly increase the blocks
		var count=0;
		for(var c=0;c<brickColumnCount;c++){
			for(var r=0;r<brickRowCount;r++){
				b=bricks[c][r];
				if(b.status==1)
					count++;
				}
			}
		if(count<8){
			var a = Math.floor((Math.random())*brickColumnCount);
			var b = Math.floor((Math.random())*brickRowCount);
			bricks[a][b].status =1;
			bricks[a+1][b].status =1;
			bricks[a][b+1].status =1;
			bricks[a-1][b].status =1;
			bricks[a][b-1].status =1;
			bricks[a-1][b-1].status =1;
			bricks[a+1][b+2].status =1;
			
		}
	
	}
	function collisionDetection(){
	     for(var c=0;c<brickColumnCount;c++){
			for(var r=0;r<brickRowCount;r++){
			  var b= bricks[c][r];
			  if(b.status==1)
			  if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight)
			  {dy=-dy;
				b.status=0;
				score++;
				}
				if(HighScore<score){
					HighScore = score;
				setCookie(highest, HighScore, 4);
				}
			}
		 }
	}
	
	function drawScore(){
		ctx.font = "24px Arial";
		ctx.fillStyle = "black";
		ctx.fillText("Score:"+score,8,20);
		ctx.font = "18px Arial";
		ctx.fillText("Siddharth ranjan",canvas.width-100,16)
	}
	
	function draw(){
		ctx.clearRect(0,0,canvas.width, canvas.height);
		drawBall();
		drawPaddle();
		drawBricks();
		
		if(x+dx > canvas.width-ballRadius || x+dx < ballRadius)
			dx=-dx;
		if(y+dy < ballRadius)
			dy=-dy;
		else if(y+dy > canvas.height - ballRadius)
		{
			if(x>paddleX && x < paddleX+paddleWidth)
				dy=-dy;
			else{
				
				lives--;
			if(!lives){
			alert("GAME OVER BRODA your score is"+score);
			document.location.reload();
			}
			else{
				x=canvas.width/2;
				y=canvas.height-30;
				dx=2;
				dx=-2;
				paddleX = (canvas.width - paddleWidth)/2;
			}
		}
		}
		collisionDetection();
		drawScore();
		drawLives();
		check();
		if(rightPressed && paddleX < canvas.width-paddleWidth)
            paddleX += 7;
        else if(leftPressed && paddleX > 0)
            paddleX -= 7;
		x += dx;
		y += dy;
		document.getElementById("display").innerHTML = getCookie(highest);
	}
	document.addEventListener("keydown",keyDownHandler,false);
	document.addEventListener("keyup",keyUpHandler,false);
	document.addEventListener("mousemove", mouseMoveHandler, false);
	
	function mouseMoveHandler(e){
		var relativeX = e.clientX - canvas.offsetLeft;
		 if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
	}
	function keyDownHandler(e) {
    if(e.keyCode == 39)
        rightPressed = true;
    else if(e.keyCode == 37)
        leftPressed = true;
	}

    function keyUpHandler(e) {
		if(e.keyCode == 39) 
			rightPressed = false;
    else if(e.keyCode == 37) 
        leftPressed = false;
    }
	setInterval(draw,speed);//every 10 millisecond draw will execute
    
}