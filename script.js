let data = JSON.parse(localStorage.getItem("data")) || [];
let barChart, pieChart;

/* ELEMENTS */
let descInput = document.getElementById("desc");
let amountInput = document.getElementById("amount");
let categoryInput = document.getElementById("category");
let dateInput = document.getElementById("date");
let listDiv = document.getElementById("list");
let income = document.getElementById("income");
let expense = document.getElementById("expense");
let balance = document.getElementById("balance");
let search = document.getElementById("search");
let month = document.getElementById("month");

let barChartCtx = document.getElementById("barChart").getContext("2d");
let pieChartCtx = document.getElementById("pieChart").getContext("2d");

/* SAVE */
function save() {
  localStorage.setItem("data", JSON.stringify(data));
}

/* ADD */
function add() {
  let desc = descInput.value;
  let amount = amountInput.value;
  let category = categoryInput.value;
  let date = dateInput.value;

  if (!desc || !amount || !date) return alert("Fill all fields");

  data.push({ desc, amount: +amount, category, date });
  save();
  update();
}

/* DELETE */
function del(index) {
  data.splice(index, 1);
  save();
  update();
}

/* UPDATE UI */
function update(list = data) {
  listDiv.innerHTML = "";

  let inc = 0, exp = 0;
  let cat = {};

  list.forEach((t, i) => {
    if (t.amount > 0) inc += t.amount;
    else exp += t.amount;

    cat[t.category] = (cat[t.category] || 0) + Math.abs(t.amount);

    listDiv.innerHTML += `
      <div class="item">
        ${t.desc} ₹${t.amount}
        <span class="delete" onclick="del(${i})">❌</span>
      </div>
    `;
  });

  income.innerText = inc;
  expense.innerText = Math.abs(exp);
  balance.innerText = inc + exp;

  renderCharts(inc, Math.abs(exp), cat);
}

/* SEARCH */
function searchData() {
  let val = search.value.toLowerCase();
  update(data.filter(t => t.desc.toLowerCase().includes(val)));
}

/* MONTH FILTER */
function filterMonth() {
  let m = month.value;
  if (!m) return;
  update(data.filter(t => t.date.startsWith(m)));
}

/* SHOW ALL */
function showAll() {
  update(data);
}

/* CLEAR */
function clearAll() {
  data = [];
  save();
  update();
}

/* CHARTS */
function renderCharts(inc, exp, cat) {
  if (barChart) barChart.destroy();
  barChart = new Chart(barChartCtx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{ data: [inc, exp], backgroundColor: ["green", "red"] }]
    }
  });

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(pieChartCtx, {
    type: "pie",
    data: {
      labels: Object.keys(cat),
      datasets: [{ data: Object.values(cat) }]
    }
  });
}

/* INIT */
update();