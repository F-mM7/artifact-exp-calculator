const st_num = 2;
const st_name = ["CRIT_Rate", "CRIT_DMG"];
const cum_exp = [
  0, 3000, 6725, 11150, 16300, 22200, 28875, 36375, 44725, 53950, 64075, 75125,
  87150, 100175, 115325, 132925, 153300, 176800, 203850, 234900, 270475,
];
const data = [];
const mat = { lv1: 420, lv2: 840, lv3: 1260, lv4: 2520, unc: 2500, ess: 10000 };

const st_base={DEF:58.3, Energy_Recharge:51.8,CRIT_Rate:31.1, CRIT_DMG:62.2};


const factor = [1, 2, 5];

for (let i = 0; i < st_num; ++i) $("#enhancing").append(state(i));
for (let x in mat) {
  const r = $("<tr>");
  const c = $("<input>", { type: "checkbox", id: x + "_check" }).on(
    "change",
    calc
  );
  c.prop("checked", true);
  $("<td>").append(c).appendTo(r);
  $("<td>").text(x).appendTo(r);
  $("<td>", { id: x, text: 0 }).appendTo(r);
  $("#mat").append(r);
}

$("#lv").on("change", calc);
$("#exp").on("change", calc);

$("#push").on("click", push);
$("#clear").on("click", () => {
  data.splice(0);
  make_table();
  $("#a").val("");
});

for (let x of factor) $("#x" + x).on("click", give.bind(0, x));

calc();

function calc() {
  const current_lv = Number($("#lv").val());
  const target_lv = Math.min(20, (6 - required_enhance()) * 4);
  const current_exp = Number($("#exp").val()) + cum_exp[current_lv];
  const target_exp = cum_exp[Math.max(target_lv, current_lv)];

  const exp_req = target_exp - current_exp;
  const exp_cap = (cum_exp[20] - current_exp) / 2;
  $("#exp_req").text(exp_req);
  $("#exp_cap").text(exp_cap);

  const exp_give = Math.min(exp_req, exp_cap);
  calc_mat(exp_give);

  console.log("calculated")
}

function checked(mat_name) {
  return $("#" + mat_name + "_check").prop("checked");
}

function calc_mat(x) {
  let sum = 280001;
  let arr = {};
  for (let n4 = 15; n4 >= 0; --n4)
    for (let n3 = 15; n3 >= 0; --n3)
      for (let n2 = 15; n2 >= 0; --n2)
        for (let n1 = 15; n1 >= 0; --n1)
          for (let use_ess = 1; use_ess >= 0; --use_ess)
            for (let use_unc = 0; use_unc < 2; ++use_unc) {
              if (n4 && !checked("lv4")) continue;
              if (n3 && !checked("lv3")) continue;
              if (n2 && !checked("lv2")) continue;
              if (n1 && !checked("lv1")) continue;
              if (use_ess && !checked("ess")) continue;
              if (use_unc && !checked("unc")) continue;
              let c = 0;
              c += n4;
              c += n3;
              c += n2;
              c += n1;
              c += use_ess;
              c += use_unc;
              if (c > 15) continue;
              let t_sum = 0;
              t_sum += n4 * mat["lv4"];
              t_sum += n3 * mat["lv3"];
              t_sum += n2 * mat["lv2"];
              t_sum += n1 * mat["lv1"];
              const t_arr = {
                lv4: n4,
                lv3: n3,
                lv2: n2,
                lv1: n1,
                ess: 0,
                unc: 0,
              };
              if (use_unc) {
                if (use_ess) {
                  t_arr["ess"] = Math.max(
                    Math.floor((x - t_sum) / mat["ess"]),
                    0
                  );
                  t_sum += t_arr["ess"] * mat["ess"];
                }
                t_arr["unc"] = Math.max(Math.ceil((x - t_sum) / mat["unc"]), 0);
                t_sum += t_arr["unc"] * mat["unc"];
              } else if (use_ess) {
                t_arr["ess"] = Math.max(Math.ceil((x - t_sum) / mat["ess"]), 0);
                t_sum += t_arr["ess"] * mat["ess"];
              }
              if (t_sum < x) continue;
              if (t_sum < sum) {
                sum = t_sum;
                arr = t_arr;
              }
            }

  for (let k in arr) $("#" + k).text(arr[k]);
  $("#given").val(sum);
}

function give(x) {
  let lv = Number($("#lv").val());
  let exp = Number($("#exp").val()) + cum_exp[lv];
  exp += $("#given").val() * x;
  while (lv < 20 && cum_exp[lv + 1] <= exp) ++lv;

  $("#lv").val(lv);
  $("#exp").val(exp - cum_exp[lv]);
  calc();
}

function state(i) {
  const r = $("<tr>");
  r.append($("<th>").text(st_name[i]));
  const d = $("<td>");
  const input = $("<input>", {
    id: st_name[i],
    type: "number",
    step:0.1,
    value: (Math.floor(st_base[st_name[i]]/80 * 70) / 10).toFixed(1),
  });
  input.on("change", () => {
    calc();
  });
  const p = $("<button>", { class: "pm", text: "+", tabindex: -1 }).on(
    "click",
    () => {
      input.val(display_new(Number(input.val()) + st_base[st_name[i]] / 8));
      calc();
    }
  );
  const m = $("<button>", { class: "pm", text: "-", tabindex: -1 }).on(
    "click",
    () => {
      input.val(display_new(Number(input.val()) - st_base[st_name[i]] / 8));
      calc();
    }
  );
  r.append(d.append(input), p, m);
  return r;
}

function get_val(i) {
  return Number($("#" + st_name[i]).val());
}

function required_enhance() {
  for (let i = 0; ; ++i) if (judge_n(i)) return i;
}
function judge_n(n) {
  for (let i = 0; i <= n; ++i) if (judge_arr([i, n - i])) return 1;
  return 0;
}
function judge_arr(arr) {
  for (let x of data) {
    let flag = 0;
    for (let i = 0; i < st_num; ++i)
      if (get_val(i) + st_base[st_name[i]]/8 * arr[i] > x[i]) flag = 1;
    if (!flag) return 0;
  }
  return 1;
}

function make_table() {
  //not support changing st_num

  $(".data").remove();

  data.sort((a, b) => {
    if (a[0] * 2 + a[1] != b[0] * 2 + b[1])
      return b[0] * 2 + b[1] - a[0] * 2 - a[1];
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
      .append($("<td>").text(x[1].toFixed(1)));
    if (!x[2]) tr.addClass("invalid");
    $("#table").append(tr);
  }
}

function push() {
  //not support changing st_num
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

  calc();
}

function display(x) {
  return (Math.floor(x *  10) / 10).toFixed(1);
}
