var storage;
var ref;
var submitButton;
var IA_predicts;
var dropzone;

let img, bg, hover;

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
const classifier = ml5.imageClassifier("MobileNet", modelReady);

function setup() {
  //drag and drop
  createCanvas(400, 400).drop(gotFile).dragOver(highlight).dragLeave(redraw);

  textAlign(CENTER).textSize(32).textStyle(BOLD).noLoop();
  colorMode(RGB).imageMode(CORNER);
  fill("yellow").noStroke();

  bg = color(0o200);
  hover = color("red");
  /*
  var saveButton = select("#saveButton");
  //saveButton.mousePressed(saveNuage);

  //Connection à la base de données
  var firebaseConfig = {
    apiKey: "AIzaSyASRtt6ShRqK7dKVuFmXIStUeNjIhe05Pc",
    authDomain: "p5-nuages.firebaseapp.com",
    projectId: "p5-nuages",
    databaseURL: "https://p5-nuages-default-rtdb.firebaseio.com/",
    storageBucket: "p5-nuages.appspot.com",
    messagingSenderId: "1088666157965",
    appId: "1:1088666157965:web:22f84149ed1785fefc73c4",
    measurementId: "G-K8DJ42LV4T",
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  storage = firebase.storage();
  ref = firebase.storage().ref();
  console.log(img);*/
}
function draw() {
  background(bg);

  if (img) {
    image(img, 0, 0, width, height);
 
  } else {
    textSize(20);
    textAlign(CENTER);
    text("Drag an image file onto the canvas.", width / 2, height / 2);
  }
}

function gotFile(f) {
  if (f.type === "image") {
    img = loadImage(f.data, redraw);
    
  } else {
    print(`"${f.name}" isn't an image file!`);
  }
}

function highlight(evt) {
  this.background(hover);
  evt.preventDefault();
}
/*
function saveNuage() {
  const file = "images/nuages.jpg";
  const name = new Date() + "-nuage.jpg";
  var metadata = {
    contentType: "image/jpg",
    //predictions: IA_predicts,
  };
  const task = ref.child(name).put(file, metadata);
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      console.log(url);
      //document.querySelector("#image").src = url;
    })
    .catch(console.error);
}
*/
// Change the status when the model loads.
function modelReady() {
  select("#status").html("Model Loaded");
}

// When the image has been loaded,
// get a prediction for that image
function imageReady() {
  classifier.predict(img, 10, gotResult);
  // You can also specify the amount of classes you want
  // classifier.predict(img, 5, gotResult);
}

// A function to run when we get any errors and the results
function gotResult(err, results) {
  if (err) {
    console.error(err);
  }
  IA_predicts = results;
  // Create header for results
  let resultDisplay = createDiv("MobileNet predictions");
  resultDisplay.class("results");
  createSpan("Class -> ");
  createSpan("Probability");

  // Show all results as a list
  results.forEach(function (result) {
    console.log(result.className);
    createDiv(
      `${result.className}, -> ${Math.round(result.probability * 100)}%`
    );
  });
}
