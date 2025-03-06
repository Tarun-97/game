const canvas=document.querySelector('canvas');
const c=canvas.getContext('2d');

const db=document.querySelector(".db");

canvas.width=1024;
canvas.height=576;

//slicing collisons array
const collisionsMap=[]
for(let i=0;i<collisions.length;i+=100)
{
    collisionsMap.push(collisions.slice(i,i+100))
}

//boundary class and draw class
class Boundary{
    static width=38.4
    static height=38.4
    constructor({position}){
        this.position=position
        this.width=38.4
        this.height=38.4
    }

    draw(){
        c.fillStyle="rgba(0,0,0,0%)"
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
}

//drawing boundries
const boundaries=[]

const worker=[]
const plan1=[]
const plan2=[]
const resp=[]
const aryan=[]

// offset of background etc
const offset={
    x:-1430,
    y:-1300
}

//filtering collisions 
collisionsMap.forEach((row,i)=>{
    row.forEach((symbol,j)=>{
        if(symbol===2423){
             boundaries.push(
                new Boundary({
                    position:{
                        x:j*Boundary.width + offset.x,
                        y:i*Boundary.height +offset.y
                    }
                })
            )
        } 

        if(symbol===6665)
        {
            worker.push(
                new Boundary({
                    position:{
                        x:j*Boundary.width + offset.x,
                        y:i*Boundary.height +offset.y
                    }
                })
            )
        }

        if(symbol===5479)
            {
                plan1.push(
                    new Boundary({
                        position:{
                            x:j*Boundary.width + offset.x,
                            y:i*Boundary.height +offset.y
                        }
                    })
                )
            }
        if(symbol===6535)
        {
            plan2.push(
                new Boundary({
                    position:{
                        x:j*Boundary.width + offset.x,
                        y:i*Boundary.height +offset.y
                    }
                })
            )
        }
        if(symbol===6822)
            {
                resp.push(
                    new Boundary({
                        position:{
                            x:j*Boundary.width + offset.x,
                            y:i*Boundary.height +offset.y
                        }
                    })
                )
            }
        if(symbol===5214)
        {
            aryan.push(
                new Boundary({
                    position:{
                        x:j*Boundary.width + offset.x,
                        y:i*Boundary.height +offset.y
                    }
                })
            )
        }
    })
})

//background image
const image=new Image();
image.src="./imgs/finial map.png";

//player image
const playerDownImage=new Image();
playerDownImage.src="./imgs/chardown.png";

const playerUpImage=new Image();
playerUpImage.src="./imgs/charup.png";

const playerLeftImage=new Image();
playerLeftImage.src="./imgs/charleft.png";

const playerRightImage=new Image();
playerRightImage.src="./imgs/charright.png";

//creating sprite class for game sprites
class Sprite{
    constructor({position,image,frames={max:1},sprites}){
        this.position=position
        this.image=image
        this.frames={...frames,val:0, elapsed:0}

        this.image.onload=()=>{
            this.width=this.image.width/ this.frames.max
            this.height=this.image.height
        }
        this.moving=false
        this.sprites=sprites
    }
    draw(){
        c.drawImage(this.image, background.position.x, background.position.y);
        c.drawImage(
           this.image, 
            this.frames.val*this.width,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        )
        if(this.moving==true)
        {
            if(this.frames.max>1){
                this.frames.elapsed++
            }
            if(this.frames.elapsed%8 ===0)
            {
                if(this.frames.val <this.frames.max-1)
                    this.frames.val++
               else 
               this.frames.val=0
            }     
        }
     
    }
}

//creating player sprite
const player=new Sprite({
    position:{
        x:canvas.width/2,
        y:canvas.height/2
    },
    image:playerDownImage,
    frames:{
        max:4
    },
    sprites:{
        up: playerUpImage,
        down: playerDownImage,
        left:playerLeftImage,
        right:playerRightImage
    }
})

//background sprite
const background= new Sprite({
    position:{
        x:offset.x,
        y:offset.y
    },
    image:image
});

//key false/true
const keys  ={
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    },
    f:{
        pressed:false
    }
}

const movables=[background,...boundaries,...worker,...plan1,...plan2,...resp,...aryan]

