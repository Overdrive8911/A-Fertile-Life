namespace NSGlobal {
  export function isEditableElementSelected(
    e: JQuery.TriggeredEvent<Document, undefined, Document, Document>
  ) {
    if (
      ["INPUT", "TEXTAREA"].includes(
        e.target.nodeName
      ) /*|| e.target.attributes.hasOwnProperty('contenteditable')*/
    ) {
      return true;
    }
    return false;
  }
}
