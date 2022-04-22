var styles = `
    .nohover{
      background: transparent !important;
    }
    .nohover:hover{
      background: transparent !important;
    }
    .nohover:active{
      background: transparent !important;
    }

    input[type="date"]{
      border: 1.82px solid #6b91cb;
      border-radius: 4px;
      padding: 5px;
    }

    .noselect {
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none; /* Non-prefixed version, currently
      supported by Chrome, Edge, Opera and Firefox */
    }
`;

document.querySelectorAll("._2ph_._a6-h._a6-i").forEach((item) => (item.classList.add("noselect")));
document
  .querySelectorAll("._a72d")
  .forEach((item) => item.classList.add("noselect"));
document
  .querySelectorAll("._a6-q")
  .forEach((item) => item.classList.add("noselect"));

var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

document.querySelectorAll("._a706")[0].setAttribute("id", "messageDiv");
document.querySelectorAll("._cy6")[0].setAttribute("id", "menuList");

const messageDiv = document.getElementById("messageDiv");
const menuList = document.getElementById("menuList");
let clickCounter = 0;

// Add sort button
let a = document.createElement("a");
let linkText = document.createTextNode("📃");
a.appendChild(linkText);
a.title = "Sort Messages";
a.href = "javascript:void(0);";
a.setAttribute("id", "sortButton");
a.classList.add("_2s25");
a.classList.add("_cy7");
a.onclick = toggleSort;
menuList.appendChild(a);

// Add date filter button
let a2 = document.createElement("a");
let dateText = document.createTextNode("📆");
a2.appendChild(dateText);
a2.title = "Filter by Date";
a2.href = "javascript:void(0);";
a2.setAttribute("id", "dateAttr");
a2.classList.add("_2s25");
a2.classList.add("_cy7");
a2.onclick = toggleDateFilter;
menuList.appendChild(a2);

function showSuccess(el) {
  let originalContent = el.innerHTML;
  document.activeElement.blur();
  el.innerHTML = "☑️";
  setTimeout(function () {
    el.innerHTML = originalContent;
  }, 4000);
}

function toggleSort() {
  let srtBtn = document.getElementById("sortButton");
  let i = messageDiv.childNodes.length;
  while (i--) messageDiv.appendChild(messageDiv.childNodes[i]);
  clickCounter++;
  if (clickCounter % 2 != 0) {
    srtBtn.innerHTML = `📃<span style="font-size: 8px;">▼</span>`;
  } else {
    srtBtn.innerHTML = `📃<span style="font-size: 8px;">▲</span>`;
  }
  showSuccess(srtBtn);
}

function toggleDateFilter() {
  let dateFilter = document.getElementById("dateAttr");
  if (document.querySelectorAll("#dateFilterDiv").length != 0) {
    messageDiv.childNodes.forEach((item) => (item.style.display = "block"));
    document.querySelectorAll("#dateFilterDiv")[0].remove();
  } else {
    let dateFilterDiv = document.createElement("div");
    dateFilterDiv.setAttribute("id", "dateFilterDiv");
    dateFilterDiv.classList.add("_2s25");
    dateFilterDiv.classList.add("nohover");
    dateFilterDiv.innerHTML =
      '<input type="date" id="startDate" class="_2s25 _cy7" value="' +
      new Date().toISOString().split("T")[0] +
      '" />';
    dateFilterDiv.innerHTML +=
      '&nbsp<input type="date" id="endDate" class="_2s25 _cy7" value="' +
      new Date().toISOString().split("T")[0] +
      '" />';
    dateFilterDiv.classList.remove("hover");
    dateFilterDiv.innerHTML +=
      '<a title="Search" href="javascript:void(0);" id="dateFilterButton" class="_2s25 _cy7">▶️</a>';
    dateFilter.parentNode.insertBefore(dateFilterDiv, dateFilter.nextSibling);
    let dateFilterButton = document.getElementById("dateFilterButton");
    dateFilterButton.onclick = filterByDate;
  }
}

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes, seconds] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}:${seconds.substring(0, seconds.length - 2)}`;
};

function filterByDate() {
  messageDiv.childNodes.forEach((item) => (item.style.display = "block"));
  let startDate = new Date(document.getElementById("startDate").value);
  let endDate = new Date(document.getElementById("endDate").value);

  let i = messageDiv.childNodes.length;
  while (i--) {
    if (messageDiv.childNodes[i].querySelectorAll("._a72d").length != 0) {
      endDate.setHours(23, 59, 59, 999);
      startDate.setHours(0, 0, 0, 0);

      let dateStr =
        messageDiv.childNodes[i].querySelectorAll("._a72d")[0].innerHTML;
      let timeStr = convertTime12to24(
        dateStr?.substring(dateStr.lastIndexOf(" ") + 1)
      );
      let msgDate = new Date(
        dateStr?.substring(0, dateStr.lastIndexOf(" ")) + " " + timeStr
      ).getTime();

      if (msgDate >= startDate.getTime() && msgDate <= endDate.getTime()) {
        messageDiv.childNodes[i].style.display = "block";
      } else {
        messageDiv.childNodes[i].style.display = "none";
      }
    }
  }
  showSuccess(dateFilterButton);
}
