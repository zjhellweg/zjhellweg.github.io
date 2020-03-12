const Words = GetWords();
let UsedWords = WordArray = JSON.parse(localStorage.getItem('Words'))
let AllLettersGuessed = ["1"];
const Alphabet = GetLetters('abcdefghijklmnopqurstuvwxyz');
Alphabet.push("surrender");//here for surrender function, not enterable normally.
let Guesses = 0;
let NumberOf = GetNumberOfAttempts();
let Wins = GetScore('Wins');
let Losses = GetScore('Losses');
//console.log(Alphabet);
const LoadingStatementVar = document.getElementById('LoadingStatement');
const ScoreBoard = document.getElementById("scoreboard");
const ClearScoreBoard = document.getElementById("clear-scoreboard");
const Input = document.getElementById("word-guess");
const Button = document.getElementById("button");
const HangMan = document.getElementById("hangman");
const Message = document.getElementById("message-display");
const Surrender = document.getElementById('surrender');
const Settings = document.getElementById('settings');
const ExitSettings = document.getElementById('exit-settings');
let WordBig = Load();
addEventListeners();
LoadingStatement();

function LoadingStatement(){
  X = "One,Two,Three,Four,Five,Six,Seven,Eight,Nine,Ten,Eleven,Twelve,Thirteen,Fourteen,Fifteen,Sixteen,Seventeen,Eighteen,Nineteen,Twenty,Twenty One,Twenty Two,Twenty Three,Twenty Four,Twenty Five,Twenty Six".split(",");
  Y = "Guess Letters in the word, you have "+ X[NumberOf-1]+" guess"
  if(NumberOf > 1){
   Y = Y + "es";
   console.log(NumberOf);
  }
  Y = Y+" <br> These are not consumed when you guess correctly"
  LoadingStatementVar.innerHTML = Y;
}

function Load() {
  let Word = ChooseWord();
  let Letters = GetLetters(Word);
  //console.log(Letters);
  // let GuessedLetters = ["a", "b", "c", "d"]
  CreateHangman(Word,AllLettersGuessed);
  return(Word);
}

function addEventListeners(){
  Button.addEventListener("click",Submit);
  Settings.addEventListener("click",LoadSettings);
  Surrender.addEventListener('click',Surrenderer);
  ExitSettings.addEventListener('click',Exit)
  ScoreBoard.addEventListener('click',LoadScoreBoard);
  ClearScoreBoard.addEventListener('click',RemoveScoreBoard);
  
}

function GetWords() {
    let WordArray;
  if (localStorage.getItem('Words') === null){
    WordArray = ["GrigoriYefimovichRasputin", //1
                 "Virus",  //2
                 "Blast", //3
                 "Ideology", //4
                 "Compromised", //5
                 "Trator", //6
                 "Proletariat", //7
                 "Imperialist", //8
                 "Swine", //9
                 "Bourgeoisie", //10
                 "Conviction", //11
                 "Queue", //12
                 "Distribute", //13
                 "Sacrifice", //14
                 "Stalin", //15
                 "RedSun", //16
                 "Surrender", //17
                 "Appreciate", //18
                 "Management", //19
                 "Otorhinolaryngological"]; //20
  } else {
    WordArray = JSON.parse(localStorage.getItem('Words'))
  }
  console.log(WordArray);
  localStorage.setItem('Words',JSON.stringify(WordArray));
  return WordArray;
}

function SubtractWord(Word) {
  for (let X = 0; X < UsedWords.length; X++) {
    if (UsedWords[X] == Word) {
      UsedWords.splice(X, 1);
    }
    if (UsedWords.length == 0) {
      UsedWords = Words;
    }
  }
  return(Word);
}

function GetLetters(Word) {
  Word = Word.split("");
  return(Word);
}

function ChooseWord() {
  let Random = Math.floor(Math.random()*UsedWords.length);
  let Word = UsedWords[Random];
  SubtractWord(Word);
  console.log(Word);
  //console.log(UsedWords);
  return(Word);
}

function CreateHangman(Word,GuessedLetters) {
  let WordSoup = GetLetters(Word);
  let Display = "";
  let Checker = '';
  WordSoup.forEach(element => {
    // eval makes a string count as code for the porpouses of the if statement
    if (GuessedLetters.indexOf(element.tolowercase) !== -1) {
      Display = Display+element+" ";
      Checker = Checker+element;
    }else{
      Display = Display+"_ ";
      Checker = Display+'_';
    }
  });
  Display = Display.slice(0,-1);
  HangMan.children[0].innerHTML = "";
  HangMan.children[0].innerHTML = Display;
  return(Checker);//to see if you have won
}

