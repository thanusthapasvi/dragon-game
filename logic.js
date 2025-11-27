let body = document.querySelector('body');
let theme = document.querySelector('.themeButton');
let themeIcon = document.querySelector('#theme-icon path');
const moon = "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z";
const sun = "M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z";
const currentD = themeIcon.getAttribute('d');

function themeToggle() {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    if (body.classList.contains('dark')) {
        themeIcon.setAttribute('d', sun);
        theme.style.color = "#ffff00";
    } else {
        themeIcon.setAttribute('d', moon);
        theme.style.color = "#ffffff";
    }
}

/* 3D gift box */
/* for 3d cube parent */
const container = document.querySelector(".box");
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, containerWidth/containerHeight, 0.1, 1000);
camera.position.set(0.75, 0.75, 1.5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(containerWidth, containerHeight);
container.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 4);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0.5, 1, 0);
scene.add(light2);

const loader = new THREE.GLTFLoader();

let gift, lid, bottom;
loader.load("models/GiftBox.glb", function (gltf) {
    gift = gltf.scene;
    scene.add(gift);
    gift.scale.set(1.5, 1.5, 1.5);

    lid = gift.getObjectByName("GiftLid");
    bottom = gift.getObjectByName("GiftBottom");
});

let lidState = 0; 
let t = 0;
function animate() {
    requestAnimationFrame(animate);
    if(gift) {
        gift.rotation.y += 0.003;
    }
    if (lidState === 1) {
        // Opening
        t += 0.05;
        lid.position.y = Math.sin(t) * 0.3;
        
        if (t >= 0.7) lidState = 2;
    } 
    else if (lidState === 2) {
        // Closing
        t -= 0.05;
        lid.position.y = Math.sin(t) * 0.3;
        
        if (t <= 0) lidState = 0;
    }
    renderer.render(scene, camera);
}
animate();
function playLidAnimation() {
    if (lidState === 0) {
        lidState = 1;
        t = 0;
    }
}

/* Main game Start */

let xp = 0;
let maxHealth = 100;
let health = maxHealth;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;

let isHeroOpen = false;
let isInventoryOpen = false;

const gameHero = document.querySelector(".game");
const gameLucky = document.querySelector(".lucky-box");

const game = document.querySelector(".game-window");
const dialog = document.querySelector(".dialog");
const inventoryWindow = document.querySelector(".inventory-box");
const heroImage = document.querySelector(".hero-image");
const monsterImage = document.querySelector(".monster-image");
const shopWindow = document.querySelector(".shop-box");
const heroWindow = document.querySelector(".hero-profile");

const heroLevelText = document.querySelector(".info-level");
const heroWeaponText = document.querySelector(".info-weapon");


const back = document.querySelector('.top-button1');
const bag = document.querySelector('.top-button2');
const hero = document.querySelector('.top-button3');
const button1 = document.querySelector('.bottom-button1');
const button2 = document.querySelector(".bottom-button2");
const button3 = document.querySelector(".bottom-button3");

const monsterStats = document.querySelector(".monster-stats");
const goldText = document.querySelector(".goldText");
const xpText = document.querySelector(".xpText");
const levelText = document.querySelector(".levelText");
const healthText = document.querySelector(".healthText");
const heroHealth = document.querySelector(".hero-health-stat");
const monsterName = document.querySelector(".monsterName");
const monsterLevel = document.querySelector(".monsterLevel");

