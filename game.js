var lastClicked = '1-1';
var canClick = true;
var boardX = 0;
var boardY = 0;
var bananaLocations = [];
var score = 0;
var lastWindowWidth = $(window).width();

//  //  //  New Additions to code   //  //  //

var question = '';
var num1 = 0;
var num2 = 0;
var num1Multiplier = 1;
var num2Multiplier = 1;
var answer = 0;  //Is this var necessary?
var answerOptions = [];
var answerSlots = [];
var level = 0;
var timer = false;
var timeRemaining = 0;
var timeInterval;
var previousPos;

function createQuestion(){
  console.log(level);
  switch (true) {
    case level == 1:
      console.log("Level 1 is active");
      num1Multiplier = 10;
      num2Multiplier = 10;
      break;
    case level == 2:
      console.log("Level 2 is active");
      num1Multiplier = 100;
      num2Multiplier = 10;
      break;
    case level == 3:
      console.log("level 3 is active");
      num1Multiplier = 100;
      num2Multiplier = 100;
      break;
    default:
      console.log("Man, you really just don't understand switch statements huh?");
      break;
  }
  num1 = Math.random(0, 1) * num1Multiplier;
  num1 = Math.round(num1);
  calcuateNum2();
  question = num1 + ' - ' + num2;
  answer = num1 - num2;
  $('#question-text').text(question);
}

function calcuateNum2(){
  num2 = Math.random(0, 1) * num2Multiplier;
  num2 = Math.round(num2);
  if(num2 > num1){
    calcuateNum2();
  }
}

function setSettings(){
  currentLevel = level;
  currentTimer = timer;
  // console.log('Selected level is: ' + $('#level').val());
  // console.log('Timer is set to: ' + $('#timer').val());
  level = $('#level').val();
  timer = $('#timer').val();
  if(timer > 0){
    setTimer();
  }
  else {
    clearInterval(timeInterval);
  }
  // console.log(level);
  // console.log(timer);
  if(currentLevel != level || currentTimer != timer){
    setUpGame(boardX, boardY);
  }
}

$('#level').change(function(){
  setSettings();
});
$('#timer').change(function(){
  setSettings();
});

function setTimer(){
  timeRemaining = $('#timerDuration').val();
  timeInterval = setInterval(function(){
    if(timeRemaining > 0){
      // console.log(timeRemaining);
      $('#timer-text').text(timeRemaining);
      timeRemaining -= 1;
    }
    else{
      console.log("Time is up!");
      $('#timer-text').text(timeRemaining);
      clearInterval(timeInterval);
      timeIsOut();
    }
  }, 1000);
}

function displayAnswerChoices(){
  // numOfOptions= 0;
  answerOptions = [];
  answerOptions.push(answer);
  //check if can move only right or only left
  if (lastClicked[0] == 1 || lastClicked[0] == boardX) {
    // console.log("I can only move left or right");
    // numOfOptions +=1
    addAnswerOption();
  }
  // else can move right and left
  else{
    // console.log("Left and right");
    // numOfOptions += 2;
    addAnswerOption();
    addAnswerOption();
  }
  //check if can move only right or left
  if (lastClicked[2] > 1 && lastClicked[2] < boardY) {
    // console.log("I can only move up or down");
    // numOfOptions +=1;
    addAnswerOption();
  }
  // console.log(answerOptions)
  answerOptions = shuffle(answerOptions);
  // console.log("shuffled: ")
  // console.log(answerOptions);

  setAnswerSlots();
  // console.log(answerSlots);

  for(var i=0; i<=answerSlots.length; i++){
    $(answerSlots[i]).append(document.createElement('div'));
    $(answerSlots[i]).children('div').addClass('answerChoice');
    $(answerSlots[i]).children('div').text(answerOptions[i]);
  }
}