function rectcollsion({rect1,rect2}){
    return(
        rect1.position.x +rect1.width >=rect2.position.x &&
        rect1.position.x<=rect2.position.x+rect2.width &&
        rect1.position.y<= rect2.position.y+rect2.height &&
        rect1.position.y+rect1.height >= rect2.position.y
    )
}

// Random movement variables
let isRandomMoving = true;
let currentDirection = null;
let directionTimer = 0;
let directionDuration = 0;
const possibleDirections = ['w', 'a', 's', 'd', null]; // null means no movement

// Function to set a random direction
function setRandomDirection() {
    // Clear previous direction
    keys.w.pressed = false;
    keys.a.pressed = false;
    keys.s.pressed = false;
    keys.d.pressed = false;
    
    // Choose new random direction (including potential stops)
    currentDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
    
    // Set the chosen direction to true
    if (currentDirection) {
        keys[currentDirection].pressed = true;
    }
    
    // Set a random duration for this direction (between 1-3 seconds)
    directionDuration = Math.random() * 2000 + 1000;
    directionTimer = 0;
}

// Initialize with a random direction
setRandomDirection();

// Dialog boxes definitions
dialauges = {
    workers: `<pre>
construction going on skeedadle kid

I think there might be more rooms to add portals to other plannets.

we arnt that sure tho, we just work for the money hehehe
</pre>`,

    aryan: `
<pre>Hey man
Thats an extra terrestrial being
Still tryna figure it out
Communication is kinda tough
<SCHREEEEEEEH>
Yikes! Maybe in the next update we will bring the alien in?</pre>`,

    plan1: `<pre>51 Pegasi B


 Oh, it's a wild place! It's a giant gas planet, really hot, like frying an egg on the sidewalk!
You'd better keep those eggs away from it! They will start cooking at that temperature!!!
Also, as giant ball of gas with no real atmosphere it's mostly made of hydrogen and helium, 
so if you ever meet an alien from there, be prepared for some very squeaky and weird voices!


well the portal takes you there but its under construction.....</pre>`,

    resp: `<pre>
Welcome to the Nasa space station to explore and learn about the exoplanets closest to us.

our facility is top class(though its under construction right now) and have one of the worlds best scientists  on board with us.

explore at your own pace go to the top rooms and talk to the scientists there to find out more about the planets.

You can talk to one of the developer of the project as well he will be there near the alien (bottom right of the map)
</pre>
`,

    plan2: `
<pre>PROXIMA CENTURI B


It is the closest extrasolar planet and might even be habitable from the research done by us humans.
So Proxima Centauri b is believed to be a rocky planet,
similar to Earth, it's bigger in mass than Earth but not as big as the gas giants.
Proxima Centauri b orbits within the habitable zone of its star, Proxima Centauri,
where conditions might allow for liquid water to exist.

well the portal takes you there but its under construction.....
</pre>`
}

// Chat responses for the character
const chatResponses = {
    "hey": "Hi there! How are you?",
    "hello": "Hello! Nice to meet you!",
    "hi": "Hey! What's up?",
    "who are you": "I'm an explorer in this space station! Looking for cool exoplanets!",
    "what's your name": "I'm the Explorer! Just wandering around learning about space!",
    "how are you": "I'm doing great! Exploring is fun!",
    "where am i": "You're in the NASA space station that studies exoplanets!",
    "help": "Use WASD to move manually, F to interact, R to toggle random movement. You can also type 'stop', 'move', or 'die' to control me!",
    "die": "Oh no! I'm dying... *dramatic fall*"
};

