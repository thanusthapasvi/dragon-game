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

let currentDot = 0;
let rarity = 0;
let rarities = [
    "var(--common)",
    "var(--rare)",
    "var(--epic)",
    "var(--legendary)",
    "var(--mythic)"
]
function luckyBlock() {
    let gameBg = document.querySelector(".game");
    const dots = document.querySelectorAll(".dot");
    const luckB = document.querySelector("#lucky");
    if(currentDot < dots.length) {
        let luck = Math.random() < 0.5;
        console.log(luck);
        if(luck) {
            rarity++;
            console.log(rarity);
            boxAni();
        }
        dots[currentDot].classList.add("dot-used");
        currentDot++;
        if(rarity > 0 && rarity <= 4) {
            gameBg.style.background = rarities[rarity];
        }
    } else if(currentDot == dots.length) {
        luckResult(rarity);
        rarity = 0;
        currentDot = 0;
        luckB.innerText = "Click";
        gameBg.style.background = rarities[0];
        for(let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("dot-used");
        }
    }
    if(currentDot == dots.length) {
        console.log("text");
        luckB.innerText = "click to open";
    }
}
function boxAni() {
    const box1 = document.querySelector(".box-1");
    const box2 = document.querySelector(".box-2");
    const box3 = document.querySelector(".box-3");

    box1.animate([
        {transform: "skewY(30deg) translate(0px)"},
        {transform: "skewY(30deg) translate(-20px, 20px)"},
        {transform: "skewY(30deg) translate(0px)"}
    ], {duration: 300, easing: "ease-out"});
    box2.animate([
        {transform: "skewY(-30deg) translate(0px)"},
        {transform: "skewY(-30deg) translate(20px, 20px)"},
        {transform: "skewY(-30deg) translate(0px)"}
    ], {duration: 300, easing: "ease-out"});
    box3.animate([
        {transform: "rotate(-28deg) scaleX(1.17) skew(30deg) translate(0px)"},
        {transform: "rotate(-28deg) scaleX(1.17) skew(30deg) translate(20px, -20px)"},
        {transform: "rotate(-28deg) scaleX(1.17) skew(30deg) translate(0px)"}
    ], {duration: 300, easing: "ease-out"});
}

let score = {
    Common: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
    Mythic: 0
}

function luckResult(rarity) {
    const popup = document.querySelector(".result");
    const text = document.querySelector(".result-text");
    const okBtn = document.querySelector(".ok");
    const rarityNames = ["Common", "Rare", "Epic", "Legendary", "Mythic"];
    const rarityName = rarityNames[rarity]
    text.textContent = "You got: " + rarityName;
    score[rarityName]++;

    updateScore();

    popup.style.display = "flex";
    okBtn.onclick = function() {
        popup.style.display = "none";
    }
}

function updateScore() {
    const commonText = document.querySelector(".common");
    const rareText = document.querySelector(".rare");
    const epicText = document.querySelector(".epic");
    const legendaryText = document.querySelector(".legendary");
    const mythicText = document.querySelector(".mythic");

    commonText.innerHTML = score["Common"];
    rareText.innerHTML = score["Rare"];
    epicText.innerHTML = score["Epic"];
    legendaryText.innerHTML = score["Legendary"];
    mythicText.innerHTML = score["Mythic"];
}
