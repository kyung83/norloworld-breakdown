import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

export default function ComboBoxCategory({
  title,
  items,
  onCategoryChange,
  onSubCategoryChange,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showCustomCategoryField, setShowCustomCategoryField] = useState(false);
  const [showCustomSubCategoryField, setShowCustomSubCategoryField] =
    useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");


  useEffect(() => {
    if (selectedCategory?.name === "Add New") {
      setShowCustomCategoryField(true);
    } else {
      setShowCustomCategoryField(false);
    }

    if (selectedCategory) {
      setShowSubCategory(true);
    } else {
      setShowSubCategory(false);
    }

    if (typeof onCategoryChange === 'function') {
      onCategoryChange(selectedCategory);
    }
  }, [selectedCategory, onCategoryChange]); 

  useEffect(() => {
    if (selectedSubCategory?.name === "Add New") {
      setShowCustomSubCategoryField(true);
    } else {
      setShowCustomSubCategoryField(false);
    }

    if (typeof onSubCategoryChange === 'function') {
      onSubCategoryChange(selectedSubCategory);
    }
  }, [selectedSubCategory, onSubCategoryChange]);

  useEffect(() => {
    if (selectedCategory?.name === "Add New" && typeof onCategoryChange === 'function') {
      onCategoryChange({id: 'custom', name: customCategory});
    }
  }, [customCategory, onCategoryChange]);
  
  useEffect(() => {
    if (selectedSubCategory?.name === "Add New" && typeof onSubCategoryChange === 'function') {
      onSubCategoryChange({id: 'custom', name: customSubCategory});
    }
  }, [customSubCategory, onSubCategoryChange]);


  return (
    <div>
      <SingleComboBox
        items={Object.keys(items).map((key, index) => ({
          id: index,
          name: key,
        }))}
        title={title}
        selectedPerson={selectedCategory}
        setSelectedPerson={setSelectedCategory}
      />
      {showCustomCategoryField && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(event) => {
            const newQuery = event.target.value;
            setQuery(newQuery);
          
            if (newQuery === '') {
              setCustomCategory(null); // Aquí reseteas selectedPerson
            }
          }}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 

        />
      )}
      {showSubCategory && selectedCategory && (
        <SingleComboBox
          items={
            selectedCategory.name === "Add New"
              ? [{ id: "other", name: "Add New" }]
              : items[selectedCategory.name].map((sub, index) => ({
                  id: index,
                  name: sub,
                }))
          }
          title={`Sub-category of ${selectedCategory.name}`}
          selectedPerson={selectedSubCategory}
          setSelectedPerson={setSelectedSubCategory}
        />
      )}
      {showCustomSubCategoryField && (
        <input
          type="text"
          placeholder="Enter custom sub-category"
          value={customSubCategory}
          onChange={(e) => setCustomSubCategory(e.target.value)}
          className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          />
      )}
    </div>
  );
}

function SingleComboBox({
  items = [],
  title,
  selectedPerson,
  setSelectedPerson,
}) {
  const [query, setQuery] = useState("");

  const handleInputBlur = () => {
    setQuery(""); // restablece el estado del query
  };

  useEffect(() => {
    if (query === "") {
      setSelectedPerson(null);
    }
  }, [query]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const filteredPeople = [
    ...items.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    ),
  ];

  if (!filteredPeople.some((item) => item.name === "Add New")) {
    filteredPeople.push({ id: "other", name: "Add New" });
  }

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={setSelectedPerson}
      className="mb-4"
    >
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        {title}
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(person) => person?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPeople.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.map((person) => (
              <Combobox.Option
                key={person.id}
                value={person}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {person.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}

ComboBoxCategory.propTypes = {
  title: PropTypes.string,
  items: PropTypes.object.isRequired,
};

SingleComboBox.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  selectedPerson: PropTypes.object,
  setSelectedPerson: PropTypes.func,
  onCategoryChange: PropTypes.func,
  onSubCategoryChange: PropTypes.func,
};
