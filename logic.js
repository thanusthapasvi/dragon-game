/* 3D Objects containers */
/* Lucky Box */
const giftContainer = document.querySelector(".box");

/* Monster Box */
const monsterContainer = document.querySelector(".monster-container");

/* 3D setup */
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const loader = new THREE.GLTFLoader();
/* using renderer.setSize() in functions for reuse. */

const light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(-0.5, -0.5, 2);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
light2.position.set(0.5, 0.5, 2);
scene.add(light2);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

/* Camera and attaching to conatineer (gift) or Monster container */
let activeCamera;
let activeModel = null;

let giftCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
giftCamera.position.set(0.75, 0.75, 1.5);

let monsterCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
monsterCamera.position.set(0.2, 0.2, 1.5);


function initCameraForContainer(camera, container) {
    const w = container.clientWidth;
    const h = container.clientHeight;

    if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);

    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    activeCamera = camera;
}

/* for 3d lucky box */
let gift, lid, bottom;
function loadGiftBox() {
    if (activeModel) {
        scene.remove(activeModel);
        activeModel = null;
    }

    loader.load("models/GiftBox.glb", gltf => {
        gift = gltf.scene;

        lid = gift.getObjectByName("GiftLid");
        bottom = gift.getObjectByName("GiftBottom");

        gift.scale.set(1.5, 1.5, 1.5);

        console.log("Gift loaded:", gift);
        console.log("Gift position:", gift.position);
        console.log("Gift scale:", gift.scale);
        console.log("Gift rotation:", gift.rotation);
        
        activeModel = gift;
        scene.add(activeModel);
    });
}

/* For 3D Monster */
let monster;
function loadMonsterModel(name) {
    if (activeModel) {
        scene.remove(activeModel);
        activeModel = null;
    }

    loader.load("models/" + name + ".glb", gltf => {
        monster = gltf.scene;

        monster.scale.set(monsters[fighting].scaleX, monsters[fighting].scaleY, monsters[fighting].scaleZ);

        monster.userData.baseScale = monster.scale.clone();

        activeModel = monster;
        scene.add(activeModel);
    },
        undefined,
    error => {
        console.error("Failed to load monster model:", error);

        monsterImage.style.display = "block";
        monsterImage.src = monsters[fighting].image;
    });
}

/* 3d animation loops */
let lidState = 0; 
let t = 0;
function animate() {
    requestAnimationFrame(animate);
    if (lidState === 1) {
        // Opening
        t += 0.05;
        lid.position.y = Math.sin(t) * 0.3;
        
        if (t >= 0.6) lidState = 2;
        gift.rotation.y += 0.25;
    } 
    else if (lidState === 2) {
        // Closing
        t -= 0.05;
        lid.position.y = Math.sin(t) * 0.3;
        
        if (t <= 0) lidState = 0;
        gift.rotation.y += 0.25;
    }
    if(monster) {
        const t = performance.now() * 0.002;

        const s = 1 + Math.sin(t * 2) * 0.04;
        const base = monster.userData.baseScale;

        monster.scale.set(
            base.x * s,
            base.y * (1 - (s - 1)),
            base.z * s
        );
    }
    if (activeCamera && renderer.domElement.parentNode) {
        renderer.render(scene, activeCamera);
    }
}
animate();
function playLidAnimation() {
    if (lidState === 0) {
        lidState = 1;
        t = 0;
    }
}

/* Loading... */
window.addEventListener("DOMContentLoaded", () => {
	const loader = document.getElementById("loader-overlay");
	loader.classList.add("hidden");
	setTimeout(() => loader.remove(), 400);
});

/* Main game Start */

let xp = 0;
let level = 1;
let maxHealth = 100;
let health = maxHealth;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;

let isHeroOpen = false;
let isInventoryOpen = false;

let isButtonSoundEnabled = true;

const gameHero = document.querySelector(".game");
const gameLucky = document.querySelector(".lucky-box");

const game = document.querySelector(".game-window");
const dialog = document.querySelector(".dialog");
const inventoryWindow = document.querySelector(".inventory-box");
const heroImage = document.querySelector(".hero-image");
const monsterImage = document.querySelector(".monster-image");
const pageWindow = document.querySelector(".page-box");
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

