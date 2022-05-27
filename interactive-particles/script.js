const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];


// get mouse position
let mouse = {
	x: null,
	y: null,
    radius: 80 //size of mouse circle to break up particles
}
window.addEventListener('mousemove', 
	function(event){
		mouse.x = event.x + canvas.clientLeft/2;
		mouse.y = event.y + canvas.clientTop/2;
});

function drawImage(){
    let imageWidth = png.width || png.naturalWidth;
    let imageHeight = png.height || png.naturalHeight;
    const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
    ctx.clearRect(0,0,canvas.width, canvas.height);

    class Particle {
        constructor(x, y, color, size){
            this.x = x + canvas.width/2 - png.width * 2,
            this.y = y + canvas.height/2 - png.height * 2,
            this.color = color,
            this.size = 2,
            this.baseX = x + canvas.width/2 - png.width * 2,
            this.baseY = y + canvas.height/2 - png.height * 2,
            this.density = ((Math.random() * 10) + 2);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            ctx.fillStyle = this.color;

            // check mouse position/particle position - collision detection
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // distance past which the force is zero
            var maxDistance = 100;
            var force = (maxDistance - distance) / maxDistance;

            // if we go below zero, set it to zero.
            if (force < 0) force = 0;

            let directionX = (forceDirectionX * force * this.density) * 25; // increases particle distance
            let directionY = (forceDirectionY * force * this.density) * 25; // increases particle distance

            if (distance < mouse.radius + this.size){
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX ) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.x -= dx/5;
                } if (this.y !== this.baseY) {
                    let dx = this.x - this.baseX;
                    let dy = this.y - this.baseY;
                    this.y -= dy/5;
                }
            }
            this.draw();
        }
    }
    function init(){
        particleArray = [];

        for (var y = 0, y2 = data.height; y < y2; y++) {
            for (var x = 0, x2 = data.width; x < x2; x++) {
                if (data.data[(y * 4 * data.width) + (x * 4) + 3] > 128) {
                    let positionX = x;
                    let positionY = y;
                    let color = "rgb("+data.data[(y * 4 * data.width)+ (x * 4)]+","+data.data[(y * 4 * data.width)+ (x * 4) +1]+","+data.data[(y * 4 * data.width)+ (x * 4) +2]+")";

                    particleArray.push(new Particle(positionX*4, positionY*4, color));

                }
            }
        }
        
    }
    function animate(){
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(255,255,255,.2)';
        ctx.fillRect(0,0,innerWidth,innerHeight);
       // ctx.clearRect(0,0,innerWidth,innerHeight);
	    
	
	    for (let i = 0; i < particleArray.length; i++){
            particleArray[i].update();
	    }
    }
    init();
    animate();

    // RESIZE SETTING - empty and refill particle array every time window changes size + change canvas size
    window.addEventListener('resize',
	function(){
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		init();
	});
}

// ideal image is 100px x 100px transparent png, use png to base64 online converter to get data:image file
// check box for Data URL Valid data:image URL https://onlinepngtools.com/convert-png-to-base64
var png = new Image();
png.src = "data:image/png;base64,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"

// Run drawImage after page has been fully loaded
window.addEventListener('load', (event) => {
    console.log('page has loaded');
    ctx.drawImage(png, 0, 0);
    drawImage();
});