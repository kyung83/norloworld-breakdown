import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

const peopleMock = [
  { id: 1, name: "Leslie Alexander" },
  { id: 2, name: "OTHER" },
  // More users...
];

const subCategories = {
  'Leslie Alexander': [
    { id: 11, name: 'Sub-Category 1' },
    { id: 12, name: 'Sub-Category 2' },
    { id: 13, name: 'OTHER' }
  ]
};

export default function ComboBoxCategory({ title }) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showCustomProviderField, setShowCustomProviderField] = useState(false);
  const [customProvider, setCustomProvider] = useState("");

  useEffect(() => {
    if (selectedPerson?.name === 'OTHER') {
      setShowCustomProviderField(true);
    } else {
      setShowCustomProviderField(false);
      setShowSubCategory(true);
    }
  }, [selectedPerson]);

  return (
    <div>
      <SingleComboBox
        items={peopleMock}
        title={title}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
      />
      {showSubCategory && selectedPerson && (
        <SingleComboBox
          items={subCategories[selectedPerson.name] || []}
          title={`Sub-category of ${selectedPerson.name}`}
          selectedPerson={null}
          setSelectedPerson={() => {}}
        />
      )}
      {showCustomProviderField && (
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Custom Provider
          </label>
          <input
            type="text"
            value={customProvider}
            onChange={(e) => setCustomProvider(e.target.value)}
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      )}
    </div>
  );
}

function SingleComboBox({
  items = peopleMock,
  title,
  selectedPerson,
  setSelectedPerson,
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query === "") {
      setSelectedPerson(null);
    }
  }, [query]);

  const filteredPeople = items.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Combobox
      as="div"
      value={selectedPerson}
      onChange={setSelectedPerson}
      className="mb-4"
    >
      {/* ... (contenido no modificado) ... */}
    </Combobox>
  );
}

ComboBoxCategory.propTypes = {
  title: PropTypes.string,
};

SingleComboBox.propTypes = {
  items: PropTypes.array,
  title: PropTypes.string,
  selectedPerson: PropTypes.object,
  setSelectedPerson: PropTypes.func,
};