const monsterDamageText = document.querySelector(".monster-damage");
const heroDamageText = document.querySelector(".hero-damage");

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
        image: "assests/slime.png",
        scaleX: 0.7,
        scaleY: 0.5,
        scaleZ: 0.5
    },
    {
        name: "slime group",
        level: 10,
        health: 100,
        image: "assests/slimeGroup.png",
        scaleX: 0.4,
        scaleY: 0.4,
        scaleZ: 0.2
    },
    {
        name: "beast",
        level: 15,
        health: 150,
        image: "assests/beast1.png",
        scaleX: 0.8,
        scaleY: 0.6,
        scaleZ: 0.75
    },
    {
        name: "dragon",
        level: 50,
        health: 500,
        image: "assests/dragon.png",
        scaleX: 0.8,
        scaleY: 0.6,
        scaleZ: 0.75
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
        "button text": ["health", "dagger", "Lucky Box"],
        "button functions": [buyHealth, buyWeapon, buyLucky],
        text: "You enter the shop.",
        bg: "url('assests/shop.jpg')"
    },
    {
        name: "cave",
        "button text": ["slime", "slime group", "beast"],
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
        "button text": ["Shop", "Cave", "Town"],
        "button functions": [goShop, goCave, goTown],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
        bg: "url('assests/battle.jpg')"
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "Game Over. You die. &#x2620;",
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
back.onclick = goTown;
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
    monsterContainer.style.display = "none";
    heroDamageText.style.display = "none";
    monsterDamageText.style.display = "none";
    dialog.style.display = "block";
    hero.classList.remove('active-tab');
    bag.classList.remove('active-tab');
    game.style.background = location["bg"];

    buttonSoundEnabled = true;

    if (location.name == "shop") {
        pageWindow.style.display = "flex";
        shopAndMonsters("shop");
    } else if (location.name == "cave") {
        pageWindow.style.display = "flex";
        shopAndMonsters("monsters");
    } else {
        pageWindow.style.display = "none";
    }

    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    dialog.innerHTML = location.text;
}
const shopAndMonsterPage = [
    {
        name: "shop",
        p1: "Buy health",
        p2: "Buy dagger",
        p3: "Lucky Box",
        f1: buyHealth,
        f2: buyWeapon,
        f3: buyLucky,
        img1: "assests/health.png",
        img2: "assests/dagger.png",
        img3: "assests/lucky.png",
        P1: "10 gold",
        P2: "30 gold",
        P3: "200 gold"
    }
]
function shopAndMonsters(page) {
    const pageTiles = document.querySelectorAll('.page-item');
    const p1s = document.querySelectorAll('.page-item-name');
    const p2s = document.querySelectorAll('.page-item-price');
    const imgs = document.querySelectorAll('.page-item-image');
    pageTiles.forEach(tile => {
        tile.classList.add('appear');
    });
    setTimeout(() => {
        pageTiles.forEach(tile => {
            tile.classList.remove('appear');
        });
    }, 400);
    if(page === "monsters") {
        p1s[0].innerText = monsters[0].name;
        p1s[1].innerText = monsters[1].name;
        p1s[2].innerText = monsters[2].name;
        p2s[0].innerText = "level " + monsters[0].level;
        p2s[1].innerText = "level " + monsters[1].level;
        p2s[2].innerText = "level " + monsters[2].level;
        imgs[0].src = monsters[0].image;
        imgs[1].src = monsters[1].image;
        imgs[2].src = monsters[2].image;
        pageTiles[0].onclick = fightSlime;
        pageTiles[1].onclick = fightSlimeGroup;
        pageTiles[2].onclick = fightBeast;
    } else if(page === "shop") {
        p1s[0].innerText = shopAndMonsterPage[0].p1;
        p1s[1].innerText = shopAndMonsterPage[0].p2;
        p1s[2].innerText = shopAndMonsterPage[0].p3;
        p2s[0].innerText = shopAndMonsterPage[0].P1;
        p2s[1].innerText = shopAndMonsterPage[0].P2;
        p2s[2].innerText = shopAndMonsterPage[0].P3;
        imgs[0].src = shopAndMonsterPage[0].img1;
        imgs[1].src = shopAndMonsterPage[0].img2;
        imgs[2].src = shopAndMonsterPage[0].img3;
        pageTiles[0].onclick = shopAndMonsterPage[0].f1;
        pageTiles[1].onclick = shopAndMonsterPage[0].f2;
        pageTiles[2].onclick = shopAndMonsterPage[0].f3;
    }
}
function goTown() {
    playTeleportAudio();
    update(locations[0]);
}

function goShop() {
    playTeleportAudio();
    buttonSoundEnabled = false;
    update(locations[1]);
}

function goCave() {
    playTeleportAudio()
    update(locations[2]);
}

function fightSlime() {
    fighting = 0;
    fightTimeOut()
}
function fightSlimeGroup() {
    fighting = 1;
    fightTimeOut()
}
function fightBeast() {
    fighting = 2;
    fightTimeOut()
}
function fightDragon() {
    fighting = 3;
    fightTimeOut()
}

function fightTimeOut() {
    //to play animation of bounse for page tiles in cave
    setTimeout(() => {
        goFight();
    }, 400);
}

