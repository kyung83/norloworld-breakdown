import { useState, useEffect, useRef } from "react";
import useAxios from "axios-hooks";
import ComboBoxNumber from "./ComboBoxNumber"
import ComboBox from "./ComboBox";
import Spinner from "./Spinner";
import TextAreaSize from "./TextArea";
// import ProgressBar from './ProgressBar'

const endPoint =
  "https://script.google.com/macros/s/AKfycbxQvcen9VHd-lysj7SjmT5Vj5PWqUUMmP2n--SCgOIXc57YKvR7mdR9KioNNqnIetyk/exec";

export default function MainForm() {
  const [selectedDriver, setSelectedDriver] = useState({});
  const [date, setDate] = useState(null);
  const [truckNumber, setTruckNumber] = useState("");
  const [trailerNumber, setTrailerNumber] = useState("");
  const [selectedState, setSelectedState] = useState({});
  const [selectedRepairType, setSelectedRepairType] = useState({})
  const [city, setCity] = useState("");
  const [warning, setWarning] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const textAreaRef = useRef();
  // const [selectedUser, setUser] = useState({});

  const [{ data, loading, error }] = useAxios(endPoint);
  const [
    { data: postData, loading: postLoading, error: postError },
    executePost,
  ] = useAxios(
    {
      url: endPoint + "?route=createIncident",
      method: "POST",
    },
    { manual: true }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !selectedDriver ||
      !selectedState
    ) {
      return setWarning(true);
    }

    console.log(textAreaRef)

    const textAreaValue = textAreaRef.current.value;

    const body = {
      date,
      driverName: selectedDriver.name,
      truckNumber: truckNumber.name,
      trailerNumber: trailerNumber.name,
      stateName: selectedState.name,
      city,
      repairType: selectedRepairType.name,
      user: selectedDriver.name,
      description: textAreaValue,
    };

    console.log(body);
    const response = await executePost({
      data: JSON.stringify(body),
    });
    if (response) {
      setSelectedDriver({});
      setDate(null);
      setTruckNumber("");
      setTrailerNumber("");
      setSelectedState({});
      setCity("");
      setSelectedDriver({});
      setSelectedState({});
      setSuccessMessage(true);
      setWarning(false);
      setSelectedRepairType({})
      setTimeout(() => {
        setSuccessMessage(false);
      }, 4000);
    }
  }

  if (error || postError)
    return <h2 className="text-lg text-center p-4">Error</h2>;
  if (loading || postLoading) return <Spinner />;


  console.log(data)
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>

        <ComboBox
          title="* Driver Name"
          items={data.drivers.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedDriver}
          setSelectedPerson={setSelectedDriver}
        />

        <div className="flex flex-col">
          <ComboBoxNumber
            title="* Truck #"
            items={data.trucks.map((name, i) => ({ id: i, name }))}
            selectedPerson={truckNumber}
            setSelectedPerson={setTruckNumber}
          />
        </div>

        <div className="flex flex-col">
          <ComboBoxNumber
            title="* Trailer #"
            items={data.trailers.map((name, i) => ({ id: i, name }))}
            selectedPerson={trailerNumber}
            setSelectedPerson={setTrailerNumber}
          />
        </div>

        <ComboBox
          title="* State"
          items={data.states.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedState}
          setSelectedPerson={setSelectedState}
        />

        <div className="flex flex-col">
          <label className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700">
            City
          </label>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 rounded border shadow-sm"
          />
        </div>
        <ComboBox
          title="* Repair Type"
          items={data.repairTypes.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedRepairType}
          setSelectedPerson={setSelectedRepairType}
        />

        <TextAreaSize textAreaRef={textAreaRef} />
      </div>

      {warning && (
        <p className="text-sm text-red-600 mt-4 mb-4" id="email-error">
          Complete the required fields *
        </p>
      )}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4 my-4" id="message">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Successfully uploaded
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <ProgressBar progress={percentage} /> */}
      <div className="flex justify-center items-center">
        <button
          type="submit"
          className={`${!warning && "mt-4"} rounded-md bg-emerald-700 px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
