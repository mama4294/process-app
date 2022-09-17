import React, { useState, createContext, useEffect } from "react";

export const TitleContext = createContext({
  projectTitle: null,
  setProjectTitle: () => null,
});

export const TitleProvider = ({ children }) => {
  const [projectTitle, setProjectTitle] = useState("Untitled Project");

  //Local storage functions

  // useEffect(() => {
  //   const getLocalData = () => {
  //     const localdata = localStorage.getItem("projectTitle");
  //     return localdata ? JSON.parse(localdata) : "Untitled Project";
  //   };
  //   setProjectTitle(getLocalData());
  // }, []);

  const saveTitle = (data) => {
    localStorage.setItem("projectTitle", JSON.stringify(data));
  };

  return (
    <TitleContext.Provider
      value={{
        projectTitle,
        setProjectTitle,
        saveTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
