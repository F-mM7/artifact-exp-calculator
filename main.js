const st = {
  DEF: 58.3,
  Energy_Recharge: 51.8,
  CRIT_Rate: 31.1,
  CRIT_DMG: 62.2,
};
const selected_st = ["CRIT_Rate", "CRIT_DMG"];

const cum_exp = [
  0, 3000, 6725, 11150, 16300, 22200, 28875, 36375, 44725, 53950, 64075, 75125,
  87150, 100175, 115325, 132925, 153300, 176800, 203850, 234900, 270475,
];
const list = [];
const mat = { lv1: 420, lv2: 840, lv3: 1260, lv4: 2520, unc: 2500, ess: 10000 };
const factor = [1, 2, 5];

for (let s in st) {
  const d = $("<div>");

  d.append(
    $("<input>", {
      type: "checkbox",
      id: s + "_checkbox",
    }).on("change", reflect_selection)
  );

  d.append(
    $("<label>", {
      text: s,
      for: s + "_checkbox",
    })
  );

  $("#select").append(d);
}

//default selection
$("#CRIT_Rate_checkbox").prop("checked", 1);
$("#CRIT_DMG_checkbox").prop("checked", 1);

reflect_selection();

function reflect_selection() {
  selected_st.splice(0);
  for (let s in st)
    if ($("#" + s + "_checkbox").prop("checked")) selected_st.push(s);

  $("#enhancing").empty();
  $("#headers").empty();

  for (let s of selected_st) {
    $("#enhancing").append(state_indicator(s));
    $("#headers").append($("<th>").text(s));
  }
  clear_list();
}

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
$("#clear").on("click", clear_list);

function clear_list() {
  list.splice(0);
  make_table();
  $("#a").val("");
}

for (let x of factor) $("#x" + x).on("click", give.bind(0, x));

calc();

function calc() {
  let t = performance.now();

  const current_lv = Number($("#lv").val());
  const target_lv = Math.min(20, (6 - required_enhance()) * 4);
  const current_exp = Number($("#exp").val()) + cum_exp[current_lv];
  const target_exp = cum_exp[Math.max(target_lv, current_lv)];

  console.log("required_enhance", performance.now() - t);
  t = performance.now();

  const exp_req = target_exp - current_exp;
  const exp_cap = (cum_exp[20] - current_exp) / 2;
  $("#exp_req").text(exp_req);
  $("#exp_cap").text(exp_cap);

  const exp_give = Math.min(exp_req, exp_cap);
  calc_mat(exp_give);

  console.log("calc_mat", performance.now() - t);

  console.log("calculated");
}

function checked(mat_name) {
  return $("#" + mat_name + "_check").prop("checked");
}

function calc_mat(x) {
  let sum = 280001;
  let arr = {};
  for (let n4 = 15; n4 >= 0; --n4)
    for (let n3 = 15 - n4; n3 >= 0; --n3)
      for (let n2 = 15 - n4 - n3; n2 >= 0; --n2)
        for (let n1 = 15 - n4 - n3 - n2; n1 >= 0; --n1)
          for (let use_ess = 1; use_ess >= 0; --use_ess)
            for (let use_unc = 0; use_unc < 2; ++use_unc) {
              if (n4 && !checked("lv4")) continue;
              if (n3 && !checked("lv3")) continue;
              if (n2 && !checked("lv2")) continue;
              if (n1 && !checked("lv1")) continue;
              if (use_ess && !checked("ess")) continue;
              if (use_unc && !checked("unc")) continue;
              if (n1 + n2 + n3 + n4 + use_ess + use_unc > 15) continue;
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
                t_arr["unc"] = Math.max(Math.ceil((x - t_sum) / mat["unc"]), 0);
                t_sum += t_arr["unc"] * mat["unc"];
                if (use_ess) {
                  t_arr["ess"] = Math.floor(t_arr["unc"] / 4);
                  t_arr["unc"] = t_arr["unc"] % 4;
                }
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

function state_indicator(s) {
  const r = $("<tr>");
  r.append($("<th>").text(s));
  const d = $("<td>");
  const input = $("<input>", {
    id: s,
    type: "number",
    step: 0.1,
    min: 0,
    max: display((st[s] / 8) * 6),
    value: display((st[s] / 8) * 0.9),
  });
  input.on("change", calc);
  const p = $("<button>", { class: "pm", text: "+", tabindex: -1 }).on(
    "click",
    () => {
      input.val(
        Math.min(
          display((st[s] / 8) * 6),
          display(Number(input.val()) + (st[s] / 8) * 0.85)
        )
      );
      calc();
    }
  );
  const m = $("<button>", { class: "pm", text: "-", tabindex: -1 }).on(
    "click",
    () => {
      input.val(Math.max(0, display(Number(input.val()) - (st[s] / 8) * 0.85)));
      calc();
    }
  );
  r.append(d.append(input), p, m);
  return r;
}

function get_val(s) {
  return Number($("#" + s).val());
}

function required_enhance() {
  let ans = 100;
  const arrays = enumerateArrays(selected_st.length, 6);
  for (let a of arrays) {
    let new_val = [];
    for (let i in selected_st)
      new_val[i] = get_val(selected_st[i]) + (st[selected_st[i]] / 8) * a[i];

    let inf = 0;
    for (let data of list) {
      let sup = 0;
      for (let i in selected_st) if (new_val[i] > data.val[i]) sup = 1;
      if (!sup) inf = 1;
    }

    let s = a.reduce((s, x) => s + x, 0);

    if (!inf && s < ans) {
      ans = s;
    }
  }
  return ans;
}

function make_table() {
  //not support changing st.length

  $(".data").remove();

  //TODO sortの実装
  // list.sort((a, b) => {
  //   if (a[0] * 2 + a[1] != b[0] * 2 + b[1])
  //     return b[0] * 2 + b[1] - a[0] * 2 - a[1];
  //   if (a[1] != b[1]) return b[1] - a[1];
  //   return b[2] - a[2];
  // });

  //TODO validity check の実装
  for (let i = 0; i < list.length; ++i) {
    console.log(list[i].val);
    for (let j = i + 1; j < list.length; ++j) {}
  }

  for (let x of list) {
    const tr = $("<tr>").addClass("data");
    for (let i = 0; i < selected_st.length; ++i)
      tr.append($("<td>").text(x.val[i].toFixed(1)));
    if (!x.validity) tr.addClass("invalid");
    $("#table").append(tr);
  }
}

function push() {
  //not support changing st
  let arr = $("#a")
    .val()
    .match(/[0-9]+\.?[0-9]*/g);
  if (arr == null || arr.length % selected_st.length != 0) {
    $("#alert").text("error!");
    return;
  }
  $("#alert").text("");
  arr = arr.map((s) => Number(s));
  for (let i = 0; i < arr.length; i += selected_st.length) {
    data = { val: [], validity: true };
    for (let j = 0; j < selected_st.length; ++j) data.val.push(arr[i + j]);
    list.push(data);
  }

  make_table();

  $("#a").val("");

  calc();
}

function display(x) {
  return (Math.round(x * 10) / 10).toFixed(1);
}

function enumerateArrays(n, m) {
  let result = [];

  // 再帰関数で全ての組み合わせを生成
  function generateArray(currentArray) {
    if (currentArray.length === n) {
      result.push([...currentArray]);
      return;
    }

    for (let i = 0; i < m; i++) {
      currentArray.push(i);
      generateArray(currentArray);
      currentArray.pop();
    }
  }

  generateArray([]);
  return result;
}
