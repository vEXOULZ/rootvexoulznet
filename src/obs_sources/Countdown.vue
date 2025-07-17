
<template>
    <p id="time_field" class="textcamp">0:00:00</p>
    <p id="text_field" class="textcamp">&nbsp;</p>

</template>


<script setup>

import alarmsound from './../assets/alarm.mp3'

document.addEventListener('DOMContentLoaded', () => {

    document.getElementsByTagName('body')[0].classList.add("bodyempty")

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const HOURS   = urlParams.get('h', 0);
    const MINUTES = urlParams.get('m', 0);
    const SECONDS = urlParams.get('s', 0);
    const TEXT    = urlParams.get('text', '');

    document.getElementById("text_field").innerHTML = TEXT

    const totalSeconds = 3600 * HOURS + 60 * MINUTES + SECONDS


    var t = new Date().getTime() + totalSeconds * 1000;

    function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    // Set the date we're counting down to

    var flip = true;
    var played = false;

    var audio = new Audio(alarmsound);
    audio.volume = 0.1;
    audio.loop = true;

    function run() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = t - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("time_field").innerHTML = hours + ":"
        + pad(minutes, 2) + ":" + pad(seconds, 2) + "";

        // If the count down is finished, write some text
        if (distance < 0) {
        // clearInterval(x);
        if (flip) {
            document.getElementById("time_field").innerHTML = "⠀🔔";
            flip = false;
        } else {
            document.getElementById("time_field").innerHTML = "🔔⠀";
            flip = true;
        }
        if (!played) {
            audio.play();
            played = true;
        }
        }
    }
    // first update
    run();

    // Update the count down every 1 second
    var x = setInterval(run, 100);

})

</script>


<style scoped>
    .textcamp {
        text-align:center;
        color:white;
        font-family:monospace;
        text-shadow: 1px 1px 1px black;
        margin-bottom: 0;
        margin: 0;
        padding-top:0
    }

        
</style>