// Function to show death screen and restart game
function showDeathScreen() {
    // Create a full-screen red overlay
    const deathOverlay = document.createElement('div');
    deathOverlay.style.position = 'fixed';
    deathOverlay.style.top = '0';
    deathOverlay.style.left = '0';
    deathOverlay.style.width = '100%';
    deathOverlay.style.height = '100%';
    deathOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
    deathOverlay.style.zIndex = '2000';
    deathOverlay.style.display = 'flex';
    deathOverlay.style.justifyContent = 'center';
    deathOverlay.style.alignItems = 'center';
    deathOverlay.style.flexDirection = 'column';
    
    // Add death message
    const deathMessage = document.createElement('h1');
    deathMessage.textContent = 'CHARACTER DIED';
    deathMessage.style.color = 'white';
    deathMessage.style.fontFamily = 'Arial, sans-serif';
    deathMessage.style.fontSize = '48px';
    deathMessage.style.textShadow = '2px 2px 4px #000000';
    
    // Add restart message
    const restartMessage = document.createElement('p');
    restartMessage.textContent = 'Restarting in 3 seconds...';
    restartMessage.style.color = 'white';
    restartMessage.style.fontFamily = 'Arial, sans-serif';
    restartMessage.style.fontSize = '24px';
    restartMessage.style.marginTop = '20px';
    
    // Append elements to the overlay
    deathOverlay.appendChild(deathMessage);
    deathOverlay.appendChild(restartMessage);
    
    // Append the overlay to the body
    document.body.appendChild(deathOverlay);
    
    // Set a timeout to restart the game
    setTimeout(() => {
        // Remove the overlay
        document.body.removeChild(deathOverlay);
        
        // Reset character position to starting point
        player.position.x = canvas.width/2;
        player.position.y = canvas.height/2;
        player.image = playerDownImage;
        
        // Reset map position to starting point
        background.position.x = offset.x;
        background.position.y = offset.y;
        
        // Reset all boundaries positions
        movables.forEach(movable => {
            if (movable !== background && movable !== player) {
                const originalX = offset.x + (Math.floor((movable.position.x - offset.x) / Boundary.width) * Boundary.width);
                const originalY = offset.y + (Math.floor((movable.position.y - offset.y) / Boundary.height) * Boundary.height);
                movable.position.x = originalX;
                movable.position.y = originalY;
            }
        });
        
        // Reset movement
        keys.w.pressed = false;
        keys.a.pressed = false;
        keys.s.pressed = false;
        keys.d.pressed = false;
        
        // Add a message to the chat
        addChatMessage("System", "Game restarted! Welcome back to the space station.");
    }, 3000);
}

// Create a chat interface
function createChatInterface() {
    // Create and style the chat container
    const chatContainer = document.createElement('div');
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '10px';
    chatContainer.style.left = '50%';
    chatContainer.style.transform = 'translateX(-50%)';
    chatContainer.style.width = '80%';
    chatContainer.style.maxWidth = '800px';
    chatContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    chatContainer.style.borderRadius = '10px';
    chatContainer.style.padding = '10px';
    chatContainer.style.zIndex = '1000';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.gap = '10px';
    
    // Create chat messages area
    const messagesContainer = document.createElement('div');
    messagesContainer.style.maxHeight = '150px';
    messagesContainer.style.overflowY = 'auto';
    messagesContainer.style.color = 'white';
    messagesContainer.style.paddingRight = '10px';
    messagesContainer.style.marginBottom = '5px';
    messagesContainer.id = 'chat-messages';
    
    // Create input area
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '10px';
    
    // Create input field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.placeholder = 'Type a message...';
    inputField.style.flex = '1';
    inputField.style.padding = '8px 12px';
    inputField.style.borderRadius = '5px';
    inputField.style.border = 'none';
    inputField.style.outline = 'none';
    inputField.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    inputField.id = 'chat-input';
    
    // Create send button
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.padding = '8px 15px';
    sendButton.style.borderRadius = '5px';
    sendButton.style.border = 'none';
    sendButton.style.backgroundColor = '#4CAF50';
    sendButton.style.color = 'white';
    sendButton.style.cursor = 'pointer';
    sendButton.id = 'send-button';
    
    // Add elements to the DOM
    inputContainer.appendChild(inputField);
    inputContainer.appendChild(sendButton);
    chatContainer.appendChild(messagesContainer);
    chatContainer.appendChild(inputContainer);
    document.body.appendChild(chatContainer);
    
    // Add a welcome message
    addChatMessage("System", "Welcome to the space station! Type 'help' for commands.");
    
    // Add event listeners
    sendButton.addEventListener('click', handleChatMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatMessage();
        }
    });
}

