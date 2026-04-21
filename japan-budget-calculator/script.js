(function () {
  var btn = document.getElementById("calc-btn");
  var clearBtn = document.getElementById("clear-btn");
  var outRmb = document.getElementById("budget-result");
  var outJpy = document.getElementById("jpy-result");
  var rateInfo = document.getElementById("rate-info");
  var fields = ["airfare", "visa-fee", "hotel", "transport", "food-shopping"];
  var latestJpyRate = null;

  function parseMoney(id) {
    var el = document.getElementById(id);
    var v = parseFloat(el.value);
    return isFinite(v) && v >= 0 ? v : 0;
  }

  async function fetchJpyRate() {
    var response = await fetch("https://open.er-api.com/v6/latest/CNY", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("汇率接口请求失败");
    }

    var data = await response.json();
    var rate = data && data.rates ? data.rates.JPY : null;

    if (!rate || !isFinite(rate)) {
      throw new Error("未获取到有效的 JPY 汇率");
    }

    latestJpyRate = rate;
    rateInfo.textContent = "当前汇率：1 CNY ≈ " + rate.toFixed(2) + " JPY（实时更新）";
    return rate;
  }

  async function updateBudget() {
    var sum = 0;

    fields.forEach(function (id) {
      sum += parseMoney(id);
    });

    outRmb.textContent =
      "合计：¥" +
      sum.toLocaleString("zh-CN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });

    rateInfo.textContent = "正在更新实时汇率...";

    try {
      var rate = await fetchJpyRate();
      var totalJpy = sum * rate;

      outJpy.textContent =
        "折合日元：" +
        totalJpy.toLocaleString("ja-JP", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }) +
        " 日元";
    } catch (error) {
      outJpy.textContent = "折合日元：暂时无法获取";
      rateInfo.textContent = "当前汇率暂不可用，请稍后重试";
    }
  }

  btn.addEventListener("click", updateBudget);

  clearBtn.addEventListener("click", function () {
    fields.forEach(function (id) {
      document.getElementById(id).value = "";
    });

    outRmb.textContent = "";
    outJpy.textContent = "";

    if (latestJpyRate) {
      rateInfo.textContent = "当前汇率：1 CNY ≈ " + latestJpyRate.toFixed(2) + " JPY（实时更新）";
      return;
    }

    rateInfo.textContent = "";
  });

  fields.forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateBudget);
  });

  updateBudget();
})();
