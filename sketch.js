var database;
var submitButton;

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
const classifier = ml5.imageClassifier("MobileNet", modelReady);

// A variable to hold the image we want to classify
let img;

function setup() {
  noCanvas();
  // Load the image
  img = createImg("images/nuage.jpg", imageReady);
  img.size(200, 200);
  submitButton = createButton("submit");
  submitButton.mousePressed(submitNuage);
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
  console.log(firebase);

  database = firebase.database();
}

function submitNuage() {
  var data = {
    nuage: img,
    //results: 45,
  };
  console.log(data);
  var ref = database.ref("nuages");
  ref.push(data);
}

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