// Function to add a message to the chat
function addChatMessage(sender, message) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.style.marginBottom = '5px';
    
    // Style based on sender
    if (sender === "You") {
        messageElement.style.textAlign = 'right';
        messageElement.innerHTML = `<span style="background-color: #4CAF50; padding: 3px 8px; border-radius: 10px;">${message}</span> <strong>${sender}</strong>`;
    } else if (sender === "Character") {
        messageElement.style.textAlign = 'left';
        messageElement.innerHTML = `<strong>${sender}</strong> <span style="background-color: #2196F3; padding: 3px 8px; border-radius: 10px;">${message}</span>`;
    } else {
        // System message
        messageElement.style.textAlign = 'center';
        messageElement.innerHTML = `<span style="background-color: #FF9800; padding: 3px 8px; border-radius: 10px; color: black;"><em>${message}</em></span>`;
    }
    
    messagesContainer.appendChild(messageElement);
    // Scroll to the bottom to show newest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to handle chat messages
function handleChatMessage() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim().toLowerCase();
    
    if (message) {
        // Add user message to chat
        addChatMessage("You", inputField.value);
        
        // Process commands
        if (message === "stop") {
            isRandomMoving = false;
            keys.w.pressed = false;
            keys.a.pressed = false;
            keys.s.pressed = false;
            keys.d.pressed = false;
            addChatMessage("Character", "I'll stop moving now.");
        } 
        else if (message === "move") {
            isRandomMoving = true;
            setRandomDirection();
            addChatMessage("Character", "I'll start moving now!");
        }
        else if (message === "die") {
            // Add character response
            addChatMessage("Character", chatResponses[message]);
            
            // Disable movement during death sequence
            isRandomMoving = false;
            keys.w.pressed = false;
            keys.a.pressed = false;
            keys.s.pressed = false;
            keys.d.pressed = false;
            
            // Show death screen and restart
            showDeathScreen();
        }
        else if (message in chatResponses) {
            // Add character response for known messages
            addChatMessage("Character", chatResponses[message]);
        }
        else {
            // Generic response for unknown messages
            addChatMessage("Character", "I'm not sure what you mean. Try 'help' for commands.");
        }
        
        // Clear input field
        inputField.value = "";
    }
}

// Call this function to create the chat interface when the page loads
createChatInterface();

