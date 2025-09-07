import { useEffect, useState, type ChangeEvent } from "react";
import "./App.css";
import Input from "./components/Input";
import DropDown from "./components/DropDown";
import type { detail, DropdownOption, errorType, exchangerates } from "./types/types";
import { getData } from "./apiCall/api";
import Button from "./components/Button";
import CountdownTimer from "./components/CountDown";
import { CgArrowsExchangeV } from "react-icons/cg";



function App() {
  const [countryList, setCountryList] = useState<DropdownOption[]>([]);
  const [exchangerate, setExchangerate] = useState<exchangerates[]>([]);
  const [details, setDetails] = useState<detail>({
    money: "",
    fromCountry: { value: "", label: "", flag: "" },
    toCountry: { value: "", label: "", flag: "" },
  });
  const [errorObj, seterrorObj] = useState<errorType>({
    money: "",
    fromCountry: "",
    toCountry: "",
  });
  const [result, setResult] = useState<string>();
  const [timmer, setTimmer] = useState(1);

  const getCurrencyCountryList = async () => {
    const newArr: DropdownOption[] = [];
    const data = await getData(
      "https://openexchangerates.org/api/currencies.json"
    );
    if (data.data) {
      Object.keys(data.data).forEach((item) => {
        newArr.push({
          value: item,
          label: `${item}/${data.data[item]}`,
          flag: item?.slice(0, 2).toLowerCase(),
        });
      });
      setCountryList(newArr);
    }
  };

  const getCurrencyDetail = async () => {
    const data = await getData(
      "https://api.exchangerate-api.com/v4/latest/GBP"
    );
    
    if (data.data && data.data.rates) {
      setExchangerate(data.data.rates);
    }
  };
  useEffect(() => {
    getCurrencyCountryList();
    getCurrencyDetail();
  }, []);

  const handleOptionSelect = (value: DropdownOption, name: string) => {
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const error: errorType = {
      money: "",
      fromCountry: "",
      toCountry: "",
    };
    if (!details.money) {
        error.money = 'This field is required !'
    }
    const numberRegex = /^-?\d+(\.\d+)?$/;
    if (!numberRegex.test(details.money) && details.money) {
        error.money = `${details.money} is not a valid number`
    }
    if (!details.fromCountry.value) {
        error.fromCountry = 'This field is required !'
    }
    if (!details.toCountry.value) {
        error.toCountry = 'This field is required !'
    }
    seterrorObj(error);
    return Object.keys(error).every(item => error[item] === '')
  };

 
  const handleCalcuation = () => {
    if (validate()) {
      let fromRate = exchangerate[details.fromCountry.value as any];
      let toRate = exchangerate[details.toCountry.value as any];
      if (typeof fromRate === "number" && typeof toRate === "number") {
        const finalvalue = (
          (toRate / fromRate) *
          parseInt(details.money)
        ).toFixed(2);
        setResult(finalvalue);
        setTimmer(prv => prv + 1);
      }
    }
    
  };

  const reset = (flag: boolean) => {
    if (flag) {
      setDetails({
        money: "",
        fromCountry: { value: "", label: "", flag: "" },
        toCountry: { value: "", label: "", flag: "" },
      });
      setResult(undefined);
      seterrorObj({
        money: "",
        fromCountry: "",
        toCountry: "",
      });
    }
  }
  const changeCurrency = () => {
    if (details.fromCountry.value && details.toCountry.value) {
      const fromCountry = details.fromCountry;
      const toCountry = details.toCountry;
      setDetails({
        ...details,
        fromCountry: toCountry,
      toCountry: fromCountry,
    });
    setResult(undefined);
    }
  }

  return (
    <>
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-2xs flex flex-col gap-3 min-w-[500px]">
          <Input
            name="money"
            value={details?.money as string}
            label="Amount"
            onChange={handleChange}
            errorMessage={errorObj.money}
          />
          <DropDown
            name="fromCountry"
            options={countryList}
            selectedValue={details.fromCountry}
            onSelect={handleOptionSelect}
            placeholder="Choose a country"
            errorMessage={errorObj.fromCountry}
          />
          <div className="drop-shadow bg-white rounded-full shadow-md m-auto h-8 w-8 text-center" onClick={changeCurrency}>
            <CgArrowsExchangeV className="text-[32px] text-gray-500"/></div>
          <DropDown
            name="toCountry"
            options={countryList}
            selectedValue={details.toCountry}
            onSelect={handleOptionSelect}
            placeholder="Choose a country"
            errorMessage={errorObj.toCountry}
          />
          {result && <div className="text-blue-600 text-center">{`${details.money} ${details.fromCountry.value} is equivalent to ${result} ${details.toCountry.value}`}</div>}
          {result && <div className="m-auto"><CountdownTimer key={timmer} reset={reset} initialMinutes={1}/></div>}
          <Button onClick={handleCalcuation}>Convert</Button>
        </div>
      </div>
    </>
  );
}

export default App;
