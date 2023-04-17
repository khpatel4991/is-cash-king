import { useEffect, useState } from "react";

import "./styles.css";

/**
 *
 * @param {udhaar} p Loan amount e.g. $3 Lakh
 * @param {rate} r Annual Rate of interest in %. e.g. 7%
 * @param {years} n Total number of years of loan. e.g. 15 yrs
 */
const eachPayment = (p, r, n) => {
  const rdash = r / (12 * 100.0);
  const ndash = n * 12;
  const numerator = p * rdash * Math.pow(1 + rdash, ndash);
  const denominator = Math.pow(1 + rdash, ndash) - 1;
  return numerator / denominator;
};

const mortgage = (housePrice, down) => {
  return housePrice - housePrice * down * 0.01;
};

const ketlaVarasNiBachat = (price, monthlySavings) => {
  return (price / (monthlySavings * 12)).toFixed(2);
};

const ketlaDown = (price, downPercent) => {
  return price * downPercent * 0.01;
};

export default function App() {
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(7);
  const [housePrice, setHousePrice] = useState(320000);
  const [udhaar, setUdhaar] = useState(() => mortgage(housePrice, rate));
  const [monthlyInterest, setMonthlyInterest] = useState(() =>
    eachPayment(udhaar, rate, years)
  );
  const [downpaymentPercent, setDownpaymentPercent] = useState(20);
  const [downRakam, setDownRakam] = useState(() =>
    ketlaDown(housePrice, downpaymentPercent)
  );
  const [amortizedHousePrice, setAmortizedHousePrice] = useState(
    downRakam + monthlyInterest * 12 * years
  );
  const [rent, setRent] = useState(2500);
  const [savings, setSavings] = useState(4000);
  const [yearsToAccumulate, setYearsToAccumulate] = useState(() =>
    ketlaVarasNiBachat(housePrice, savings)
  );
  const [interestMinusRent, setInterestMinusRent] = useState(0);
  useEffect(() => {
    setUdhaar(mortgage(housePrice, downpaymentPercent));
  }, [housePrice, downpaymentPercent]);

  useEffect(() => {
    setDownRakam(ketlaDown(housePrice, downpaymentPercent));
  }, [housePrice, downpaymentPercent]);

  useEffect(() => {
    setMonthlyInterest(eachPayment(udhaar, rate, years));
  }, [udhaar, rate, years]);

  useEffect(() => {
    setAmortizedHousePrice(downRakam + monthlyInterest * 12 * years);
  }, [monthlyInterest, years, downRakam]);

  useEffect(() => {
    setYearsToAccumulate(ketlaVarasNiBachat(housePrice, savings));
  }, [housePrice, savings]);

  useEffect(() => {
    const interest = amortizedHousePrice - housePrice - downRakam;
    const rentPaid = 12 * yearsToAccumulate * rent;
    setInterestMinusRent(interest - rentPaid);
  }, [amortizedHousePrice, housePrice, yearsToAccumulate, rent, downRakam]);
  return (
    <div className="App">
      <p>
        Disclaimer: HOA, Property Tax and Home Insuranece not yet incorporated.
        Rent includes all utilities and inflation.
      </p>
      <div>
        <h3>Udhaar Ganit Vars</h3>
        <div class="input">
          <label htmlFor="years">Paid off house in {years} years</label>
          <input
            id="years"
            name="years"
            type="range"
            min={5}
            max={30}
            step={1}
            value={years}
            onInput={(e) => setYears(e.currentTarget.valueAsNumber)}
          />
        </div>
        <div class="input">
          <label htmlFor="rate">Interest Rate {rate}%</label>
          <input
            id="rate"
            name="rate"
            type="number"
            min={2}
            max={8}
            step={0.1}
            value={rate}
            onInput={(e) => setRate(e.currentTarget.valueAsNumber)}
          />
        </div>
        <div class="input">
          <label htmlFor="housePrice">House Price ${housePrice}</label>
          <input
            id="housePrice"
            name="housePrice"
            type="number"
            min={100000}
            max={2000000}
            step={100}
            value={housePrice}
            onInput={(e) => setHousePrice(e.currentTarget.valueAsNumber)}
          />
        </div>
        <div class="input">
          <label htmlFor="downpaymentPercent">DownPayment %</label>
          <input
            id="downpaymentPercent"
            name="downpaymentPercent"
            type="number"
            min={1}
            max={100}
            step={1}
            value={downpaymentPercent}
            onInput={(e) =>
              setDownpaymentPercent(e.currentTarget.valueAsNumber)
            }
          />
        </div>

        <h4>Down amount ${downRakam}</h4>
        <h4>UDHAAR ${udhaar}</h4>
        <h4>Monthly Payment ${Math.round(monthlyInterest)}</h4>
        <h4>Amortized ${Math.round(amortizedHousePrice)}</h4>
        <h2 className="rin">
          Extra: ${Math.round(amortizedHousePrice - housePrice)}
        </h2>
      </div>

      <div>
        <h3>Cold Hard Cash Ganit Vars</h3>
        <div class="input">
          <label htmlFor="rent">Rent ${rent}</label>
          <input
            id="rent"
            name="rent"
            type="number"
            min={1000}
            max={3000}
            step={100}
            value={rent}
            onInput={(e) => setRent(e.currentTarget.valueAsNumber)}
          />
        </div>
        <div class="input">
          <label htmlFor="savings">Savings/Month ${savings}</label>
          <input
            id="savings"
            name="savings"
            type="number"
            min={2000}
            max={7000}
            step={100}
            value={savings}
            onInput={(e) => setSavings(e.currentTarget.valueAsNumber)}
          />
        </div>

        <h4>{yearsToAccumulate} years savings required.</h4>

        <h2>
          Total Rent: ${rent} * {yearsToAccumulate} years = $
          {yearsToAccumulate * 12 * rent}
        </h2>
      </div>
      <p>The following number if is neagtive, loan wins, else cash wins.</p>
      <h1 className={interestMinusRent > 0 ? "loan" : "cash"}>
        ${interestMinusRent}
      </h1>
    </div>
  );
}
