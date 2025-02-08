let pet = { hunger: 100, happiness: 100, energy: 100 };
let petName = "";
let interval;
let hungerDecay = 5;
let happinessDecay = 3;
let energyDecay = 2;

function startGame(name) {
    petName = name;
    document.getElementById("pet-name").textContent = name;
    document.getElementById("stats-image").src = name === "Teepee" ? "big-teepee.png" : "big-cheese.png";
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    
    // Adjust decay rates based on pet selection
    if (name === "Teepee") {
        energyDecay = 4; // Teepee gets sleepy faster
        happinessDecay = 3;
    } else {
        energyDecay = 2;
        happinessDecay = 5; // Cheese needs to play more
    }
    
    interval = setInterval(updateNeeds, 2000);
}

function updateNeeds() {
    pet.hunger -= hungerDecay;
    pet.happiness -= happinessDecay;
    pet.energy -= energyDecay;
    updateBars();
    checkGameOver();
}

function updateBars() {
    document.getElementById("hunger-bar").style.width = pet.hunger + "%";
    document.getElementById("happiness-bar").style.width = pet.happiness + "%";
    document.getElementById("energy-bar").style.width = pet.energy + "%";

    document.getElementById("stat-hunger").textContent = "Hunger: " + pet.hunger;
    document.getElementById("stat-happiness").textContent = "Happiness: " + pet.happiness;
    document.getElementById("stat-energy").textContent = "Energy: " + pet.energy;

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
}

function feedPet() {
    pet.hunger = Math.min(pet.hunger + 20, 100);
    updateBars();
}

function playWithPet() {
    pet.happiness = Math.min(pet.happiness + 20, 100);
    updateBars();
}

function restPet() {
    pet.energy = Math.min(pet.energy + 20, 100);
    updateBars();
}

function checkGameOver() {
    if (pet.hunger <= 0 || pet.happiness <= 0 || pet.energy <= 0) {
        clearInterval(interval);
        document.getElementById("game-screen").classList.add("hidden");
        document.getElementById("lose-screen").classList.remove("hidden");
    }
}
