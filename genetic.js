//define global variables 
GENES = 300;
BALLS = 100;
VEL = 25;
MUT_RATE = 0.04; 

// initialise
balls = [];
generation = 0; 
mean_fitness = 0;

document.addEventListener("DOMContentLoaded", setup);

class Ball {
	
	constructor(x, y, context) {
		this.x = x;
		this.y = y;
		this.context = context;
		this.rad = 10;
		this.index = 0;
		this.fitness = 0;
		this.won = false;	
	}
	
	//draw our circles 
	draw(){
		this.context.fillStyle = '#349beb';
		//colour if successful
		if(this.done) {
			this.context.fillStyle = '#78d69b';
		}
		this.context.beginPath();
		this.context.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
		this.context.fill();
	}

	//
	update() {
		// our goal will be a 30x30 area with (x,y) at - 
		if(this.x > 385 && this.x < 415 && this.y > 760 && this.y < 790){
			this.won = true;
			this.index++;
		}
		else if(this.index < GENES){
			this.x += VEL*this.genes[this.index][0];
			this.y += VEL*this.genes[this.index][1];
			this.index++;
		}
	}

	//
	initGenes(genes){
		this.genes = genes;
	}

	// give the population random movements in the form of (x,y) vectors
	randomiseGenes(){
		this.genes = [];
		for(let i=0; i<GENES; i++){
			this.genes[i] = [Math.random()-0.5, Math.random()-0.5] 		
		}
	}
	
	//define the fitness as the distance from the goal
	findFitness(){	
		//calculate euclidean distance
		var s = Math.sqrt((this.x-400)**2 + (this.y-775)**2);
		this.fitness = 1 - (s/800)
		if(this.fitness < 0) this.fitness=0;
	}
	
}


function setup(){
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	for(let i=0; i<GENES; i++){
		var ball = new Ball;
		ball.randomiseGenes();
		balls.push(ball);
	}

	generateNewCanvas();
}


function lifetime(){
	if(generateion == 1500) return
	
	for(let i=0; i<GENES; i++){
		for(let j=0; j<BALLS; j++){
			balls[i].update();
		}
	}
	nextGen();
	lifetime();
}

function generateNewCanvas(){
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	
	requestAnimationFrame(generateNewCanvas);
	context.clearRect(0, 0, canvas.width, canvas.height);
    
	for(let i=0; i<BALLS; i++){
		var ball = balls[i];
		ball.update();
		ball.draw();
	}
	
	//draw the goal
	context.fillStyle = '#18344a';
	context.fillRect(385, 775, 30, 30);
	context.fillStyle = '#24282b';
	context.font = "28px SFMono-Regular";
	context.fillText("Generation: " + generation.toString(), 10, 50);
	context.fillText("Mean Fitness: " + mean_fitness.toFixed(2).toString(), 10, 80);
	
	if(balls[0].index == GENES) nextGen();

}	

function nextGen(){
	generation++;
	console.log("Generation ", generation);
	
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');

	//mating pool
	var candidates = [];
	var total_fitness = 0;
    	for (let i = 0; i < BALLS; i++) {
       		var ball = balls[i];
        	ball.findFitness();
        	total_fitness += ball.fitness; 
        	for (let j = 0; j < (2 ** (ball.fitness * 10)); j++) {
            	candidates.push(b);
        	}	
    	}
    mean_fitness = total_fitness / BALLS;
    console.log("mean fitness: ", mean_fitness);
	
	// reproduce
    var newBalls = [];
    for (let i = 0; i < BALLS; i++) {
        //parents
        var p1 = candidates[Math.floor(Math.random() * candidates.length)];
        var p2 = candidates[Math.floor(Math.random() * candidates.length)];
        // offspring
        var offspring = new Ball(385, 25, context);
        var genes = [];
        
        for (let j = 0; j < GENES; j++) {
            // mutate genes according to rate
            if (Math.random() < MUT_RATE) {
                genes.push([Math.random()-0.5, Math.random()-0.5]);
          	}
            else if (j % 2) { // p1 half
                genes.push(p1.genes[j]);
            }
            else { // p2 half
                genes.push(p2.genes[j]);
            }
        }
        ball.initGenes(genes);
        newBalls.push(ball)
    }

    balls = newBalls; // update generation
}



