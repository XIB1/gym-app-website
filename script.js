function getDistinctValues(arr, col) {
  const distinct = new Set();
  for (const obj of arr) {
    distinct.add(obj[col]);
  }
  return Array.from(distinct);
};
function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}
function populateEntries() {
  
  var entries = new Object();
  

  var morning = new Date("Jan 1, 2023 05:00");
  var day = new Date("Jan 1, 2023 10:00");
  var evening = new Date("Jan 1, 2023 17:00");
  var night = new Date("Jan 1, 2023 22:00");

  var sessionCont = document.getElementById("session-container");

  // Make a request to the server to retrieve the data from the database
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "get-entries.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // Parse the response from the server as JSON
      entries = JSON.parse(xhr.responseText);

      const dates = getDistinctValues(entries, "date").sort().reverse();

      for (const date in dates) {

        var entry = entries.filter(item => item.date == dates[date]);

        var exeArray = [];
        var exer = new String();
        var time = new String(entry[0].time);
        var totWeight = new Number();

        var cont = document.createElement("div");
        cont.classList.add("sesscont");

        var img = document.createElement("img");
        img.classList.add("daytime-img");

        var pic = new String;
        var timestamp = new Date("Jan 1, 2023 " +  time);

        if (timestamp >= morning && timestamp < day) {pic = "morning.png"};
        if (timestamp >= day && timestamp < evening) {pic = "day.png"};
        if (timestamp >= evening && timestamp < night) {pic = "evening.png"};
        if (timestamp >= night || timestamp < morning) {pic = "night.png"};

        img.src = "img/" + pic;
        
        for (row in entry) {
          
          if (!exeArray.includes(entry[row].exercise)) {
            exeArray.push(entry[row].exercise);
          };
          
          if (time > entry[row].time) {
            time = entry[row].time;
          };
          totWeight = totWeight + entry[row].sets * entry[row].reps * entry[row].weight;
        };

        exer = exeArray.join(", ");
        
        dat = new Date(dates[date]);
        dat = dat.toString();
        dat = parseInt(dat.slice(8, 10)) + " " + dat.slice(4, 7) + " " + dat.slice(11, 15);
        
        var dateBox = document.createElement("div");
        dateBox.classList.add(...["date-box", "sess-info"]);
        dateBox.innerHTML = dat;

        var excBox = document.createElement("div");
        excBox.classList.add(...["exc-box", "sess-info"]);
        excBox.innerHTML = exer;

        var weightBox = document.createElement("div");
        weightBox.classList.add("weight-box");
        weightBox.innerHTML = totWeight + " kg";

        var boxCont = document.createElement("div");
        boxCont.classList.add("box-cont");

        var sessBoxCont = document.createElement("div");
        sessBoxCont.classList.add("sessboxcont");

        sessBoxCont.setAttribute("onclick", "showSession()");

        boxCont.appendChild(dateBox);
        boxCont.appendChild(excBox);

        sessBoxCont.appendChild(img);
        sessBoxCont.appendChild(boxCont);
        sessBoxCont.appendChild(weightBox);

        cont.appendChild(sessBoxCont);

        sessionCont.appendChild(cont);

      };
    };
  };

  xhr.send();
};
function addEntry(field1, field2, field3, field4, field5, field6, field7) {
  
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "add-entry.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

      var button = document.getElementById("circle-button");
      button.dataset.status = "button";
      document.getElementById("form-holder").dataset.status = "hide";

      removeElementsByClass("sesscont");
      populateEntries();
    }
  };
  xhr.send("field1=" + encodeURIComponent(field1) + "&field2=" + encodeURIComponent(field2) +
    "&field3=" + encodeURIComponent(field3) + "&field4=" + encodeURIComponent(field4) +
    "&field5=" + encodeURIComponent(field5) + "&field6=" + encodeURIComponent(field6) + 
    "&field7=" + encodeURIComponent(field7));
};
function showList(event) {
  e = event || window.event;
  e.target.parentNode.children[1].dataset.status = "show";
  setTransparent();
};
function selectItem(event) {
  event.stopPropagation();
  e = event || window.event;
  var target = e.target || e.srcElement;
  text = target.textContent || target.innerText;
  document.getElementById(target.classList[0] + "-input").value = text;
  target.parentNode.dataset.status = "hide";
  setOpaque();
};
function setTransparent() {
  var form = document.getElementById("add-entry-form");
  var inputs = document.getElementsByClassName("entry-form");
  form.classList.add("transparent");
  if (form.classList.contains("opaque")) {
    form.classList.remove("opaque");
  };
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].classList.contains("opaque")) {
      inputs[i].classList.remove("opaque");
    };
    inputs[i].classList.add("transparent");
  }
};
function setOpaque() {
  var form = document.getElementById("add-entry-form");
  var inputs = document.getElementsByClassName("entry-form");
  form.classList.add("opaque");
  if (form.classList.contains("transparent")) {
    form.classList.remove("transparent");
  };
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].classList.contains("transparent")) {
      inputs[i].classList.remove("transparent");
    };
    inputs[i].classList.add("opaque");
  }
};
function addDropdowns() {
  var el = document.getElementsByClassName("dropdown-content numeric");

  for (i = 0; i < el.length; i++) {
    var range = el[i].dataset.range.split(",");
    tag = el[i].classList[2].split("-")[0];

    for (j = 0; j < parseInt(range[1]) / parseFloat(range[2]); j += 1) {
      var opt = document.createElement("a");
      opt.innerHTML = (j + 1) * parseFloat(range[2]);
      opt.classList.add(tag);
      opt.href = "#";
      opt.setAttribute("onclick", "selectItem(event)");
      el[i].appendChild(opt);
    };
  };



  var xhr = new XMLHttpRequest();
  xhr.open("GET", "get-exercise.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      var result = JSON.parse(xhr.responseText);

      var el = document.getElementsByClassName("dropdown-content exc-input");
      
      tag = el[0].classList[1].split("-")[0];

      for (j = 0; j < result.length; j++) {
        var opt = document.createElement("a");
        opt.innerHTML = result[j].exercise;
        opt.classList.add(tag);
        opt.href = "#";
        opt.setAttribute("onclick", "selectItem(event)");
        el[0].appendChild(opt);
      };
      

    };
  };
  xhr.send();

};
function showSession() {
  document.getElementById("selected-session").dataset.status = "show";
};