function Submit(e){
  //console.log(e);
  //e.preventDefault();
  let Value = Input.value;
  Surrender.setAttribute('style','display:block');
  Settings.setAttribute('style','display:none');
  Input.value = "";
  if (Alphabet.indexOf(Value.toLowerCase()) !== -1) {
    console.log(AllLettersGuessed.indexOf(Value));
    console.log(AllLettersGuessed);
    console.log(Value);
    if (AllLettersGuessed.indexOf(Value.toLowerCase()) !== -1) {
      alert("You already guessed that.")
      console.log(AllLettersGuessed);
    } else {
        AllLettersGuessed.push(Value.toLowerCase());
        Checker = CreateHangman(WordBig,AllLettersGuessed);
        GetCounter(Value);
        let AttLeft = NumberOf-Guesses
        if (Checker==WordBig){
          Wins++
          localStorage.setItem('Wins',Wins);
          Message.children[0].innerHTML = "You won, by guessing every letter."
          Button.setAttribute('disabled',"disabled");
          let Restart = document.createElement('input');
          Restart.setAttribute('type','button');
          Restart.setAttribute('value','Start New Game');
          Restart.setAttribute('id','NewGame');
          Restart.className = "btn btn-success btn-block";
          Restart.addEventListener("click",'NewGame');
          Message.appendChild(Restart);
          Surrender.setAttribute('style','display:none');
          Settings.setAttribute('style','display:block');

        } else if (AttLeft > 0){
          Message.children[0].innerHTML = "You have used " + Guesses.toString() + " attempts so far and have " + (AttLeft).toString() + " guesses left.";
        } else {
          Losses++
          localStorage.setItem('Losses',Losses);
          Message.children[0].innerHTML = "You have used all your attempts. The word was "+WordBig;
          Button.setAttribute('disabled',"disabled");
          let Restart = document.createElement('input');
          Restart.setAttribute('type','button');
          Restart.setAttribute('value','Start New Game');
          Restart.setAttribute('id','NewGame');
          Restart.className = "btn btn-success btn-block";
          Restart.addEventListener("click",NewGame);
          Message.appendChild(Restart);
          Surrender.setAttribute('style','display:none');
          Settings.setAttribute('style','display:block');
        }
    }
  } else {
    alert("please pick a letter")
    console.log(Alphabet.indexOf(Value));
  }
  e.preventDefault(); 
}

function GetCounter(Letter){
  //The Counter is an array of incorrect guesses, when counting consider length
  if (WordBig.toLowerCase().indexOf(Letter.toLowerCase()) !== -1) {
    alert("You guessed correctly");
  } else {
    Guesses++
  }
}


function NewGame() {
  AllLettersGuessed = ['1'];
  Guesses = 0;
  let display = document.createElement('p');
  display.setAttribute('id','message-display-content');
  display.className = 'card-text';
  display.setAttribute('align','center');
  while (Message.hasChildNodes()) {
    Message.removeChild(Message.firstChild);
  }
  Message.appendChild(display);
  Button.removeAttribute('disabled');
  WordBig = Load();
  Button.removeEventListener('click',RemoveScores);
  ScoreBoard.setAttribute('style',"display:block");
  ClearScoreBoard.setAttribute('style','display:none');
  //These are here becaue i want any action to remove the scoreboard.
}

function Surrenderer(e) {
  Guesses = NumberOf;
  Input.value = "Surrender";
  Submit(e);
}

function GetNumberOfAttempts() {
  let Attempts;
  if (localStorage.getItem('Attempts')===null){
     Attempts = 6;
    console.log(Attempts);
  } else {
     Attempts = localStorage.getItem('Attempts')
  }
  console.log(Attempts);
  localStorage.setItem('Attempts',Attempts);
  return(Attempts);
}

function GetScore(index) {
  let Score;
  if (localStorage.getItem(index)===null){
    Score = 0;
  } else {
    Score = localStorage.getItem(index);
  }
  localStorage.setItem(index,Score)
  return(Score);
}

