
  export function isEditableElementSelected(e: any | Event) {
    // Note that "e" must be an event
    if (
      e.target instanceof HTMLElement &&
      (["INPUT", "TEXTAREA"].includes(e.target.nodeName) ||
        e.target.attributes.hasOwnProperty("contenteditable"))
    ) {
      return true;
    }
    return false;
  }
}
