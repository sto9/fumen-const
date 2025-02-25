let extended = false;
let all_diffs_by_title = {}; // タイトルをキーにして、各難易度の定数を持つ
let all_diffs_by_title_lowercase = {};

const errata = {
  "Solsånd": "Solstånd",
};

const DIFFS = ["BAS", "ADV", "EXP", "MAS", "ULT"];

// 表記揺れを直すための処理
function normalize(s) {
  s = s.replace(/[\s　]/g, "");
  s = s.replace(/[!！]/g, "");
  s = s.replaceAll("’", "\'");
  s = s.replaceAll("”", "\"");
  s = s.replaceAll("♥", "♡");
  return s;
}

async function loadMusics() {
  const URL = "https://api.chunirec.net/2.0/music/showall.json?region=jp2&token=0cc61074c6f6ccf038b3c62be917be3ef317458be49bd3cd68c78a80b4d024b144db12e7f941a8c043f3ac8b4b0c610740e8960baf53f5469de414d6588fa6b5";
  const res = await fetch(URL);
  let musics_json = await res.json();

  for (let data of musics_json) {
    if (data["meta"]["title"] === "FLOWER") console.log(data);
    if (Object.keys(data["data"]).includes("WE"))
      continue;
    let exist_diffs = DIFFS.filter(diff => Object.keys(data["data"]).includes(diff));
    let diff_json = Object.fromEntries(exist_diffs.map(diff => [diff, Number(data["data"][diff]["const"]).toFixed(1)]));
    if (data["meta"]["title"] === "FLOWER") console.log(diff_json);
    all_diffs_by_title[normalize(String(data["meta"]["title"]))] = diff_json;
    all_diffs_by_title_lowercase[normalize(String(data["meta"]["title"]).toLowerCase())] = diff_json;
  }
}

function updateRow(sort_element) {
  let td1_diff = sort_element.parentNode;
  const src = td1_diff.querySelector("img").src;
  let diff = "";
  if (src.includes("bsc")) diff = "BAS";
  if (src.includes("adv")) diff = "ADV";
  if (src.includes("exp")) diff = "EXP";
  if (src.includes("mst")) diff = "MAS";
  if (src.includes("ult")) diff = "ULT";
  if (diff === "") {
    return;
  }

  let td1_title = td1_diff.nextElementSibling;
  let title_text_plain = td1_title.innerText;
  let title_norm = normalize(title_text_plain);

  let title_cands = [title_norm];
  if (errata[title_norm] !== undefined) {
    title_cands.push(errata[title_norm]);
  }

  let const_text = "";
  for (let title_cand of title_cands) {
    // chunirec の楽曲データから定数を取得
    if (all_diffs_by_title[title_cand] === undefined) {
      continue;
    }
    let constant = all_diffs_by_title[title_cand][diff];
    if (constant === undefined || constant === "0.0") {
      continue;
    }
    const_text = constant.match(/\.\d+/)?.[0] || "";
    break;
  }
  if (const_text === "") {
    // 小文字に変換して再検索
    for (let title_cand of [title_norm.toLowerCase()]) {
      // chunirec の楽曲データから定数を取得
      if (all_diffs_by_title_lowercase[title_cand] === undefined) {
        continue;
      }
      let constant = all_diffs_by_title_lowercase[title_cand][diff];
      if (constant === undefined || constant === "0.0") {
        continue;
      }
      const_text = constant.match(/\.\d+/)?.[0] || "";
      break;
    }
  }
  if (const_text === "") {
    console.log("Not Found: ", title_text_plain);
    console.log("Normalized: ", title_norm);
    const_text = ".?　";
    console.log(diff);
  }

  // 表示
  let div = document.createElement("div");
  div.innerText = const_text + "　";
  div.classList.add("f2");
  if (const_text === ".?　")
    div.style.color = "gray";

  let td1_constant = document.createElement("td");
  td1_constant.appendChild(div);
  td1_diff.after(td1_constant);
}

async function addFumenConst() {
  if (extended) return;
  extended = true;
  await loadMusics();

  // 許容を表示する拡張機能を使用している場合、それのヘッダー部分を拡張
  let tolerance_header = document.getElementById("tolerance-header");
  if (tolerance_header !== null) {
    tolerance_header.firstChild.before(document.createElement("td"));
  }

  const script_elements = document.documentElement.getElementsByTagName('script');
  const regex_SORT = new RegExp('^SORT[0-9]');
  for (let script_element of script_elements) {
    if (regex_SORT.test(script_element.innerText)) {
      updateRow(script_element);
    }
  }
}

function rewriteButton() {
  let span = document.getElementById("reload_btn").querySelector("span");
  span.setAttribute("onclick", "javascript:addFumenConst()");
  span.innerText = "＜譜面定数を表示＞";
}