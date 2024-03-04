import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { CountryService } from "@store/api/countriesApi";

export function AutoCompleteContries() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);

  const panelFooterTemplate = () => {
    const isCountrySelected = (filteredCountries || []).some(
      (country) => country["name"] === selectedCountry
    );
    return (
      <div className="py-2 px-3">
        {isCountrySelected ? (
          <span>
            <b>{selectedCountry}</b> selected.
          </span>
        ) : (
          "No country selected."
        )}
      </div>
    );
  };

  const search = (event) => {
    // Timeout to emulate a network connection
    setTimeout(() => {
      let _filteredCountries;

      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) => {
          return country.name
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredCountries(_filteredCountries);
    }, 250);
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={item.name}
          src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
          className={`flag flag-${item.code.toLowerCase()} mr-2`}
          style={{ width: "18px" }}
        />
        <div>{item.name}</div>
      </div>
    );
  };

  useEffect(() => {
    CountryService.getCountries().then((data) => setCountries(data));
  }, []);

  return (
    <div className="card flex justify-content-center">
      <AutoComplete
        field="name"
        value={selectedCountry}
        suggestions={filteredCountries}
        completeMethod={search}
        onChange={(e) => setSelectedCountry(e.value)}
        itemTemplate={itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
      />
    </div>
  );
}
