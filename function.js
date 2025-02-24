// ==UserScript==
// @name         譜面定数表示するやつ
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  譜面定数を表示する
// @author       null
// @include      https://sdvx.in/chunithm/sort/*
// @grant        none
// ==/UserScript==

function exec() {
  console.log("");
}

(function () {
  'use strict';
  window.onload = function () {
    let span = document.getElementById("reload_btn").querySelector("span");
    span.setAttribute("onclick", "javascript:exec()");
    span.innerText = "譜面定数を表示";
  };
})();