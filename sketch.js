const image = document.getElementById("image"); // The image we want to classify
const dropContainer = document.getElementById("container");
const warning = document.getElementById("warning");
const fileInput = document.getElementById("fileUploader");
const textInput = document.getElementById("textUploader");
const libContainer = document.getElementById("library-container");
let file, resultTxt, prob;

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function windowResized() {
  let windowW = window.innerWidth;
  if (windowW < 480 && windowW >= 200) {
    image.style.maxWidth = windowW - 80;
    dropContainer.style.display = "block";
  } else if (windowW < 200) {
    dropContainer.style.display = "none";
  } else {
    image.style.maxWidth = "90%";
    dropContainer.style.display = "block";
  }
}

["dragenter", "dragover"].forEach((eventName) => {
  dropContainer.addEventListener(
    eventName,
    (e) => dropContainer.classList.add("highlight"),
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  dropContainer.addEventListener(
    eventName,
    (e) => dropContainer.classList.remove("highlight"),
    false
  );
});

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropContainer.addEventListener(eventName, preventDefaults, false);
});

dropContainer.addEventListener("drop", gotImage, false);

function gotImage(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 1) {
    console.error("upload only one file");
  }
  file = files[0];
  const imageType = /image.*/;
  if (file.type.match(imageType)) {
    warning.innerHTML = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      image.src = reader.result;
      setTimeout(classifyImage, 100);
    };
  } else {
    image.src = "images/nuage.jpg";
    setTimeout(classifyImage, 100);
    warning.innerHTML = "Please drop an image file.";
  }
}

function handleFiles() {
  const curFiles = fileInput.files;
  if (curFiles.length === 0) {
    image.src = "images/nuage.jpg";
    setTimeout(classifyImage, 100);
    warning.innerHTML = "No image selected for upload";
  } else {
    image.src = window.URL.createObjectURL(curFiles[0]);
    warning.innerHTML = "";
    setTimeout(classifyImage, 100);
  }
}

function clickUploader() {
  fileInput.click();
}

const result = document.getElementById("result"); // The result tag in the HTML
const probability = document.getElementById("probability"); // The probability tag in the HTML

// Initialize the Image Classifier method
const classifier = ml5.imageClassifier("Mobilenet", () => {});

// Make a prediction with the selected image
// This will return an array with a default of 10 options with their probabilities
classifyImage();

function classifyImage() {
  classifier.predict(image, (err, results) => {
    resultTxt = results[0].className;
    result.innerText = resultTxt;
    prob = 100 * results[0].probability;
    probability.innerText = Number.parseFloat(prob).toFixed(2) + "%";
  });
}

//Connection à la base de données
const firebaseConfig = {
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
const ref = firebase.storage().ref();

function clickSaver() {
  const name = new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type,
    customMetadata: {
      result: resultTxt,
      probability: prob,
      human: textInput.value,
    },
  };
  const task = ref.child(name).put(file, metadata);
  task
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      console.log(url);
      file.src = url;
    })
    .catch(console.error);
}

ref
  .listAll()
  .then((res) => {
    res.items.forEach((itemRef) => {
      var div = document.createElement("div");
      // All the items under listRef.
      itemRef.getDownloadURL().then((url) => {
        var img = document.createElement("img");
        img.src = url;
        div.appendChild(img);
      });
      setTimeout(100);
      itemRef.getMetadata().then((metadata) => {
        var meta_res = metadata.customMetadata.result;
        var meta_pro = metadata.customMetadata.probability;
        var meta_hum = metadata.customMetadata.human;
        var p_res = document.createElement("p");
        var p_pro = document.createElement("p");
        var p_hum = document.createElement("p");
        p_res.innerText =
          "Mobilenet : " +
          meta_res +
          " " +
          Number.parseFloat(meta_pro).toFixed(2) +
          "%";
        p_hum.innerText = "User : " + meta_hum;
        div.appendChild(p_res);
        div.appendChild(p_hum);
      });
      libContainer.appendChild(div);
    });
  })
  .catch((error) => {
    // Uh-oh, an error occurred!
  });