function addAnswerOption(){
  possibleAnswer = 0;
  if( (Math.round(Math.random(0,1) * 10)%2==0) ){
    randomAdd = Math.floor(Math.random()*(1-7+1) + 1)
    // * (answer+1));
    console.log(randomAdd);
    possibleAnswer = answer + randomAdd;
  }
  else{
    randomMinus = Math.floor(Math.random()*(1-7+1) + 1 )
    // * (answer+1));
    console.log(randomMinus);
    possibleAnswer = answer - randomMinus;
  }
  if(possibleAnswer <0){
    possibleAnswer *= -1;
  }
  answerOptions.push(possibleAnswer);
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function setAnswerSlots(){
  if(lastClicked[0] < boardX){
    // console.log('Need to put a number to the right')
    answerSlots.push('#'+(parseInt(lastClicked[0]) + 1)+'-'+lastClicked[2])
  }
  if(lastClicked[0] > 1){
    // console.log('Need to put a number to the left');
    answerSlots.push('#'+(lastClicked[0]-1)+'-'+lastClicked[2])
  }
  if(lastClicked[2] < boardY){
    // console.log('Need to put a number above');
    answerSlots.push('#'+lastClicked[0]+'-'+(parseInt(lastClicked[2]) +1));
  }
  if(lastClicked[2] > 1){
    // console.log('Need to put a number below');
    answerSlots.push('#'+lastClicked[0]+'-'+(lastClicked[2] - 1));
  }
}

function checkAnswer(answerX, answerY){
  // console.log('#'+answerX+'-'+answerY)
  // console.log($('#'+answerX+'-'+answerY).children('div').text())
  if(timeInterval){
    clearInterval(timeInterval);
  }
  userAnswer = $('#'+answerX+'-'+answerY).children('div').text();
  if(userAnswer){
    for(var i=0; i<answerSlots.length; i++){
      $(answerSlots[i]).children('div').remove();
    }
    answerSlots = [];
    if(userAnswer == answer){
      console.log("Correct!");
      celebrate();
      // checkForBanana();
      createQuestion();
      displayAnswerChoices();
    }
    else{
      console.log('Wrong!');
      pitFall();
      // walkBack(previousPos[1], previousPos[3]);
    }
    // createQuestion();
  }
  else{
    sit();
  }


  if(timer > 0 || !timeInterval){
    setTimer();
  }

}

function pitFall(){
  $('.monkey-pic').attr("src", "./images/monkeyFall1.png");
  setTimeout(function(){
    $('.monkey-pic').attr("src", "./images/monkeyFall2.png");
    setTimeout(function(){
      $('.monkey-pic').attr("src", "./images/monkeyFall3.png");
      setTimeout(function(){
        walkBack(previousPos[1], previousPos[3]);

        createQuestion();
        displayAnswerChoices();
      } , 500);
    }, 500);
  }, 500);
  // walkBack(previousPos[1], previousPos[3])
  score -=100;
  $('#score-text').html(score);

  setTimeout(sit,1500);
}

function walkBack(returnToX, returnToY){
  $('#'+lastClicked[0]+'-'+lastClicked[2]).removeClass('clicked');
  lastClicked = previousPos[1]+'-'+previousPos[3];
  $('#'+returnToX+'-'+returnToY).addClass('clicked');
}

function timeIsOut(){
  $('.monkey-pic').attr("src", "./images/monkeyTimesUp.png");
  score -=100;
  $('#score-text').html(score);

  for(var i=0; i<answerSlots.length; i++){
    $(answerSlots[i]).children('div').remove();
  }
  answerSlots = [];
  // displayAnswerChoices();


  setTimeout(function(){
    createQuestion();
    displayAnswerChoices();
    walk(lastClicked[0], lastClicked[2], lastClicked[0], lastClicked[2]);

    // sit();
    // setTimer();
  },1000);
}






//  //  //      //  //  //

//create the img element for the monkey pic to be added to td in setUpGame
function createPic(){
  img = document.createElement('img');
  img.classList.add('monkey-pic');
  img.alt = 'monkey';
  return img;
}
//generates three sets of ranodom numbers which are used to make ids added to bananaLocations
function placeBanana(){

  for(var i=0;i<3;i++){
    var num1 = Math.ceil(Math.random()*boardX);
    var num2 = Math.ceil(Math.random()*boardY);
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
  }
}

//checks if the lastClicked location == any element inside of bananaLocations. if so removes
  //that id from bananaLocations and triggers the celebrate animation. otherwise, triggers sit animation
function checkForBanana(){

  for (var i = 0; i < bananaLocations.length; i++) {
    if(lastClicked === bananaLocations[i]){
      $('#'+lastClicked).children('.banana').remove();
      var index = bananaLocations.indexOf(lastClicked)
      if (index > -1) {
        bananaLocations.splice(index, 1);
      }
      celebrate();
    }
    else{
      console.log('entered else block')
      sit();
    }
  }
};
function clearBananas(){
  for(var i=0;i<bananaLocations.length;i++){
    $('#'+bananaLocations[i]).children('.banana').remove();
  }
  bananaLocations=[];
}


//creates a table with x columns and y rows. each td gets a unique id based on its position and a img
  //element created from createPic. Then calls placeBanana
  // also calls createQuestion to create and display question and setSettings to set the settings
function setUpGame(x,y){

  if(answerSlots.length > 0){
    for(var i=0; i<answerSlots.length; i++){
      $(answerSlots[i]).children('div').remove();
    }
    answerSlots = [];
    // displayAnswerChoices();
  }


  walk(0,0,1,1);
  clearBananas();
  $('.board').empty();
  for(var y;y>0;y--){
    tr = document.createElement('tr');
    for(var ii=x;ii>0;ii--){
      td = document.createElement('td');
      tr.prepend(td);
      td.id=(ii)+'-'+(y);
      td.classList.add('square');
      td.append(createPic());
    }
    $('.board').append(tr);
  }
  // setSettings();
  placeBanana();
  createQuestion();
  checkAnswer(1,1);
  displayAnswerChoices();
};

//when page loads, set boardx and boardY based on screen width,which lastWindowWidth is then set to,
  // then call setUpGame
var screenWidth = $(window).width();
if(screenWidth > 1024){
  boardX = 6;
  boardY = 5;
  lastWindowWidth = screenWidth;
}
else if(768 < screenWidth && screenWidth < 1023){
  boardX = 5;
  boardY = 4;
  lastWindowWidth = screenWidth;
}
else if(screenWidth < 767){
  boardX = 4;
  boardY = 4;
  lastWindowWidth = screenWidth;
}
// set the settings and setUpGame(boardX,boardY); inside
setSettings();

//When window is resized, start a timer for half of a second. if the timer runs out, call doneResizing.
  //if the window is resized again in that half second, reset the timer
var resizeId;
$(window).resize(function() {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 500);
});

