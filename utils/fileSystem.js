import React, { useState } from "react";
import { fileOpen, fileSave } from "https://unpkg.com/browser-fs-access";

export const openFile = async () => {
  try {
    // Always returns an array.
    const [handle] = await window.showOpenFilePicker();
    return handle.getFile();
  } catch (err) {
    console.error(err.name, err.message);
  }
};

const serializeAsJSON = (saveObj) => {
  return JSON.stringify({ ...saveObj, type: "processvis" }, null, 2);
};

export const saveAsJSON = async (saveObj, handle) => {
  // let state = {
  //   loading: true,
  //   error: null,
  // };

  const serialized = serializeAsJSON(saveObj);
  const blob = new Blob([serialized], {
    type: "application/json",
  });
  const name = `${saveObj.projectTitle}.processvis`;
  const newHandle = await fileSave(
    blob,
    {
      fileName: name,
      description: "Process visualizer file",
      extensions: [".processvis"],
    },
    handle || null
  )
    .then((result) => {
      if (result != undefined) window.handle = result;
      return result;
    })
    .catch((error) => {
      return error;
    });
  return newHandle;
};

export const loadFromJSON = async () => {
  console.log("Loading from Json");
  const blob = await fileOpen({
    description: "Process visualizer file",
    extensions: [".processvis"],
    mimeTypes: ["application/json"],
  });
  return loadFromBlob(blob);
};

export const loadFromBlob = async (blob) => {
  //Set handle so future saves will go to this file
  if (blob.handle) {
    console.log("Blob had a handle", blob.handle);
    window.handle = blob.handle;
  }

  let contents;
  if ("text" in Blob) {
    contents = await blob.text();
  } else {
    contents = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsText(blob, "utf8");
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          resolve(reader.result);
        }
      };
    });
  }

  const getObjFromBlob = (contents) => {
    try {
      const data = JSON.parse(contents);
      console.log(data);
      if (data.type !== "processvis") {
        throw new Error("alerts.couldNotLoadInvalidFile");
      }
      return data;
    } catch {
      throw new Error("alerts.couldNotLoadInvalidFile");
    }
  };

  return getObjFromBlob(contents);
};
