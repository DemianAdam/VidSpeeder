// ==UserScript==
// @name         VidSpeeder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  VidSpeeder is a JavaScript script that enables you to increase or decrease the playback speed of YouTube videos beyond their standard limits.
// @author       Dnam
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      GPL-3.0-only; https://www.gnu.org/licenses/gpl-3.0.txt
// ==/UserScript==
(function () {
    "use strict";
    document.addEventListener('yt-navigate-start', mainSpeedRate);
    mainSpeedRate();
})();

function mainSpeedRate() {
    let video = document.querySelector('video');
    let gRate = video.playbackRate;
    addSpeedSpan();
    addSpeedShorcutEvents();
    initializeSpeedRateChangedEvent();
    function speedUp() {
        video.playbackRate += 0.25;
    }
    function speedDown() {
        video.playbackRate -= 0.25;
    }
    function resetSpeed() {
        video.playbackRate = 1;
    }
    function speedChange(e) {
        let changed = false;
        if (e.altKey && e.code === 'Period') {
            speedUp()
            changed = true;
        }
        else if (e.altKey && e.code === 'Comma') {
            if (video.playbackRate >= 0.50) {
                speedDown();
            }
            changed = true;
        }
        else if (e.altKey && e.code === "Slash") {
            resetSpeed();
            changed = true;
        }

        if (changed) {
            document.getElementById('movie_player').wakeUpControls();
        }
    }
    function speedRateChangedEvent(OnSpeedRateChanges) {
        let rate = video.playbackRate;
        if (rate != gRate) {
            OnSpeedRateChanges.forEach(element => {
                element();
            });
            gRate = rate;
        }
    }
    function updateSpeedRateSpan() {
        let control = document.querySelector("#videoSpeedSpan");
        control.innerHTML = "Speed: x" + video.playbackRate;
    }
    function createSpan() {
        let control = document.createElement("span");
        control.setAttribute("id", "videoSpeedSpan");
        control.innerHTML = "Speed: x" + video.playbackRate;
        control.style.border = "0.5px solid"
        control.style.padding = "0.5em";
        return control;
    }
    function createContainer(control) {
        let container = document.createElement("div");
        container.style.marginLeft = "2px";
        container.append(control);
        return container;
    }
    function addSpeedSpan() {
        if (!document.querySelector("#videoSpeedSpan")) {
            let control = createSpan();
            let container = createContainer(control);
            document.getElementsByClassName('ytp-left-controls')[0].append(container);
        }
    }
    function addSpeedShorcutEvents() {
        document.addEventListener('keyup', speedChange);
    }
    function initializeSpeedRateChangedEvent() {
        const OnSpeedRateChanges = [];
        OnSpeedRateChanges.push(updateSpeedRateSpan);
        setInterval(() => speedRateChangedEvent(OnSpeedRateChanges), 250);
    }
}