//if new length is in the same width set as the previous width, do not resize and disrupt the game.
  //if the new length is in a new width set, call resizeBoard and pass in the new length.
function doneResizing(){
  currentWidth = $(window).width(); // New width

  if(lastWindowWidth > 1023 && currentWidth < 1023){
    resizeBoard(currentWidth)
  }
  else if((lastWindowWidth > 768)&&(lastWindowWidth<1023) ){
    if((currentWidth< 768)||(currentWidth>1023)){
      resizeBoard(currentWidth)
    }
    else{
      // console.log('%c width set did not change', 'color:#bada55');
    }

  }
  else if(lastWindowWidth < 767 && currentWidth > 767){
    resizeBoard(currentWidth)
  }
  else{
    // console.log('%c width set did not change', 'color:#bada55');
  }
}


//set boardX and boardY based on the given width and then call setUpGame
function resizeBoard(currentWidth){
  // console.log('%c width set changed', 'color:#bada55');
  if(currentWidth > 1024){
    // console.log('Width set: Desktop width');
    boardX = 6;
    boardY = 5;
    lastWindowWidth = currentWidth;
  }
  else if(768 < currentWidth && currentWidth < 1023){
    // console.log('Width set: Tablet width')
    boardX = 5;
    boardY = 4;
    lastWindowWidth = currentWidth;
  }
  else if( currentWidth < 767){
    // console.log('width set: phone width');
    boardX = 4;
    boardY = 4;
    lastWindowWidth = currentWidth;
  }
  else{
    console.log('ERROR: doneResizing(): Undefined width found');
  }
  setUpGame(boardX,boardY);
}


//sets monkey-pic to be the sitting animation then checks if bananaLocations is empty, meaning
  //all bananas have been picked up, and if so calls placeBanana to generate more random bananas
function sit(){
  $('.monkey-pic').attr("src", "./images/monkeySitting.png");
  if(bananaLocations.length==0){
    placeBanana();
  }
}
//sets monkey-pic to be the celebration animation then adds to the score and updates the score text
  //then after a second calls the sit function
function celebrate(){
  $('.monkey-pic').attr("src", "./images/monkeyCelebration.png");
  score +=100;
  $('#score-text').html(score);
  setTimeout(function(){
    sit();
    setTimeout(checkForBanana(),1000);
  },1000);
}
//if given an even number sets monkey-pic to be right step animation. if given an odd number
  //sets monkey-pic to be left step animation
function chooseStep(i){

  if(i%2==0){
    $('.monkey-pic').attr("src", "./images/monkeyWalking2.png");
  }
  else if(i%2==1){
    $('.monkey-pic').attr("src", "./images/monkeyWalking1.png");
  }
  else{
    console.log('ERROR: chooseStep(): number neither even nor odd')
  }
}
//checks x and y location of monkey and compares it to where the player clicked. first matchs
  //the x location then matches the y location. once the desired location is reached, checks for
  //bananas. then sets canClick to true
function walk(currentx,currenty,newx,newy){
  // previousPos = '#'+lastClicked[0] + '-' + lastClicked[2];


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




      //check for bannana if correct answer.
    // checkForBanana();
    checkAnswer(newx, newy);
    // for(var i=0; i<answerSlots.length; i++){
    //   $(answerSlots[i]).children('div').remove();
    // }
    // answerSlots = [];
    // displayAnswerChoices();
    canClick = true;
  }
}
//given the id of a space that has been clicked, creates 4 variables for the current x and y locations
  //and the desired x and y locations. then passes these 4 variables into the walk function
function handleClick(newId){
  var currentx = lastClicked[0];
  var currenty = lastClicked[2];
  var newx = newId[0];
  var newy = newId[2];
  previousPos = '#'+currentx+'-'+currenty;
  walk(currentx,currenty,newx,newy)
}

//when a td with class of square is clicked on, checks if canClick==true. if so calls handleClick and gives it the
  //id of the td clicked
$(document).on('click','.answerChoice',function(event){
  if(canClick){
    console.log(event.currentTarget.parentElement);
    canClick = false;
    handleClick(event.currentTarget.parentElement.id);
  }
  else{
    console.log("Can't click now")
  }
});
