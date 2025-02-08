let pet = { hunger: 100, happiness: 100, energy: 100 };
let petName = "";
let interval;
let hungerDecay = 5;
let happinessDecay = 3;
let energyDecay = 2;
let isStatAnimating = { hunger: false, happiness: false, energy: false };

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
        button.style.opacity = "0.5"; // Optional: Makes buttons look disabled
    });
}

function enableButtons() {
    document.querySelectorAll(".action-button").forEach(button => {
        button.disabled = false;
        button.style.opacity = "1"; // Restore normal appearance
    });
}

function isSleeping() {
    return pet.energy < 25 && petName === "Teepee";
}

let isAnimating = false; // Prevent multiple presses

function animateStatIncrease(stat, increment, maxStat, barElement) {
    if (isStatAnimating[stat]) return; // Prevent multiple presses for the same stat
    isStatAnimating[stat] = true; // Mark this specific stat as animating
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
                isStatAnimating[stat] = false; // Resume decay for this stat only
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

    let textBox = document.getElementById("text-box");
    if (pet.hunger < 50) {
        textBox.textContent = `${petName} is hungry`;
    } else if (pet.happiness < 50) {
        textBox.textContent = `${petName} is bored`;
    } else if (pet.energy < 50) {
        textBox.textContent = `${petName} is tired`;
    } else {
        textBox.textContent = "Your pet is happy and healthy!";
    }

    // Play TP_sad.gif if happiness drops to 10%
    if (petName === "Teepee" && pet.happiness <= 50) {
        document.getElementById("pet-animation").src = "../animations/TP_sad.gif";
    }

    if (petName === "Teepee" && pet.energy <= 50) {
        document.getElementById("pet-animation").src = "../animations/TP_yawn.gif";
    }
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