function LoadSettings() {
  Settings.setAttribute('style','display:none');
  ExitSettings.setAttribute('style','display:block');
  Input.setAttribute('style','display:none');
  Button.setAttribute('style','display:none');
  let AttemptSlider = document.createElement('input');
  AttemptSlider.setAttribute  ('type','range');
  AttemptSlider.setAttribute  ('min','1');
  AttemptSlider.setAttribute  ('max','25');
  AttemptSlider.setAttribute  ('id','setAttribute');
  AttemptSlider.setAttribute  ('value',NumberOf.toString());
  AttemptSlider.className = 'form-control-range';
  let SliderNumber = document.createElement('h5');
  //let Number =  document.createTextNode(NumberOf);
  SliderNumber.innerHTML = NumberOf + " Attempts";
  SliderNumber.className ='text-center';
  SliderNumber.setAttribute('id','AttemptCurrent')
  let SliderForm = document.createElement('form');
  SliderForm.className = 'range-field my-4 w-50 float-left p-1';
  
  SliderForm.appendChild(AttemptSlider);
  SliderForm.appendChild(SliderNumber);
  HangMan.children[0].innerHTML = "";
  HangMan.appendChild(SliderForm);
  //console.log(SliderForm);
  AttemptSlider.setAttribute ('oninput','ChangeAttempts()');
  //AttemptSlider.addEventListener('oninput',ChangeAttempts(document.getElementById('setAttribute').value));'
  let AddWordInput = document.createElement('input');
  AddWordInput.setAttribute('type','text');
  AddWordInput.setAttribute('maxlength','25');
  AddWordInput.setAttribute('minlength','5');
  AddWordInput.setAttribute('id','add-word');
  AddWordInput.setAttribute('placeholder','Words between 5 and 25 characters');
  AddWordInput.className = 'form-control';
  let AddWordSubmit = document.createElement('input');
  AddWordSubmit.setAttribute('value','Add Word');
  AddWordSubmit.setAttribute('id','add-word-button');
  AddWordSubmit.className = 'btn btn-success btn-block';
  AddWordSubmit.addEventListener('click',IncreaseWords);
  let AddWordForm = document.createElement('form');
  AddWordForm.setAttribute('method','post');
  AddWordForm.className = 'form-group w-50 float-right p-1';
  AddWordForm.appendChild(AddWordInput);
  AddWordForm.appendChild(AddWordSubmit);
  //console.log(AddWordForm);
  HangMan.appendChild(AddWordForm);
  if(document.getElementById('NewGame') !== 'undefined' && document.getElementById('NewGame') !== null){
    Message.setAttribute('style','display:none')
  }


}

function IncreaseWords(e){
  e.preventDefault();
  console.log(Words);
  let NewWord = document.getElementById('add-word').value;
  document.getElementById('add-word').value = "";
  let NewWordLetters = GetLetters(NewWord);
  let IsAlpha = true;
  if ((NewWord.length < 5) || (NewWord.length > 25)){
   IsAlpha = false;
   console.log(NewWord.length);
   console.log(IsAlpha);
  }
  NewWordLetters.forEach  (element => {
    if (Alphabet.indexOf(element).tolowercase == -1) {
    IsAlpha = false;
    console.log("fatty")
    }
  });
  if (IsAlpha == true) {
    console.log(IsAlpha);
    Words.push(NewWord);
    localStorage.setItem('Words',JSON.stringify(Words));
  } else {
    alert("Your word must be between 5 and 25 characters, and have only letters.")
  }
}

function ChangeAttempts() {
  Value = document.getElementById('setAttribute').value;
  NumberOf = Value;
  localStorage.setItem('Attempts',Value);
  document.getElementById('AttemptCurrent').innerHTML = NumberOf+" Attempts";
  LoadingStatement()
    
}

function Exit() {
  Settings.setAttribute('style','display:block');
  ExitSettings.setAttribute('style','display:none');
  Input.setAttribute('style','display:block');
  Button.setAttribute('style','display:block');
  //console.log(HangMan);
  //console.log(HangMan.childNodes[4])
  HangMan.removeChild(HangMan.childNodes[3]);
  HangMan.removeChild(HangMan.childNodes[3]);
  let display = document.createElement('p');
  Message.appendChild(display);
  CreateHangman(WordBig,AllLettersGuessed);
  Message.appendChild(display);
  if(document.getElementById('NewGame') !== 'undefined' && document.getElementById('NewGame') !== null){
    Message.removeAttribute('style')

  }
}

function LoadScoreBoard(e) {
  ScoreBoard.setAttribute('style',"display:none");
  ClearScoreBoard.setAttribute('style','display:block');
  let WinLog = document.createElement('h1');
  WinLog.setAttribute('id','WinLog');
  WinLog.innerHTML = 'You have won '+Wins+' games.'
  let LossLog = document.createElement('h1');
  LossLog.setAttribute('id','LossLog');
  LossLog.innerHTML = 'You have lost '+Losses+' games.'
  
  Message.appendChild(WinLog);
  Message.appendChild(LossLog);
  Button.addEventListener('click',RemoveScores);
  e.preventDefault();
}

function RemoveScoreBoard() {
  if(confirm("Do you want to reset your wins/losses?.")){
  ScoreBoard.setAttribute('style',"display:block");
  ClearScoreBoard.setAttribute('style','display:none');
  Button.addEventListener('click',RemoveScores);
  document.getElementById('WinLog').remove();
  document.getElementById('LossLog').remove();
  localStorage.setItem('Wins',0);
  localStorage.setItem('Losses',0);
  Wins = 0;
  Losses = 0;
  Button.removeEventListener('click',RemoveScores);
  }else{
    RemoveScores();
  }
}

function RemoveScores(){
  ScoreBoard.setAttribute('style',"display:block");
  ClearScoreBoard.setAttribute('style','display:none');
  document.getElementById('WinLog').remove();
  document.getElementById('LossLog').remove();
  Button.removeEventListener('click',RemoveScores);
}