//animationloop
function animate() {
    window.requestAnimationFrame(animate);

    //loading images on to the screen
    //drawing background
    background.draw()

    //drawing boundaries
    boundaries.forEach(boundary => {
        boundary.draw()
    })

    worker.forEach(boundary => {
        boundary.draw()
    })

    plan1.forEach(boundary => {
        boundary.draw()
    })
    
    plan2.forEach(boundary => {
        boundary.draw()
    })

    resp.forEach(boundary => {
        boundary.draw()
    })

    aryan.forEach(boundary => {
        boundary.draw()
    })

    // drawing character 
    player.draw()

    // Update random movement timer if random movement is enabled
    if (isRandomMoving) {
        directionTimer += 16; // Approximately 16ms per frame at 60fps
        
        // If enough time has passed, change direction
        if (directionTimer >= directionDuration) {
            setRandomDirection();
        }
    }

    let chars = {
        work: false,
        resp: false,
        pal1: false,
        plan2: false,
        aryan: false
    }
    
    //movement 
    let moving = true;
    player.moving = false;

    // Handle dialog interactions
    if (keys.f.pressed) {
        //workers validity
        for (let i = 0; i < worker.length; i++) {
            const boundary = worker[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                chars.work = true;
                db.style.display = "block";
                if (chars.work) {
                    db.innerHTML = "<p>" + dialauges.workers + "</P>";
                }
            }
        }
        //plannet 1 validity
        for (let i = 0; i < plan1.length; i++) {
            const boundary = plan1[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                chars.work = true;
                db.style.display = "block";
                if (chars.work) {
                    db.innerHTML = "<p>" + dialauges.plan1 + "</P>";
                }
            }
        }
        //plannet 2 validity
        for (let i = 0; i < plan2.length; i++) {
            const boundary = plan2[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                chars.plan2 = true;
                db.style.display = "block";
                if (chars.plan2) {
                    db.innerHTML = "<p>" + dialauges.plan2 + "</P>";
                }
            }
        }
        //respo validity
        for (let i = 0; i < resp.length; i++) {
            const boundary = resp[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                chars.resp = true;
                db.style.display = "block";
                if (chars.resp) {
                    db.innerHTML = "<p>" + dialauges.resp + "</P>";
                }
            }
        }
        //aryan validity    
        for (let i = 0; i < aryan.length; i++) {
            const boundary = aryan[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                chars.aryan = true;
                db.style.display = "block";
                if (chars.aryan) {
                    db.innerHTML = "<p>" + dialauges.aryan + "</P>";
                }
            }
        }
    }
    else {
        moving = true;
        db.style.display = "none";
    }

    // Handle movement based on key presses (or random movement)
    if (keys.w.pressed) {
        player.moving = true;
        player.image = player.sprites.up;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 10
                    }
                }
            })) {
                moving = false;
                // If random movement is enabled and we hit a boundary, change direction
                if (isRandomMoving) {
                    setRandomDirection();
                }
                break;
            }
        }
        //workers validity
        for (let i = 0; i < worker.length; i++) {
            const boundary = worker[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 10
                    }
                }
            })) {
                chars.work = true;
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y += 8;
            });
        }
    }
    else if (keys.a.pressed) {
        player.moving = true;
        player.image = player.sprites.left;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x + 10,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                // If random movement is enabled and we hit a boundary, change direction
                if (isRandomMoving) {
                    setRandomDirection();
                }
                break;
            }
        }

        //workers validity
        for (let i = 0; i < worker.length; i++) {
            const boundary = worker[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 10
                    }
                }
            })) {
                chars.work = true;
            }
        }
        
        if (moving) {
            movables.forEach(movable => {
                movable.position.x += 8;
            });
        }
    }
    else if (keys.s.pressed) {
        player.moving = true;
        player.image = player.sprites.down;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 10
                    }
                }
            })) {
                moving = false;
                // If random movement is enabled and we hit a boundary, change direction
                if (isRandomMoving) {
                    setRandomDirection();
                }
                break;
            }
        }

        //workers validity
        for (let i = 0; i < worker.length; i++) {
            const boundary = worker[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 10
                    }
                }
            })) {
                chars.work = true;
            }
        }

        if (moving) {
            movables.forEach(movable => {
                movable.position.y -= 8;
            });
        }
    }
    else if (keys.d.pressed) {
        player.image = player.sprites.right;
        player.moving = true;
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectcollsion({
                rect1: player,
                rect2: {
                    ...boundary, position: {
                        x: boundary.position.x - 10,
                        y: boundary.position.y
                    }
                }
            })) {
                moving = false;
                // If random movement is enabled and we hit a boundary, change direction
                if (isRandomMoving) {
                    setRandomDirection();
                }
                break;
            }
        }
        if (moving) {
            movables.forEach(movable => {
                movable.position.x -= 8;
            });
        }
    }
}

animate();

// Toggle random movement with 'r' key
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            // Disable random movement when user takes control
            isRandomMoving = false;
            break;
        case 'a':
            keys.a.pressed = true;
            // Disable random movement when user takes control
            isRandomMoving = false;
            break;
        case 's':
            keys.s.pressed = true;
            // Disable random movement when user takes control
            isRandomMoving = false;
            break;
        case 'd':
            keys.d.pressed = true;
            // Disable random movement when user takes control
            isRandomMoving = false;
            break;
        case 'f':
            if (keys.f.pressed == false)
                keys.f.pressed = true;
            else
                keys.f.pressed = false;
            break;
        case 'r': // Toggle random movement
            isRandomMoving = !isRandomMoving;
            if (isRandomMoving) {
                // Clear all key presses when enabling random movement
                keys.w.pressed = false;
                keys.a.pressed = false;
                keys.s.pressed = false;
                keys.d.pressed = false;
                // Start with a random direction
                setRandomDirection();
                addChatMessage("System", "Random movement enabled");
            } else {
                addChatMessage("System", "Random movement disabled");
            }
            break;
    }
});

//listening for keyup
window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});