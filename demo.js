/* Coralik: X/O — hero demo board animation
   A short looping sequence that shows the game's signature
   bonus mechanics: placing marks, exploding an opponent's
   cell, and freezing a cell — straight from the FAQ. */

(function () {
  "use strict";

  function initDemoBoard(root) {
    var cells = Array.prototype.slice.call(root.querySelectorAll(".demo-cell"));
    var footnote = root.querySelector(".demo-footnote");
    if (!cells.length) return;

    var messages = root.dataset.messages ? JSON.parse(root.dataset.messages) : [];

    function setNote(i) {
      if (footnote && messages[i] !== undefined) footnote.textContent = messages[i];
    }

    function clearCell(i) {
      var cell = cells[i];
      cell.classList.remove("show", "boom", "frozen");
      var mark = cell.querySelector(".mark");
      if (mark) mark.className = "mark";
      cell.innerHTML = "";
    }

    function placeMark(i, symbol) {
      var cell = cells[i];
      cell.innerHTML = '<span class="mark ' + (symbol === "X" ? "x" : "o") + '">' + symbol + "</span>";
      requestAnimationFrame(function () {
        cell.classList.add("show");
      });
    }

    function boom(i) {
      var cell = cells[i];
      cell.classList.add("boom");
      setTimeout(function () {
        clearCell(i);
        cell.classList.remove("boom");
      }, 420);
    }

    function freeze(i) {
      cells[i].classList.add("frozen");
    }

    function unfreeze(i) {
      cells[i].classList.remove("frozen");
    }

    var t = 0;
    var timers = [];

    function at(ms, fn) {
      timers.push(setTimeout(fn, ms));
    }

    function clearAllTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function runCycle() {
      clearAllTimers();
      cells.forEach(function (_, i) {
        clearCell(i);
      });

      setNote(0);
      at(500, function () { placeMark(4, "X"); });
      at(1100, function () { setNote(1); placeMark(1, "O"); });
      at(1700, function () { placeMark(0, "X"); });
      at(2300, function () { setNote(2); placeMark(7, "O"); });
      at(3000, function () { setNote(3); boom(1); });
      at(3500, function () { placeMark(1, "X"); });
      at(4100, function () { setNote(4); freeze(7); });
      at(6100, function () { unfreeze(7); setNote(5); });
      at(7200, runCycle);
    }

    runCycle();

    // Pause animation politely if the user prefers reduced motion.
    var media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      clearAllTimers();
      placeMark(4, "X");
      placeMark(1, "O");
      placeMark(0, "X");
      placeMark(7, "O");
      setNote(messages.length ? messages.length - 1 : 0);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-demo-board]").forEach(initDemoBoard);
  });
})();
