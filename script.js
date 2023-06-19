// ==UserScript==
// @name         Wodify Spotgrabber
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.wodify.com/Schedule/CalendarListViewEntry.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wodify.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.js
// ==/UserScript==

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function spotFound() {
    var music = new sound("https://sandergoos.nl/success.mp3");
    console.log('There is a spot!');
    document.title = 'SPOT FOUND!!!';

    var currentTime = moment();

    var interval = setInterval(() => {
        var seconds = moment().diff(currentTime, 'seconds', true);
        document.title = 'SPOT FOUND!!! ' + parseInt(seconds);
        music.play();
    }, 200);
}

(function() {
    'use strict';

    var table = document.getElementById('AthleteTheme_wt6_block_wtMainContent_wt9_wtClassTable');

    if (!table) return;

    var date = localStorage.getItem('date') || prompt('Enter date you wish to sign into in format: 20-06-2023');
    var time = localStorage.getItem('time') || prompt('Enter time you wish to sign into in format: 16:30');

    // Save date and time to localStorage
    localStorage.setItem('date', date);
    localStorage.setItem('time', time);

    console.log('Looking for date: ' + date + ' and time: ' + time);

    var trs = table.getElementsByTagName('tr');

    var found = false;

    for (var i = 0; i < trs.length; i++) {
        var spanElements = trs[i].getElementsByClassName('h3');

        if (spanElements.length > 0 && spanElements[0].innerText.includes(date)) {
            // Start searching from next tr
            for (var j = i + 1; j < trs.length; j++) {
                var innerTds = trs[j].getElementsByTagName('td');

                // if we encounter a span with class 'h3', we break the loop
                if (innerTds.length > 0 && innerTds[0].getElementsByClassName('h3').length > 0) {
                    break;
                }

                // Time condition check
                if (innerTds[0] && innerTds[0].innerText.includes('CrossFit WOD: ' + time)) {
                    // Check for 'a' tag with title "make reservation"
                    var aTags = innerTds[2].getElementsByTagName('a');
                    for (var k = 0; k < aTags.length; k++) {
                        if (aTags[k].title.toLowerCase() === 'make reservation' && !aTags[k].innerHTML.includes('icon-calendar--disabled')) {
                            spotFound();

                            aTags[k].click();
                            localStorage.removeItem('date');
                            localStorage.removeItem('time');
                            found = true;
                            break;
                        }
                    }
                }
            }
            break;
        }
    }

    if (!found) {
        console.log('Did not find possibility for date: ' + date + ' and time: ' + time);
        setTimeout(() => {
            console.log('Reloading...');
            window.location.href = location;
        }, 20000);
    }

    // Button to clear localStorage and reload page
    var btn = document.createElement("button");
    btn.innerHTML = "Clear date/time and reload";
    btn.style.position = "fixed";
    btn.style.bottom = "10px";
    btn.style.right = "10px";
    btn.style['z-index'] = '99999';

    btn.onclick = function() {
        localStorage.removeItem('date');
        localStorage.removeItem('time');
        location.reload();
    };

    document.body.appendChild(btn);

})();