window.onload = function() {

  populateEntries();

  addDropdowns();

  var td = new Date();
  var h = td.getHours();
  var min = ('0' + td.getMinutes()).slice(-2);

  var effDict = {
    "Easy": "E",
    "Medium": "M",
    "Hard": "H"
  };

  document.getElementById("dat-input").valueAsDate = td;
  document.getElementById("tim-input").value = h + ":" + min;


  document.getElementById("add-entry-form").addEventListener("submit", function(event) {
    event.stopPropagation();
    event.preventDefault();
    var date = document.getElementById("dat-input").value;
    var time = document.getElementById("tim-input").value;
    var exce = document.getElementById("exc-input").value;
    var weig = document.getElementById("wei-input").value;
    var sets = document.getElementById("set-input").value;
    var reps = document.getElementById("rep-input").value;
    var effo = document.getElementById("eff-input").value;

    effo = effDict[effo]

    addEntry(date, time, exce, weig, sets, reps, effo);

    var button = document.getElementById("circle-button");
    button.dataset.status = "button";

  });


  document.getElementById("circle-button").addEventListener("click", function() {
    var button = document.getElementById("circle-button");

    if (button.dataset.status == "button") {
      button.dataset.status = "hidden";
      document.getElementById("form-holder").dataset.status = "show";
    };
  });

  document.getElementById("cancel-button").addEventListener("click", function(event) {
    event.stopPropagation();
    var button = document.getElementById("circle-button");
    button.dataset.status = "button";
    document.getElementById("form-holder").dataset.status = "hide";
  });

  window.onclick = function(event) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var open = false;
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.dataset.status == "show" && !openDropdown.classList.contains(event.target.id)) {
        openDropdown.dataset.status = "hide";
      };
      if (openDropdown.dataset.status == "show") {
        open = true;
      };
    };
    if (open == false) {
      setOpaque();
    };
    
  };

};