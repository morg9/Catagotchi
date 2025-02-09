let pet = { hunger: 100, happiness: 100, energy: 100 };
let petName = "";
let interval;
let hungerDecay = 5;
let happinessDecay = 3;
let energyDecay = 2;
let isStatAnimating = { hunger: false, happiness: false, energy: false };

const randomEvents = [
    { text: "A bird stole all of the cat’s food!", stat: "hunger", newValue: 20 },
    { text: "The cat had a nightmare and lost energy!", stat: "energy", newValue: 20 },
    { text: "A loud noise scared the cat, making it sad!", stat: "happiness", newValue: 20 },
    { text: "Someone gave the cat extra food! Lucky!", stat: "hunger", newValue: 100 }, // Good event!
    { text: "The cat found a comfy spot and napped well!", stat: "energy", newValue: 100 } // Another good event!
];

function triggerRandomEvent() {
    let event = randomEvents[Math.floor(Math.random() * randomEvents.length)]; // Pick a random event

    pet[event.stat] = Math.max(pet[event.stat] - 20, 0); // Reduce stat but don't go below 0

    let textBox = document.getElementById("text-box");
    textBox.textContent = event.text;

    // Reset text-box after 5 seconds
    setTimeout(() => {
        textBox.textContent = "";
    }, 5000);

    updateBars(); 
}


function startRandomEvents() {
    setInterval(triggerRandomEvent, 10000); // Trigger a new event every 15 seconds
}

function startGame(name) {
    const sound = document.getElementById("background-music");
    petName = name;
    document.getElementById("pet-name").textContent = name;
    document.getElementById("stats-image").src = name === "Teepee" ? "../images/big-teepee.png" : "../images/big-cheese.png";
    document.getElementById("stat-name").textContent = name === "Teepee" ? "Teepee" : "Cheese";
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    
    // Play background music
    const backgroundMusic = document.getElementById("background-music");
    backgroundMusic.play();
    
    // Adjust decay rates based on pet selection
    if (name === "Teepee") {
        energyDecay = 4; // Teepee gets sleepy faster
        happinessDecay = 3;
        document.getElementById("pet-animation").src = "../animations/TP_blink.gif"; // Set Teepee GIF
    } else {
        energyDecay = 2;
        happinessDecay = 5; // Cheese needs to play more
        document.getElementById("pet-animation").src = "../animations/cheese_blink.gif"; // Set Cheese GIF
    }
    
    interval = setInterval(updateNeeds, 2000);
    startRandomEvents();
}

function playSoundAndStartGame(name) {
    const sound = document.getElementById("select-sound");
    sound.play();
    sound.onended = () => startGame(name);
}

function updateNeeds() {
    if (!isStatAnimating.hunger) pet.hunger -= hungerDecay;
    if (!isStatAnimating.happiness) pet.happiness -= happinessDecay;
    if (!isStatAnimating.energy) pet.energy -= energyDecay;

    updateBars();
    checkGameOver();
}


function disableButtons() {
    document.querySelectorAll(".action-button").forEach(button => {
        button.disabled = true;
        button.style.opacity = "0.5";
    });
}

function enableButtons() {
    document.querySelectorAll(".action-button").forEach(button => {
        button.disabled = false;
        button.style.opacity = "1";
    });
}

function isSleeping() {
    return pet.energy < 25 && petName === "Teepee";
}

let isAnimating = false;

function animateStatIncrease(stat, increment, maxStat, barElement) {
    if (isStatAnimating[stat]) return; 
    isStatAnimating[stat] = true; 
    disableButtons();

    let steps = 20;
    let duration = 2000;
    let stepTime = duration / steps;
    let stepAmount = increment / steps;
    let step = 0;

    let interval = setInterval(() => {
        if (pet[stat] < maxStat) {
            pet[stat] = Math.min(pet[stat] + stepAmount, maxStat);
            barElement.style.width = pet[stat] + "%";
            document.getElementById(`stat-${stat}`).textContent = 
                `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${Math.round(pet[stat])}`;
        }

        step++;
        if (step >= steps) {
            clearInterval(interval);
            setTimeout(() => {
                isStatAnimating[stat] = false;
                enableButtons();
            }, 500);
        }
    }, stepTime);
}

// Make sure stats never display below 0
function updateBars() {
    pet.hunger = Math.max(pet.hunger, 0);
    pet.happiness = Math.max(pet.happiness, 0);
    pet.energy = Math.max(pet.energy, 0);

    document.getElementById("hunger-bar").style.width = pet.hunger + "%";
    document.getElementById("happiness-bar").style.width = pet.happiness + "%";
    document.getElementById("energy-bar").style.width = pet.energy + "%";

    document.getElementById("stat-hunger").textContent = `Hunger: ${pet.hunger}`;
    document.getElementById("stat-happiness").textContent = `Happiness: ${pet.happiness}`;
    document.getElementById("stat-energy").textContent = `Energy: ${pet.energy}`;

    let statusText = "Happy and healthy!"; // Default message

    if (pet.hunger < 50) {
        statusText = `${petName} is hungry`;
    } else if (pet.happiness < 50) {
        statusText = `${petName} is bored`;
    } else if (pet.energy < 50) {
        statusText = `${petName} is tired`;
    }
    document.getElementById("stat-status").textContent = `Status: ${statusText}`;
}


function feedPet() {
    if (petName === "Teepee") {
        document.getElementById("pet-animation").src = "../animations/TP_eat.gif";
        setTimeout(() => {
            document.getElementById("pet-animation").src = "../animations/TP_blink.gif";
        }, 1400);
    }
    animateStatIncrease("hunger", 20, 100, document.getElementById("hunger-bar"));
}

function playWithPet() {
    if (petName == "Teepee") {
        document.getElementById("pet-animation").src = "../animations/TP_happy.gif";
        setTimeout(() => {
            document.getElementById("pet-animation").src = "../animations/TP_blink.gif";
        }, 1400);
    }
    animateStatIncrease("happiness", 20, 100, document.getElementById("happiness-bar"));
}

function restPet() {
    if (petName === "Teepee") {
        document.getElementById("pet-animation").src = "../animations/TP_sleep.gif";

        setTimeout(() => {
            document.getElementById("pet-animation").src = "../animations/TP_blink.gif";
        }, 2000);
    }
    animateStatIncrease("energy", 20, 100, document.getElementById("energy-bar"));
}

function checkGameOver() {
    if (pet.hunger <= 0 || pet.happiness <= 0 || pet.energy <= 0) {
        clearInterval(interval);
        document.getElementById("game-screen").classList.add("hidden");
        document.getElementById("lose-screen").classList.remove("hidden");
    }
}
