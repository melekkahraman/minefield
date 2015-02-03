
var rowCnt;
var colCnt;
var mineCnt;
var field;
var timeLeft;
var timerId;

function decreaseTime() {
  timeLeft--;
  $("#time").html(timeLeft);
  if (timeLeft == 0) {
    gameOver();
  }
}

function gameOver() {
    clearInterval(timerId);
    $("#field td.closed").each(function() {
        var cell = $(this);
        cell.removeClass("closed");
        var val = field[cell.data("row")][cell.data("col")];
        if (val == "M") {
          cell.addClass("mine")
        }  
        else {
          cell.html(val);
        }
    })
}

function startGame() {
    // clearInterval(timerId);
    timerId = setInterval(decreaseTime, 1000);
    var coords = [];
    timeLeft = 120;
    rowCnt = $("#row-cnt").val();
    colCnt = $("#col-cnt").val();
    mineCnt = $("#mine-cnt").val();
    field = new Array();
    for (var i=0; i<rowCnt; i++) {
      var newRow = new Array();
      for (var j=0; j<colCnt; j++) { 
        newRow.push(null);
        coords.push([i,j]);
      }
      field.push(newRow);  
    }

    shuffle(coords);
    var mineCoords = coords.slice(0,mineCnt);

    mineCoords.forEach(function(coord) {
      var r = coord[0];
      var c = coord[1];
      field[r][c] = "M";
    })

    for (var i=0; i<rowCnt; i++) {
      for (var j=0; j<colCnt; j++) {
        if (field[i][j] == "M") continue;
        var coords = neighbors(i,j);
        var cnt = 0;
        coords.forEach(function(coord) {
          var cell = field[coord.row][coord.col];
          if (cell == "M") cnt++;
        })
        field[i][j] = cnt;    
      }
    }
    // construct table
    var table = $("#field");
    for (var i=0; i<rowCnt; i++) {
      var newRow = $("<tr></tr>");
      for (var j=0; j<colCnt; j++) {
         var newCell = $("<td></td>");      
         // newCell.html(field[i][j]==null ? "&nbsp;" : field[i][j]); 
         newCell.html("&nbsp;")
                .data({ "row": i, "col": j})                
                .addClass("closed")         
                .appendTo(newRow);
      }
      table.append(newRow);      
    }    
    $("#gameStart").fadeOut();
    $("#gameArea").fadeIn();
}


$(document).ready(function() {
    // timerId = setInterval(function() { alert("Hadi sene kardesim.") }, 4000);
    $("#start").click(startGame);
    $("#level-select").change(function(){
      var level = $(this).val();
      var cfg = {};
      if (level == "E") {
        cfg = {row: 8, col: 5, mine: 5};
      }
      else if (level == "M") {
        cfg = {row: 12, col: 10, mine: 25};
      }
      else if (level == "H") {
        cfg = {row: 15, col: 15, mine: 100};
      }
      $("#row-cnt").val(cfg.row);
      $("#col-cnt").val(cfg.col);
      $("#mine-cnt").val(cfg.mine);
    });
    
    var table = $("#field");
    table.on("contextmenu", "td", function(event) {
      if (event.which == 3) {
        event.preventDefault();
        console.log("right key");
        $(this).addClass("flagged");
        return false;
      }
    })
    
    table.on("click", "td", function(event) {
      console.log(event);
      var cell = $(this);
      cell.removeClass("closed");
      var val = field[cell.data("row")][cell.data("col")];
      if (val == "M") {
        cell.addClass("mine")
        gameOver();
      }
      else {
        if (val == 0) {
          var coords = neighbors(cell.data("row"), cell.data("col"));
          coords.forEach(function(coord) {
            var r = coord.row;
            var c = coord.col;
            var cellToExpand = $("#field tr").eq(r)
                                 .children("td").eq(c)
            // cellToExpand.css("background-color", "red")                     
            if (cellToExpand.hasClass("closed")) {
               cellToExpand.trigger("click");                     
            }
            
          })
        }
        else {
          cell.html(val);
        }
      }
      
    })
}) // document.ready

// utilities

function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function neighbors(r, c) {
  var result = [];
  for (var i=r-1; i<=r+1; i++) {
    if (i<0 || i>=rowCnt) continue;
    for (var j=c-1; j<=c+1; j++) {
      if (j<0 || j>=colCnt) continue;
      if (i==r && j==c) continue;
      result.push({row:i, col:j});
    }
  }
  return result;
}