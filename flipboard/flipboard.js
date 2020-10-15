// VIEW MODEL
//
function FlipBoard() {

  const layouts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const cellSizes = [25, 50, 75, 100, 125, 150, 175, 200];

  var me = this;

  // OBSERVERS
  //
  me.moves = ko.observable();
  me.cells = ko.observableArray([]);
  me.availableLayouts = ko.observableArray([]);
  me.layout = ko.observable();
  me.availableCellSizes = ko.observableArray([]);
  me.cellSize = ko.observable(50);
  me.boardSize = ko.pureComputed(function () {
    return (me.layout() || 0) * me.cellSize();
  });
  me.won = ko.pureComputed(function () {
    return me.cells().every(function (cell) {
      return cell();
    });
  });
  me.status = ko.pureComputed(function () {
    return me.won() ? "<b>Won in " + me.moves() + " moves!</b>"
      : me.moves() ? me.moves() + " moves made." : "";
  });

  // WHEN LAYOUT CHANGES, CREATE CELLS AND SHUFFLE THE BOARD
  //
  me.onLayoutChanged = function (layout) {
    var cells = [];
    for (var i = 0, imax = layout * layout; i < imax; i++) {
      cells.push(ko.observable(false));
    }
    me.cells(cells);
    me.onShuffle();
  };

  // CLEAR THE BOARD (RESET ALL CELLS), RESET MOVES-COUNTER
  //
  me.onClear = function () {
    me.cells().forEach(function (cell) {
      cell(false);
    });
    me.moves(0);
  };

  // SHUFFLE THE BOARD (MAKE N*N RANDOM MOVES), RESET MOVES-COUNTER
  // 
  me.onShuffle = function () {
    me.onClear();
    me.cells().forEach(function () {
      me.onMove(Math.floor(Math.random() * me.cells().length))();
    });
    me.moves(0);
  };

  // MAKE A MOVE
  //
  me.onMove = function (index) {
    return function () {
      if (!me.won()) {
        var row = Math.floor(index / me.layout());
        var col = index % me.layout();
        me.cells().forEach(function (cell, i) {
          var r = Math.floor(i / me.layout());
          var c = i % me.layout();
          if (r === row || c === col) {
            cell(!cell());
          }
        });
        me.moves(me.moves() + 1);
      }
    };
  };

  // VIEW MODEL CONSTRUCTOR
  //
  me.init = function () {
    me.availableCellSizes(cellSizes.map(function (key) {
      return { key: key, value: key + " px tiles" };
    }));
    me.availableLayouts(layouts.map(function (key) {
      return { key: key, value: key + " x " + key + " cells" };
    }));
    me.layout.subscribe(me.onLayoutChanged);
  };

  me.init();

}

// DOCUMENT READY, CREATE VIEW MODEL, BIND TO THE VIEW
//
$(function () {
  var vm = new FlipBoard();
  ko.applyBindings(vm);
});
