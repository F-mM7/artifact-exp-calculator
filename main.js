const st_num = 2;
const st_name = ["Rate", "DMG"];
const unit = [0.39, 0.78];
const cum_exp = [0,
  3000,
  6725,
  11150,
  16300,
  22200,
  28875,
  36375,
  44725,
  53950,
  64075,
  75125,
  87150,
  100175,
  115325,
  132925,
  153300,
  176800,
  203850,
  234900,
  270475
]
const data = [];
const mat = { lv1: 420, lv2: 840, lv3: 1260, lv4: 2520, unc: 2500, ess: 10000 }

const factor = [1, 2, 5]

for (let i = 0; i < st_num; ++i)  $("#enhancing").append(state(i));
for (let x in mat) {
  const r = $("<tr>")
  const c = $("<input>", { "type": "checkbox", "id": x + "_check" }).on("change", calc)
  if (mat[x] > 1e3) c.prop("checked", true);
  $("<td>").append(c).appendTo(r);
  $("<td>").text(x).appendTo(r);
  $("<td>", { "id": x, "text": 0 }).appendTo(r)
  $("#mat").append(r)
}


$("#lv").on("change", calc)
$("#exp").on("change", calc)

$("#push").on("click", push);
$("#clear").on("click", () => {
  data.splice(0);
  make_table();
  $("#a").val("");
})

for (let x of factor) $("#x" + x).on("click", give.bind(0, x))


calc();

function calc() {
  const current_lv = Number($("#lv").val());
  const target_lv = Math.min(20, (6 - required_enhance()) * 4)
  const current_exp = Number($("#exp").val()) + cum_exp[current_lv];
  const target_exp = cum_exp[Math.max(target_lv, current_lv)];


  const exp_req = target_exp - current_exp
  const exp_cap = (cum_exp[20] - current_exp) / 2
  $("#exp_req").text(exp_req)
  $("#exp_cap").text(exp_cap)

  const exp_give = Math.min(exp_req, exp_cap)
  calc_mat(exp_give)
}

function calc_mat(x) {
  const arr = [];
  let sum = 0;
  for (let k in mat)
    if ($('#' + k + "_check").prop("checked")) arr.push(k);
    else $('#' + k).text(0)
  arr.sort((a, b) => mat[b] - mat[a])
  for (let k of arr) {
    const t = Math.floor(x / mat[k])
    $('#' + k).text(t)
    x -= t * mat[k]
    sum += t * mat[k];
  }

  if (x > 0) {
    const k = arr[arr.length - 1]
    $('#' + k).text(Number($('#' + k).text()) + 1)
    sum += mat[k];
  }

  $("#given").val(sum);
}

function give(x) {
  let lv = Number($("#lv").val());
  let exp = Number($("#exp").val()) + cum_exp[lv];
  exp += $("#given").val() * x
  while (lv < 20 && cum_exp[lv + 1] <= exp) ++lv;

  $("#lv").val(lv)
  $("#exp").val(exp - cum_exp[lv])
  calc()
}

function state(i) {
  const r = $("<tr>");
  r.append($("<th>").text(st_name[i]));
  const d = $("<td>")
  const input = $("<input>", { id: st_name[i], value: (Math.floor(unit[i] * 70) / 10).toFixed(1) });
  input.on(
    "change",
    () => {
      input.val(display(internal(input.val(), unit[i]), unit[i]))
      calc()
    }
  );
  const p = $("<button>", { class: "pm", text: "+", "tabindex": -1 }).on("click", () => {
    let n = internal(input.val(), unit[i]) + 1;
    if (0 < n && n < 7) n = 7;
    if (10 < n && n < 14) n = 14;
    if (60 < n) n = 60;
    input.val(display(n, unit[i]));
    calc();
  });
  const m = $("<button>", { class: "pm", text: "-", "tabindex": -1 }).on("click", () => {
    let n = internal(input.val(), unit[i]) - 1;
    if (n < 0) n = 0;
    if (0 < n && n < 7) n = 0;
    if (10 < n && n < 14) n = 10;
    input.val(display(n, unit[i]));
    calc();
  });
  r.append(d.append(input), p, m);
  return r;
}

function get_val(i) { return Number($('#' + st_name[i]).val()) }

function required_enhance() { for (let i = 0; ; ++i)if (judge_n(i)) return i; }
function judge_n(n) {
  for (let i = 0; i <= n; ++i)if (judge_arr([i, n - i])) return 1;
  return 0;
}
function judge_arr(arr) {
  for (let x of data) {
    let flag = 0;
    for (let i = 0; i < st_num; ++i)
      if (get_val(i) + unit[i] * 10 * arr[i] > x[i]) flag = 1;
    if (!flag) return 0;
  }
  return 1;
}

function make_table() {//not support changing st_num

  $(".data").remove();

  data.sort((a, b) => {
    if (a[0] * 2 + a[1] != b[0] * 2 + b[1]) return b[0] * 2 + b[1] - a[0] * 2 - a[1];
    if (a[1] != b[1]) return b[1] - a[1];
    return b[2] - a[2];
  });

  const N = data.length;
  for (let i = 0; i < N; ++i)
    for (let j = i + 1; j < N; ++j)
      if (data[i][0] >= data[j][0] && data[i][1] >= data[j][1]) data[j][2] = 0;

  for (let x of data) {
    const tr = $("<tr>")
      .addClass("data")
      .append($("<td>").text(x[0].toFixed(1)))
      .append($("<td>").text(x[1].toFixed(1)))
    if (!x[2]) tr.addClass("invalid")
    $("#table").append(tr)
  }
}

function push() {//not support changing st_num
  let arr = $("#a")
    .val()
    .match(/[0-9]+\.?[0-9]*/g);
  if (arr == null || arr.length % st_num != 0) {
    $("#alert").text("error!");
    return;
  }
  $("#alert").text("");
  arr = arr.map((s) => Number(s));
  for (let i = 0; i < arr.length; i += st_num)
    data.push([arr[i], arr[i + 1], 1]);

  make_table();

  $("#a").val("");

  calc()
}



function internal(x, unit) {
  return Math.ceil(x / unit);
}
function display(x, unit) {
  return (Math.floor(x * unit * 10) / 10).toFixed(1);
}