const weapons = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'hammer', power: 50 },
    { name: 'iron sword', power: 100 },
    { name: 'diamond sword', power: 120 }
];
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 20,
        image: "assests/slime.png"
    },
    {
        name: "slime group",
        level: 6,
        health: 60,
        image: "assests/slimeGroup.png"
    },
    {
        name: "beast",
        level: 10,
        health: 150,
        image: "assests/beast1.png"
    },
    {
        name: "dragon",
        level: 50,
        health: 800,
        image: "assests/dragon.png"
    }
]
const locations = [
    {
        name: "Hero",
        "button text": ["Shop", "Cave", "Dragon"],
        "button functions": [goShop, goCave, fightDragon],
        text: "You are in the town. You see a sign that says \"Store\".",
        bg: "url('assests/town.jpg')"
    },
    {
        name: "shop",
        "button text": ["Buy health", "Buy dagger", "Lucky Box"],
        "button functions": [buyHealth, buyWeapon, buyLucky],
        text: "You enter the shop.",
        bg: "url('assests/shop.jpg')"
    },
    {
        name: "cave",
        "button text": ["slime", "slime group", "fanged beast"],
        "button functions": [fightSlime, fightSlimeGroup, fightBeast],
        text: "You enter the cave. You see some monsters.",
        bg: "url('assests/cave.png')"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster.",
        bg: "url('assests/battle.jpg')"
    },
    {
        name: "kill monster",
        "button text": ["Go to shop", "Explore Cave", "Go to town"],
        "button functions": [goShop, goCave, goTown],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
        bg: "url('assests/battle.jpg')"
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;",
        bg: "url('assests/battle.jpg')"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
        bg: "url('assests/battle.jpg')"
    }
];
const inventory = [
    {
        name: weapons[0].name,
        quantity: 1
    },
    {
        name: weapons[1].name,
        quantity: 0
    },
    {
        name: weapons[2].name,
        quantity: 0
    },
    {
        name: weapons[3].name,
        quantity: 0
    },
    {
        name: weapons[4].name,
        quantity: 0
    }
];
function bestWeapon() {
    let best = 0;
    for (let i = inventory.length - 1; i >= 0; i--) {
        const cur = inventory[i];
        if (cur.quantity > 0) {
            best = i;
            break;
        }
    }
    return best;
}
currentWeapon = bestWeapon();
hero.onclick = openHero;
back.onclick = goTown;
bag.onclick = openInventory;
button1.onclick = goShop;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    isHeroOpen = false;
    isInventoryOpen = false;
    monsterStats.style.display = "none";
    heroHealth.style.display = "none";
    inventoryWindow.style.display = "none";
    heroWindow.style.display = "none";
    heroImage.style.display = "none";
    monsterImage.style.display = "none";
    dialog.style.display = "block";
    game.style.background = location["bg"];
    if (location.name == "shop") {
        shopWindow.style.display = "flex";
    } else {
        shopWindow.style.display = "none";
    }
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    dialog.innerHTML = location.text;
}
function goTown() {
    update(locations[0]);
}

function goShop() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function fightSlime() {
    fighting = 0;
    goFight();
}
function fightSlimeGroup() {
    fighting = 1;
    goFight();
}
function fightBeast() {
    fighting = 2;
    goFight();
}

function fightDragon() {
    fighting = 3;
    goFight();
}
function openInventory() {
    goTown();
    updateInventory();
    if (isInventoryOpen) {
        inventoryWindow.style.display = "none";
        isInventoryOpen = false;
        dialog.style.display = "block";
    } else {
        inventoryWindow.style.display = "flex";
        isInventoryOpen = true;
        dialog.style.display = "none";
    }
}
let heroFirst = true;
function openHero() {
    goTown();
    updateHero();
    if (isHeroOpen) {
        heroWindow.style.display = "none";
        isHeroOpen = false;
        dialog.style.display = "block";
    } else {
        heroWindow.style.display = "flex";
        isHeroOpen = true;
        if (!heroFirst)
            dialog.style.display = "none";
    }
    heroFirst = false
}
openHero();
function updateInventory() {
    const stickText = document.querySelector(".weapon1-quanity");
    const daggerText = document.querySelector(".weapon2-quanity");
    const hammerText = document.querySelector(".weapon3-quanity");
    const ironSwordText = document.querySelector(".weapon4-quanity");
    const diamondSwordText = document.querySelector(".weapon5-quanity");

    stickText.innerText = inventory[0].quantity;
    daggerText.innerText = inventory[1].quantity;
    hammerText.innerText = inventory[2].quantity;
    ironSwordText.innerText = inventory[3].quantity;
    diamondSwordText.innerText = inventory[4].quantity;
}
function updateHero() {
    updateLevel();
    heroWeaponText.innerText = weapons[currentWeapon].name;
}
function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        maxHealth += 10;
        health = maxHealth;
        goldText.innerText = gold;
        healthText.innerText = maxHealth;
    } else {
        dialog.innerText = "You do not have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (gold >= 30) {
        gold -= 30;
        goldText.innerText = gold;
        let newWeapon = weapons[1].name;
        dialog.innerText = "You now have a " + newWeapon + ".";
        addWeapon(newWeapon);
        dialog.innerText += " inventory updated ";
    } else {
        dialog.innerText = "You do not have enough gold to buy a weapon.";
    }
}
function buyLucky() {
    if (gold >= 200) {
        gold -= 200;
        goldText.innerText = gold;
        gameHero.style.display = "none";
        gameLucky.style.display = "flex";
        setTimeout(() => {
            const w = container.clientWidth;
            const h = container.clientHeight;

            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }, 200);
    } else {
        dialog.innerText = "You dont have enough gold";
    }
}
function addWeapon(name) {
    const item = inventory.find(i => i.name === name);
    if (item)
        item.quantity++;
    else
        console.log("Error adding weapon");

    upgradeWeapons();
}
function upgradeWeapons() {
    const item1 = inventory[1];
    const item2 = inventory[2];
    const item3 = inventory[3];
    const item4 = inventory[4];
    if (item1.quantity == 2) {
        item1.quantity -= 2;
        item2.quantity++;
    }
    if (item2.quantity == 3) {
        item2.quantity -= 3;
        item3.quantity++;
    }
    if (item3.quantity == 4) {
        item3.quantity -= 4;
        item4.quantity++;
    }
    currentWeapon = bestWeapon();
}
function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "flex";
    heroHealth.style.display = "flex";
    heroImage.style.display = "block";
    monsterImage.style.display = "block";
    monsterImage.src = monsters[fighting].image;
    monsterName.innerText = monsters[fighting].name;
    monsterLevel.innerText = monsters[fighting].level;
    monsterProgress(monsterHealth);
    playerProgress(health);
}
function monsterProgress(hp) {
    const monsterHpText = document.querySelector(".monster-hp");
    const monsterCurrentHealth = document.querySelector(".monster-progress");
    let monsterPercent = (hp / monsters[fighting].health) * 100;
    monsterCurrentHealth.style.width = monsterPercent + "%";
    monsterHpText.innerText = hp + " / " + monsters[fighting].health;
    healthBarColor(monsterCurrentHealth, monsterPercent);
}
function playerProgress(hp) {
    const heroHp = document.querySelector(".hero-hp");
    const playerCurrentHealth = document.querySelector(".hero-progress");
    let playerPercent = (hp / maxHealth) * 100;
    playerCurrentHealth.style.width = playerPercent + "%";
    heroHp.innerText = hp + " / " + maxHealth;
    healthBarColor(playerCurrentHealth, playerPercent);
}
function healthBarColor(name, percent) {
    let color = "#50cc50";
    if (percent < 60 && percent > 25) {
        color = "#acac50";
    } else if (percent <= 25) {
        color = "#cc5050";
    }
    name.style.backgroundColor = color;
}
function attack() {
    dialog.innerText = "The " + monsters[fighting].name + " attacks.";
    dialog.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
        monsterProgress(monsterHealth);
    } else {
        dialog.innerText += " You miss.";
    }
    playerProgress(health);
    monsterProgress(monsterHealth);
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 3) {
            winGame();
        } else {
            defeatMonster();
        }
    }
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .1 || health < 25;
}

