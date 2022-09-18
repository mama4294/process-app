import React, { useState, createContext, useEffect } from "react";

export const TitleContext = createContext({
  projectTitle: null,
  setProjectTitle: () => null,
});

const defaultTitle = "Untitled Project";

export const TitleProvider = ({ children }) => {
  const [projectTitle, setProjectTitle] = useState(defaultTitle);

  //Local storage functions

  useEffect(() => {
    const getLocalData = () => {
      const localdata = localStorage.getItem("projectTitle");
      return localdata ? JSON.parse(localdata) : defaultTitle;
    };
    setProjectTitle(getLocalData());
  }, []);

  const saveTitle = (data) => {
    localStorage.setItem("projectTitle", JSON.stringify(data));
  };

  const resetTitle = () => {
    setProjectTitle(defaultTitle);
  };

  return (
    <TitleContext.Provider
      value={{
        projectTitle,
        setProjectTitle,
        saveTitle,
        resetTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