function openInventory() {
    goTown();
    updateInventory();
    if (isInventoryOpen) {
        inventoryWindow.style.display = "none";
        bag.classList.remove('active-tab');
        isInventoryOpen = false;
        dialog.style.display = "block";
    } else {
        inventoryWindow.classList.remove('floating-ani');
        inventoryWindow.style.display = "flex";
        isInventoryOpen = true;
        setTimeout(() => {
            inventoryWindow.classList.add('floating-ani');
        }, 500);
        bag.classList.add('active-tab');
        dialog.style.display = "none";
    }
}
let heroFirst = true;
function openHero() {
    goTown();
    updateHero();
    if (isHeroOpen) {
        heroWindow.style.display = "none";
        hero.classList.remove('active-tab');
        isHeroOpen = false;
        dialog.style.display = "block";
    } else {
        heroWindow.classList.remove('floating-ani');
        heroWindow.style.display = "flex";
        hero.classList.add('active-tab');
        setTimeout(() => {
            heroWindow.classList.add('floating-ani');
        }, 500);
        isHeroOpen = true;
        if (!heroFirst)
            dialog.style.display = "none";
    }
    heroFirst = false
}
openHero(); //to open when game starts
function updateInventory() {
    const stickText = document.querySelector(".weapon1-quanity");
    const daggerText = document.querySelector(".weapon2-quanity");
    const hammerText = document.querySelector(".weapon3-quanity");
    const ironSwordText = document.querySelector(".weapon4-quanity");
    const diamondSwordText = document.querySelector(".weapon5-quanity");

    const weaponHighlight = document.querySelectorAll(".weapons");

    stickText.innerText = inventory[0].quantity;
    daggerText.innerText = inventory[1].quantity;
    hammerText.innerText = inventory[2].quantity;
    ironSwordText.innerText = inventory[3].quantity;
    diamondSwordText.innerText = inventory[4].quantity;

    weaponHighlight[currentWeapon].classList.add("current-weapon-highlight");
    for (let i = 0; i < weaponHighlight.length; i++) {
        if (i != currentWeapon) {
            weaponHighlight[i].classList.remove("current-weapon-highlight");
        }
    }
}
function updateHero() {
    updateLevel();
    heroWeaponText.innerText = weapons[currentWeapon].name;
}
function buyHealth() {
    if (gold >= 10) {
        playBuySuccessAudio();
        const prevHealth = maxHealth;
        const prevGold = gold;
        gold -= 10;
        maxHealth += 10;
        health = maxHealth;
        // goldText.innerText = gold;
        animateNumber(goldText, prevGold, gold);
        iconsPulse("coinIcon");
        // healthText.innerText = maxHealth;
        animateNumber(healthText, prevHealth, maxHealth);
        iconsPulse("healthIcon");
    } else {
        playBuyFailAudio();
        dialog.innerText = "You do not have enough gold to buy health.";
    }
}

