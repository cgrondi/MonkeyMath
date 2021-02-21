var lastClicked = '1-1';
var canClick = true;
var boardX = 6;
var boardY = 6;
var bananaLocations = [];
var score = 0;

function createPic(){
  img = document.createElement('img');
  img.classList.add('monkey-pic');
  //img.src = './images/monkeySitting.png';
  img.alt = 'monkey';
  return img;
}
function placeBanana(){

  for(var i=0;i<3;i++){
    var num1 = Math.ceil(Math.random()*6);
    var num2 = Math.ceil(Math.random()*6);
    var id = num1+'-'+num2;
    if(bananaLocations.includes(id)){
      i--;
    }
    else{
      bananaLocations.push(id);
    }

  }

  for(var i = 0; i < bananaLocations.length; i++){
    img = document.createElement('img');
    img.classList.add('banana');
    img.src = './images/banana.png';
    img.alt = 'banana';
    $('#'+bananaLocations[i]).append(img);
    console.log('banana placed at ' + bananaLocations[i]);
  }
}

function checkForBanana(){
  for (var i = 0; i < bananaLocations.length; i++) {
    if(lastClicked === bananaLocations[i]){
      $('#'+lastClicked).children('.banana').remove();
      var index = bananaLocations.indexOf(lastClicked)
      if (index > -1) {
        bananaLocations.splice(index, 1);
      }
      celebrate();
      console.log('found banana!, celebrate!');

    }
    else{
      sit();
    }
  }
}



function setUpGame(x,y){
  walk(0,0,1,1);
  for(var y;y>0;y--){
    tr = document.createElement('tr');
    for(var ii=x;ii>0;ii--){
      td = document.createElement('td');
      tr.prepend(td);
      td.id=(ii)+'-'+(y);
      td.classList.add('square');
      td.append(createPic());
      //td.append(createPic2());
    }
    $('.testTable').append(tr);
  }
  placeBanana();
};
setUpGame(boardX,boardY);


function sit(){
  $('.monkey-pic').attr("src", "./images/monkeySitting.png");
  if(bananaLocations.length==0){
    placeBanana();
  }
}
function celebrate(){
  $('.monkey-pic').attr("src", "./images/monkeyCelebration.png");
  score +=100;
  $('#score-text').html(score);
  setTimeout(sit,1000);
}

function chooseStep(i){

  if(i%2==0){

    $('.monkey-pic').attr("src", "./images/monkeyWalking2.png");
  }
  else if(i%2==1){
    $('.monkey-pic').attr("src", "./images/monkeyWalking1.png");
  }
  else{
    console.log('ERROR: chooseStep, number neither even nor odd')
  }
}
function walk(currentx,currenty,newx,newy){
  $('#'+currentx+'-'+currenty).removeClass('clicked');
  //if currentx != desired position
  if(currentx != newx){
    //if currentx is to the left of desired position
    if(currentx<newx){
      //get id of next position
      var newId = (parseInt(currentx)+1)+'-'+currenty;
      //get id of current position
      var oldId = currentx+'-'+currenty;
      //set which picture to use for movement
      chooseStep(parseInt(currentx)+parseInt(currenty));
      //remove the class for showing the walking monkey on old postion
      $('#'+oldId).removeClass('walk-path');
      //add the class for showing the walking monkey on the new position
      $('#'+newId).addClass('walk-path');
      //if new x postion == desired x postion...
      if(parseInt(currentx)+1==newx){
        //set desired postion as the last clicked postion
        lastClicked = newx+'-'+newy;
        console.log('Found my new X location! '+currentx)
        //call this function again after 1 second with new postion as current postion and keeping desired postion the same.
        setTimeout(function(){walk((parseInt(currentx)+1),currenty,newx,newy)},1000);
      }
      //else the new x postion has not yet reached the desired x position
      else{
        //call this function again after 1 second with new postion as current postion and keeping desired postion the same.
        setTimeout(function(){walk((parseInt(currentx)+1),currenty,newx,newy)},1000);
      }
    }
    //if currentx is to the right of desired postion
    else{
      var newId = (parseInt(currentx)-1)+'-'+currenty;
      var oldId = currentx+'-'+currenty;
      chooseStep(parseInt(currentx)+parseInt(currenty));
      $('#'+oldId).removeClass('walk-path');
      $('#'+newId).addClass('walk-path');
      if(parseInt(currentx)-1==newx){
        lastClicked = newx+'-'+newy;
        console.log('Found my new X location! '+currentx)
        setTimeout(function(){walk((parseInt(currentx)-1),currenty,newx,newy)},1000);
      }
      else{
        setTimeout(function(){walk((parseInt(currentx)-1),currenty,newx,newy)},1000);
      }
    }
  }
  //if currenty != desired postion
  else if (currenty != newy) {
    //if currenty is to the left of desired position
    if(currenty<newy){
      var newId = currentx+'-'+(parseInt(currenty)+1);
      var oldId = currentx+'-'+currenty;
      chooseStep(parseInt(currentx)+parseInt(currenty));
      $('#'+oldId).removeClass('walk-path');
      $('#'+newId).addClass('walk-path');
      if(parseInt(currenty)+1==newy){
        lastClicked = newx+'-'+newy;
        console.log('Found my new Y location!');
        setTimeout(function(){walk(currentx,parseInt(currenty)+1,newx,newy)},1000);
      }
      else{
        setTimeout(function(){walk(currentx,parseInt(currenty)+1,newx,newy)},1000);
      }
    }
    //if currenty is to the right of desired position
    else{
      var newId = currentx+'-'+(parseInt(currenty)-1);
      var oldId = currentx+'-'+currenty;
      chooseStep(parseInt(currentx)+parseInt(currenty));
      $('#'+oldId).removeClass('walk-path');
      $('#'+newId).addClass('walk-path');
      if(parseInt(currenty)-1==newy){
        lastClicked = newx+'-'+newy;
        console.log('Found my new Y location!');
        setTimeout(function(){walk(currentx,parseInt(currenty)-1,newx,newy)},1000);
      }
      else{
        setTimeout(function(){walk(currentx,parseInt(currenty)-1,newx,newy)},1000);
      }
    }
  }
  //if current postion is desired position
  else{
    $('#'+currentx+'-'+currenty).removeClass('walk-path');
    $('#'+currentx+'-'+currenty).addClass('clicked');
    checkForBanana();

    //sit();
    console.log('At my spot!');
    canClick = true;
  }
}
function handleClick(newId){
  var currentx = lastClicked[0];
  var currenty = lastClicked[2];
  var newx = newId[0];
  var newy = newId[2];
  walk(currentx,currenty,newx,newy)
}


$('.square').on('click',function(event){
  if(canClick){
    canClick = false;
    handleClick(event.currentTarget.id);
    $('.output').html(event.currentTarget.id);
  }
  else{
    console.log("Can't click now")
  }
});
