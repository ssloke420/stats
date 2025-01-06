document.addEventListener("DOMContentLoaded", () => {
  const testSelect = document.getElementById("test-select");
  const containers = document.querySelectorAll(".test-container");

  testSelect.addEventListener("change", () => {
    const selectedTest = testSelect.value;

    // Hide all containers and show only the selected one
    containers.forEach(container => {
      container.classList.remove("active");
      if (container.id === selectedTest) {
        container.classList.add("active");
      }
    });
  });

  // Set the default test to display (optional)
  testSelect.value = "normal";
  testSelect.dispatchEvent(new Event("change"));
});

    function erf(x) {
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
      const p = 0.3275911;
      const t = 1 / (1 + p * x);
      const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
      return sign * y;
    }

    function normalCDF(x, mean, stdDev) {
      return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
    }

    document.getElementById('tailType').addEventListener('change', () => {
      const tailType = document.getElementById('tailType').value;
      if (tailType === 'between') {
        document.getElementById('singleValueInput').style.display = 'none';
        document.getElementById('betweenInputs').style.display = 'block';
      } else {
        document.getElementById('singleValueInput').style.display = 'block';
        document.getElementById('betweenInputs').style.display = 'none';
      }
    });

    document.getElementById('calculateButton').addEventListener('click', () => {
      const mean = parseFloat(document.getElementById('mean').value);
      const stdDev = parseFloat(document.getElementById('stdDev').value);
      const tailType = document.getElementById('tailType').value;
      let result = '';

      if (tailType === 'left') {
        const value = parseFloat(document.getElementById('value').value);
        result = `Left Tail Probability (P(X ≤ ${value})): ${normalCDF(value, mean, stdDev).toFixed(4)}`;
      } else if (tailType === 'right') {
        const value = parseFloat(document.getElementById('value').value);
        result = `Right Tail Probability (P(X > ${value})): ${(1 - normalCDF(value, mean, stdDev)).toFixed(4)}`;
      } else if (tailType === 'between') {
        const lower = parseFloat(document.getElementById('lower').value);
        const upper = parseFloat(document.getElementById('upper').value);
        const betweenProbability = normalCDF(upper, mean, stdDev) - normalCDF(lower, mean, stdDev);
        result = `Between Probability (P(${lower} ≤ X ≤ ${upper})): ${betweenProbability.toFixed(4)}`;
      }

      document.getElementById('result').innerText = result;
    });

    function factorial(n) {
      if (n === 0 || n === 1) return 1;
      return n * factorial(n - 1);
    }

    function binomialCoefficient(n, k) {
      return factorial(n) / (factorial(k) * factorial(n - k));
    }

    function binomialPDF(n, p, k) {
      return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    function binomialCDF(n, p, k) {
      let cumulative = 0;
      for (let i = 0; i <= k; i++) {
        cumulative += binomialPDF(n, p, i);
      }
      return cumulative;
    }

    document.getElementById('calculateBinomial').addEventListener('click', () => {
      const n = parseInt(document.getElementById('trials').value, 10);
      const p = parseFloat(document.getElementById('probability').value);
      const k = parseInt(document.getElementById('kValue').value, 10);
      const binomialType = document.getElementById('binomialType').value;
      let result = '';

      if (binomialType === 'exact') {
        result = `P(X = ${k}): ${binomialPDF(n, p, k).toFixed(4)}`;
      } else if (binomialType === 'lessEqual') {
        result = `P(X ≤ ${k}): ${binomialCDF(n, p, k).toFixed(4)}`;
      } else if (binomialType === 'greaterEqual') {
        result = `P(X ≥ ${k}): ${(1 - binomialCDF(n, p, k - 1)).toFixed(4)}`;
      }

      document.getElementById('binomialResult').innerText = result;
    });

    function geometricPDF(p, k) {
      if (k < 1) return 0; 
      return p * Math.pow(1 - p, k - 1);
    }

    function geometricCDF(p, k) {
      if (k < 1) return 0;
      return 1 - Math.pow(1 - p, k);
    }

    document.getElementById('calculateGeometric').addEventListener('click', () => {
      const p = parseFloat(document.getElementById('geoProbability').value);
      const k = parseInt(document.getElementById('geoXValue').value, 10);
      const geometricType = document.getElementById('geometricType').value;
      let result = '';

      if (geometricType === 'exact') {
        result = `P(X = ${k}): ${geometricPDF(p, k).toFixed(4)}`;
      } else if (geometricType === 'lessEqual') {
        result = `P(X ≤ ${k}): ${geometricCDF(p, k).toFixed(4)}`;
      } else if (geometricType === 'greaterEqual') {
        result = `P(X ≥ ${k}): ${(1 - geometricCDF(p, k - 1)).toFixed(4)}`;
      }

      document.getElementById('geometricResult').innerText = result;
    });
    document.getElementById('calculateZScore').addEventListener('click', () => {
      const x = parseFloat(document.getElementById('zValue').value);
      const mean = parseFloat(document.getElementById('zMean').value);
      const stdDev = parseFloat(document.getElementById('zStdDev').value);

      if (stdDev === 0) {
        document.getElementById('zScoreResult').innerText = "Standard deviation cannot be 0.";
        return;
      }

      const zScore = (x - mean) / stdDev;
      document.getElementById('zScoreResult').innerText = `Z-Score: ${zScore.toFixed(4)}`;
    });
    document.getElementById("calculateZInterval").addEventListener("click", () => {
      const sampleSize = parseFloat(document.getElementById("sampleSize").value);
      const successes = parseFloat(document.getElementById("successes").value);
      const confidenceLevel = parseFloat(document.getElementById("confidenceLevel").value);

      if (!sampleSize || !successes || !confidenceLevel) {
        alert("Please fill in all fields correctly.");
        return;
      }

      const pHat = successes / sampleSize; // Proportion
      const zValue = getZValue(confidenceLevel); // Z-Score for given confidence level
      const marginOfError = zValue * Math.sqrt((pHat * (1 - pHat)) / sampleSize);

      const lowerBound = (pHat - marginOfError).toFixed(4);
      const upperBound = (pHat + marginOfError).toFixed(4);

      document.getElementById("zIntervalResult").textContent = 
        `Confidence Interval: (${lowerBound}, ${upperBound})`;
    });

    // Function to get Z-Score based on confidence level
    function getZValue(confidenceLevel) {
      const area = (1 + confidenceLevel) / 2; // Area under curve
      return calculateZScoreFromArea(area);
    }

    // Function to calculate Z-Score from cumulative area under the curve
    function calculateZScoreFromArea(area) {
      const a1 = -3.969683028665376e+01;
      const a2 = 2.209460984245205e+02;
      const a3 = -2.759285104469687e+02;
      const a4 = 1.383577518672690e+02;
      const a5 = -3.066479806614716e+01;
      const a6 = 2.506628277459239e+00;

      const b1 = -5.447609879822406e+01;
      const b2 = 1.615858368580409e+02;
      const b3 = -1.556989798598866e+02;
      const b4 = 6.680131188771972e+01;
      const b5 = -1.328068155288572e+01;

      const c1 = -7.784894002430293e-03;
      const c2 = -3.223964580411365e-01;
      const c3 = -2.400758277161838e+00;
      const c4 = -2.549732539343734e+00;
      const c5 = 4.374664141464968e+00;
      const c6 = 2.938163982698783e+00;

      const d1 = 7.784695709041462e-03;
      const d2 = 3.224671290700398e-01;
      const d3 = 2.445134137142996e+00;
      const d4 = 3.754408661907416e+00;

      const pLow = 0.02425;
      const pHigh = 1 - pLow;

      if (area < pLow) {
        const q = Math.sqrt(-2 * Math.log(area));
        return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
               ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
      } else if (area <= pHigh) {
        const q = area - 0.5;
        const r = q * q;
        return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q /
               (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
      } else {
        const q = Math.sqrt(-2 * Math.log(1 - area));
        return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
               ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
      }
    }
//Akanksh