function buyWeapon() {
    if (gold >= 30) {
        playBuySuccessAudio();
        const prevGold = gold;
        gold -= 30;
        // goldText.innerText = gold;
        animateNumber(goldText, prevGold, gold);
        iconsPulse("coinIcon");
        let newWeapon = weapons[1].name;
        dialog.innerText = "You now have a " + newWeapon + ".";
        addWeapon(newWeapon);
        dialog.innerText += " inventory updated ";
    } else {
        playBuyFailAudio();
        dialog.innerText = "You do not have enough gold to buy a weapon.";
    }
}
function buyLucky() {
    if (gold >= 200) {
        playBuySuccessAudio();
        gold -= 200;
        goldText.innerText = gold;
        gameHero.style.display = "none";
        gameLucky.style.display = "flex";
        initCameraForContainer(giftCamera, giftContainer);
        loadGiftBox();
    } else {
        playBuyFailAudio();
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
    buttonSoundEnabled = false;
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "flex";
    heroHealth.style.display = "flex";
    heroImage.style.display = "block";
    monsterName.innerText = monsters[fighting].name;
    monsterLevel.innerText = monsters[fighting].level;

    monsterContainer.style.display = "block";
    initCameraForContainer(monsterCamera, monsterContainer);
    loadMonsterModel(monsters[fighting].name);

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
    let heroHitAmount = getMonsterAttackValue(monsters[fighting].level);
    health -= heroHitAmount;
    heroDamageText.style.display = "block";
    heroDamageText.innerText = heroHitAmount;
    if (isMonsterHit()) {
        let monsterhitAmount = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + level;
        monsterHealth -= monsterhitAmount;
        monsterDamageText.style.display = "block";
        monsterDamageText.innerText = monsterhitAmount;
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
    if(currentWeapon < 3) {
        playWeaponAudio();
    } else {
        playSwordAudio();
    }
    setTimeout(() => {
        heroDamageText.style.display = "none";
        monsterDamageText.style.display = "none";
    }, 500);
}

function getMonsterAttackValue(level) {
    const hit = (level * 5) - (Math.floor(Math.random() * xp) + level);
    return hit > 0 ? hit : 0;
}

function isMonsterHit() {
    return Math.random() > .1 || health < 25;
}

function dodge() {
    dialog.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
    const prevGold = gold;
    const prevXp = xp;
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    // goldText.innerText = gold;
    animateNumber(goldText, prevGold, gold);
    iconsPulse("coinIcon");
    // xpText.innerText = xp;
    animateNumber(xpText, prevXp, xp);
    iconsPulse("xpIcon");
    updateLevel();
    update(locations[4]);
}
function updateLevel() {
    const xpProgressBar = document.querySelector(".xp-progress-bar");
    const levelXp = [0, 150, 250, 400, 600, 800, 1000, 1300, 1600, 2000];
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
    let xpForNextLevel = levelXp[level] - levelXp[level - 1];
    let currentXpInLevel = xp - levelXp[level - 1];
    let xpPercent = (currentXpInLevel / xpForNextLevel) * 100;
    xpProgressBar.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${xpPercent}%, var(--dialog-bg) ${xpPercent}%, var(--dialog-bg) 100%)`;
    levelText.innerText = level;
    heroLevelText.innerText = level;
}

function lose() {
    update(locations[5]);
    playLoseAudio();
}

function winGame() {
    update(locations[6]);
    playWinAudio();
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

let luckyGameTouch = document.querySelector(".lucky-game-cover");
luckyGameTouch.addEventListener('click', luckyBlock);
let luckRate = 0.5;

function luckyBlock() {
    let gameBg = document.querySelector(".lucky-game");
    const dots = document.querySelectorAll(".dot");
    const openText = document.querySelector(".open-text");
    playLidAnimation();
    if (currentDot < dots.length) {
        let luck = Math.random() < luckRate;
        luckRate -= 0.1;
        if (luck) {
            rarity++;
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

/* Animations and Visuals */
document.querySelectorAll('.top-buttons, .bottom-buttons, .page-item')
.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.add('bounce-animation');
        setTimeout(() => {
            btn.classList.remove('bounce-animation');
        }, 400);
    });
});

function iconsPulse(iconName) {
    const xpIcon = document.querySelector(".xp-icon");
    const coinIcon = document.querySelector(".coin-icon");
    const healthIcon = document.querySelector(".health-icon");

    let icon;
    if(iconName === "coinIcon") {
        icon = coinIcon;
    } else if(iconName === "healthIcon") {
        icon = healthIcon;
    } else {
        icon = xpIcon;
    }
    icon.style.animation = "pulse 0.4s ease-in-out";
    setTimeout(() => {
        icon.style.animation = "none";
    }, 300);
}
document.querySelectorAll(".game-element-icon").forEach(icon => {
    icon.addEventListener('click', () => {
        icon.style.animation = "bounce 0.3s ease";
        setTimeout(() => {
            icon.style.animation = "none";
        }, 400);
    });
});

function animateNumber(textElement, start, end) {
	let startTime = null;
    const duration = 400;
	function tick(time) {
		if (!startTime) startTime = time;
		const progress = Math.min((time - startTime) / duration, 1);
		textElement.innerText = Math.floor(start + (end - start) * progress);
		if (progress < 1) requestAnimationFrame(tick);
	}

	requestAnimationFrame(tick);
}



//audio
document.querySelectorAll('.top-buttons, .bottom-buttons')
.forEach(btn => {
    const buttonAudio = document.getElementById('button-sound');
    buttonAudio.currentTime = 0;
    btn.addEventListener('click', () => {
        if (!buttonSoundEnabled) return; 
        buttonAudio.play();
    });
});

function playWinAudio() {
    const winAudio = document.getElementById('win-sound');
    winAudio.currentTime = 0;
    winAudio.play();
}
function playLoseAudio() {
    const loseAudio = document.getElementById('lose-sound');
    loseAudio.currentTime = 0;
    loseAudio.play();
}

function playTeleportAudio() {
    const teleportAudio = document.getElementById('teleport-sound');
    teleportAudio.currentTime = 0;
    teleportAudio.volume = 0.3;
    teleportAudio.play();
}

function playBuySuccessAudio() {
    const buySuccessAudio = document.getElementById("buy-success-sound");
    buySuccessAudio.currentTime = 0;
    buySuccessAudio.play();
}
function playBuyFailAudio() {
    const buyFailAudio = document.getElementById("buy-fail-sound");
    buyFailAudio.currentTime = 0;
    buyFailAudio.play();
}

function playWeaponAudio() {
    const weaponAudio = document.getElementById('weapon-sound');
    weaponAudio.currentTime = 0;
    weaponAudio.play();
}
function playSwordAudio() {
    const swordAudio = document.getElementById('sword-sound');
    swordAudio.currentTime = 0;
    swordAudio.play();
}
