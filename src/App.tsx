import React, { useState } from "react";
import BigNumber from "bignumber.js";

const calculateSpreadForCurve = (
  rate0?: string,
  rate1?: string,
  spread?: string,
  maturity0?: string,
  maturity1?: string
) => {
  const a = rate0 ? new BigNumber(rate0) : undefined;
  const b = rate1 ? new BigNumber(rate1) : undefined;
  const spreadValue = spread ? new BigNumber(spread) : undefined;
  const m0 = maturity0 ? new Date(maturity0) : undefined;
  const m1 = maturity1 ? new Date(maturity1) : undefined;

  if (!m0 || !m1) return {};

  const rate0Later = m0 >= m1;
  const rateLater = rate0Later ? a : b;
  const rateEarlier = rate0Later ? b : a;

  if (!spreadValue && rateLater && rateEarlier) {
    return {
      spread: rateLater.minus(rateEarlier).times(100).toNumber(),
    };
  }

  if (!rateLater && rateEarlier && spreadValue) {
    return {
      [rate0Later ? "rate0" : "rate1"]: rateEarlier
        .plus(spreadValue.dividedBy(100))
        .toNumber(),
    };
  }

  if (!rateEarlier && rateLater && spreadValue) {
    return {
      [rate0Later ? "rate1" : "rate0"]: rateLater
        .minus(spreadValue.dividedBy(100))
        .toNumber(),
    };
  }

  return {
    rate0: a?.toNumber(),
    rate1: b?.toNumber(),
    spread: spreadValue?.toNumber(),
  };
};

const calculateSpreadForFly = (
  rate0?: string,
  rate1?: string,
  rate2?: string,
  spread?: string
) => {
  const a = rate0 ? new BigNumber(rate0) : undefined;
  const b = rate1 ? new BigNumber(rate1) : undefined;
  const c = rate2 ? new BigNumber(rate2) : undefined;
  const d = spread ? new BigNumber(spread) : undefined;

  if (!d && a && b && c) {
    return { spread: b.times(2).minus(a).minus(c).times(100).toNumber() };
  }

  if (!a && b && c && d) {
    return {
      rate0: b.times(2).minus(c).minus(d.dividedBy(100)).toNumber(),
    };
  }

  if (!b && a && c && d) {
    return {
      rate1: a.plus(c).plus(d.dividedBy(100)).dividedBy(2).toNumber(),
    };
  }

  if (!c && a && b && d) {
    return {
      rate2: b.times(2).minus(a).minus(d.dividedBy(100)).toNumber(),
    };
  }

  return {};
};

export default function App() {
  const [rate0, setRate0] = useState("2");
  const [rate1, setRate1] = useState("4");
  const [spread, setSpread] = useState("");
  const [maturity0, setMaturity0] = useState("2027-01-01");
  const [maturity1, setMaturity1] = useState("2026-01-01");

  const [flyRate0, setFlyRate0] = useState("2");
  const [flyRate1, setFlyRate1] = useState("5");
  const [flyRate2, setFlyRate2] = useState("1");
  const [flySpread, setFlySpread] = useState("");

  const curve = calculateSpreadForCurve(
    rate0,
    rate1,
    spread,
    maturity0,
    maturity1
  );
  const fly = calculateSpreadForFly(flyRate0, flyRate1, flyRate2, flySpread);

  return (
    <div style={{ padding: "2rem", display: "grid", gap: "2rem" }}>
      <div>
        <h2>📈 Curve Calculator</h2>
        <p>
          <i>
            spread = (rate with later maturity - rate with earlier maturity) ×
            100
          </i>
        </p>
        <input
          placeholder="rate0"
          value={rate0}
          onChange={(e) => setRate0(e.target.value)}
        />
        <input
          placeholder="rate1"
          value={rate1}
          onChange={(e) => setRate1(e.target.value)}
        />
        <input
          placeholder="spread"
          value={spread}
          onChange={(e) => setSpread(e.target.value)}
        />
        <input
          placeholder="maturity0"
          value={maturity0}
          onChange={(e) => setMaturity0(e.target.value)}
        />
        <input
          placeholder="maturity1"
          value={maturity1}
          onChange={(e) => setMaturity1(e.target.value)}
        />
        <pre>{JSON.stringify(curve, null, 2)}</pre>
      </div>

      <div>
        <h2>🧠 Fly Calculator</h2>
        <p>
          <i>spread = (2 × rate1 - rate0 - rate2) × 100</i>
        </p>
        <input
          placeholder="rate0"
          value={flyRate0}
          onChange={(e) => setFlyRate0(e.target.value)}
        />
        <input
          placeholder="rate1"
          value={flyRate1}
          onChange={(e) => setFlyRate1(e.target.value)}
        />
        <input
          placeholder="rate2"
          value={flyRate2}
          onChange={(e) => setFlyRate2(e.target.value)}
        />
        <input
          placeholder="spread"
          value={flySpread}
          onChange={(e) => setFlySpread(e.target.value)}
        />
        <pre>{JSON.stringify(fly, null, 2)}</pre>
      </div>
    </div>
  );
}