function dodge() {
    dialog.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    updateLevel();
    update(locations[4]);
}
function updateLevel() {
    const levelXp = [0, 150, 250, 400, 600, 800, 1000, 1300, 1600, 2000];
    let level = 1;
    for (let i = 1; i < levelXp.length - 1; i++) {
        if (xp > 2000) {
            level = 10;
            break;
        } else if (xp > levelXp[i] && xp < levelXp[i + 1]) {
            level = i + 1;
        } else if (xp == 0) {
            level = 1;
        }
    }
    levelText.innerText = level;
    heroLevelText.innerText = level;
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    maxHealth = 100;
    health = maxHealth;
    gold = 50;
    currentWeapon = 0;
    const inventory = [
        {
            name: weapons[0].name,
            quantity: 1
        },
        {
            name: weapons[1].name,
            quantity: 0
        },
        {
            name: weapons[2].name,
            quantity: 0
        },
        {
            name: weapons[3].name,
            quantity: 0
        },
        {
            name: weapons[4].name,
            quantity: 0
        }
    ];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
}


/* Lucky Block Start*/
let currentDot = 0;
let rarity = 0;
let rarities = [
    "var(--common)",
    "var(--rare)",
    "var(--epic)",
    "var(--legendary)",
    "var(--mythic)"
]
let luckRate = 0.5;
function luckyBlock() {
    let gameBg = document.querySelector(".lucky-game");
    const dots = document.querySelectorAll(".dot");
    const openText = document.querySelector(".open-text");
    playLidAnimation();
    if (currentDot < dots.length) {
        let luck = Math.random() < luckRate;
        luckRate -= 0.1;
        console.log("Luck = " + luck + "Rate = " + luckRate);
        if (luck) {
            rarity++;
            console.log(rarity);
        }
        dots[currentDot].classList.add("dot-used");
        currentDot++;
        if (rarity > 0 && rarity <= 4) {
            gameBg.style.backgroundColor = rarities[rarity];
        }
    } else if (currentDot == dots.length) {
        luckResult(rarity);
        rarity = 0;
        currentDot = 0;
        luckRate = 0.5;
        openText.style.display = "none";
        gameBg.style.backgroundColor = rarities[0];
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("dot-used");
        }
    }
    if (currentDot == dots.length) {
        console.log("text");
        openText.style.display = "block";
    }
}

function luckResult(rarity) {
    const popup = document.querySelector(".result");
    const text = document.querySelector(".result-text");
    const okBtn = document.querySelector(".ok");
    const rarityNames = ["stick", "dagger", "hammer", "iron sword", "diamond sword"];
    const rarityName = rarityNames[rarity];
    text.textContent = "You got: " + rarityName;
    addWeapon(rarityName);
    popup.style.display = "flex";
    okBtn.onclick = function () {
        gameLucky.style.display = "none";
        gameHero.style.display = "flex";
        popup.style.display = "none";
    }
}
/* Lucky Block End*/
