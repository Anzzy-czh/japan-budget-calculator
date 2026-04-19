(function () {
    var EXCHANGE_RATE = 21;
    var DEFAULT_BUDGET_LIMIT_JPY = 100000;
  
    var btn = document.getElementById("calc-btn");
    var clearBtn = document.getElementById("clear-btn");
    var outRmb = document.getElementById("budget-result");
    var outJpy = document.getElementById("jpy-result");
    var budgetLimitEl = document.getElementById("budget-limit-jpy");
    var fields = ["airfare", "tuition", "rent", "visa-fee"];
  
    function parseMoney(id) {
      var el = document.getElementById(id);
      var v = parseFloat(el.value);
      return isFinite(v) && v >= 0 ? v : 0;
    }

    function getBudgetLimitJpy() {
      var v = parseFloat(budgetLimitEl.value);
      return isFinite(v) && v > 0 ? v : DEFAULT_BUDGET_LIMIT_JPY;
    }
  
    function updateBudget() {
      var sum = parseMoney("airfare") + parseMoney("tuition") + parseMoney("rent") + parseMoney("visa-fee");
      var totalJpy = sum * EXCHANGE_RATE;
      var budgetLimitJpy = getBudgetLimitJpy();
  
      outRmb.textContent =
        "合计：¥" +
        sum.toLocaleString("zh-CN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
  
      if (totalJpy > budgetLimitJpy) {
        outJpy.classList.add("over-budget");
        outJpy.textContent =
          "折合日元：" +
          totalJpy.toLocaleString("ja-JP", { maximumFractionDigits: 0 }) +
          " 日元（预算超支）";
        return;
      }
  
      outJpy.classList.remove("over-budget");
      outJpy.textContent =
        "折合日元：" +
        totalJpy.toLocaleString("ja-JP", { maximumFractionDigits: 0 }) +
        " 日元（预算安全）";
    }
  
    btn.addEventListener("click", updateBudget);

    clearBtn.addEventListener("click", function () {
      fields.forEach(function (id) {
        document.getElementById(id).value = "";
      });
      budgetLimitEl.value = String(DEFAULT_BUDGET_LIMIT_JPY);
      outRmb.textContent = "";
      outJpy.textContent = "";
      outJpy.classList.remove("over-budget");
    });
  
    fields.forEach(function (id) {
      document.getElementById(id).addEventListener("input", updateBudget);
    });

    budgetLimitEl.addEventListener("input", updateBudget);
  
    updateBudget();
  })();