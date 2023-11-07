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
  const [invalidFields, setInvalidFields] = useState({});
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

    let newInvalidFields = {};

    if (!selectedDriver.name) newInvalidFields['driver'] = true;
    if (!date) newInvalidFields['date'] = true;
    if (!truckNumber) newInvalidFields['truckNumber'] = true; 
    if (!trailerNumber) newInvalidFields['trailerNumber'] = true; 
    if (!selectedState.name) newInvalidFields['state'] = true;
    if (!city) newInvalidFields['city'] = true;
    if (!selectedRepairType.name) newInvalidFields['repairType'] = true;
  
    if (Object.keys(newInvalidFields).length > 0) {
      setInvalidFields(newInvalidFields);
      setWarning(true);
      return;
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
      setInvalidFields({});
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

      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium leading-6 text-gray-900">
          * Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md shadow-sm focus:outline-none ${invalidFields.date ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm`}
            />
        </div>

        <ComboBox
          title="* Driver Name"
          items={data.drivers.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedDriver}
          setSelectedPerson={setSelectedDriver}
          isInvalid={invalidFields.driver}
        />

        <div className="flex flex-col">
          <ComboBoxNumber
            title="* Truck #"
            items={data.trucks.map((name, i) => ({ id: i, name }))}
            selectedPerson={truckNumber}
            setSelectedPerson={setTruckNumber}
            isInvalid={invalidFields.truckNumber}
          />
        </div>

        <div className="flex flex-col">
          <ComboBoxNumber
            title="* Trailer #"
            items={data.trailers.map((name, i) => ({ id: i, name }))}
            selectedPerson={trailerNumber}
            setSelectedPerson={setTrailerNumber}
            isInvalid={invalidFields.trailerNumber}
          />
        </div>

        <ComboBox
          title="* State"
          items={data.states.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedState}
          setSelectedPerson={setSelectedState}
          isInvalid={invalidFields.state}
        />

        <div className="flex flex-col">
        <label className="block text-sm font-medium leading-6 text-gray-900">
          * City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md shadow-sm focus:outline-none ${invalidFields.city ? 'border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} sm:text-sm`}
            />
        </div>
        <ComboBox
          title="* Repair Type"
          items={data.repairTypes.map((name, i) => ({ id: i, name }))}
          selectedPerson={selectedRepairType}
          setSelectedPerson={setSelectedRepairType}
          isInvalid={invalidFields.repairType}
        />

        <TextAreaSize textAreaRef={textAreaRef} />
      </div>

      {warning && (
        <p className="text-sm text-red-600 mt-4 mb-4" id="email-error">
          Complete the required fields *
        </p>
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
