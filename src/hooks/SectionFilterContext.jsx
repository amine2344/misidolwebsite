// SectionFilterContext.js
import React, { createContext, useState } from "react";

export const SectionFilterContext = createContext();

export const SectionFilterProvider = ({ children }) => {
  const [sectionFilter, setSectionFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null); // Filtre de catégorie
  const [subCategoryFilter, setSubCategoryFilter] = useState(null); // Filtre de sous-catégorie

  return (
    <SectionFilterContext.Provider
      value={{
        sectionFilter,
        setSectionFilter,
        categoryFilter,
        setCategoryFilter,
        subCategoryFilter,
        setSubCategoryFilter,
      }}
    >
      {children}
    </SectionFilterContext.Provider>
  );
};
