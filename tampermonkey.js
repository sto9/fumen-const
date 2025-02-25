// ==UserScript==
// @name         譜面定数表示するやつ
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  譜面定数を表示する
// @author       null
// @include      https://sdvx.in/chunithm/sort/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        let script = document.createElement('script');
        script.setAttribute('src', 'https://sto9.github.io/fumen-const/function.js');
        document.head.appendChild(script);
        rewriteButton();
    };
})();