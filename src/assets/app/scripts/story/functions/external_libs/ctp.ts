/**
 * Options for the CTP (Click To Proceed) macro.
 */
interface CtpKeywords {
  /**
   * Clears the content up until this block. Use for replacing content.
   * @default false
   */
  clear?: true;

  /**
   * Enables a custom CSS animation-based transition (400ms fade-in by default).
   * Can also be specified using `t8n`.
   * @default false
   */
  transition?: true;

  /**
   * Enables a custom CSS animation-based transition (400ms fade-in by default).
   * Alias for `transition`.
   * @default false
   */
  t8n?: true;

  /**
   * Specifies the HTML element tag name to wrap the block in.
   * e.g., 'div', 'p'.
   * @default 'span'
   */
  elementTag?: string;

  /**
   * Makes this CTP persistent, i.e., the progress is remembered
   * when you transition out of the passage and restored accordingly
   * when you return to it.
   * @default false
   */
  persist?: true;
}

// The string here will be the id of the CTP block
type CtpAdvance = `<<ctpAdvance "${string}">>`;
type CtpBack = `<<ctpBack "${string}">>`;
type CtpNext = `<<ctpNext ${CtpKeywordString}>>`;
type CtpKeywordString =
  | `${keyof CtpKeywords}`
  | `${keyof CtpKeywords} ${keyof CtpKeywords}`
  | `${keyof CtpKeywords} ${keyof CtpKeywords} ${keyof CtpKeywords}`
  | `${keyof CtpKeywords} ${keyof CtpKeywords} ${keyof CtpKeywords} ${keyof CtpKeywords}`;
type CtpBlock = `<<ctp "${string}" ${CtpKeywordString}>> ${string} <</ctp>>`;
interface CtpParam {
  options?: CtpKeywords;
  content: string;
  /**
   * Defaults to true
   */
  forward?: boolean;
  progress?: (
    progressText: CtpAdvance | CtpBack
  ) => `${string} ${CtpAdvance | CtpBack} ${string}`;
}

/**
 * @param id - The id of the CTP block.
 * @param args - The arguments for the CTP macro.
 * @param args.options - The options for the CTP macro.
 * @param args.content - The content to display.
 * @param args.progress - A function that evaluates to a string which will have `progressText` inserted into it (and then is appended to the `content`). This new string should preferably be interactive (link, button, etc) or delayed (timed, etc) in some way. The `forward` argument is a boolean that indicates whether the CTP is advancing or reverting.
 */
export function ctp(id: string, ...args: CtpParam[]): CtpBlock {
  let concatArgs = "";

  const argsLength = args.length;
  args.forEach((val, index) => {
    const shouldMoveForward = val.forward == undefined ? true : val.forward;
    const ctpKeywordString = convertCtpKeywordsToString(val.options ?? {});
    const contentToAppend = `${val.content} ${
      val.progress
        ? val.progress!(
            shouldMoveForward ? `<<ctpAdvance "${id}">>` : `<<ctpBack "${id}">>`
          )
        : ""
    }`;

    if (index == 0) {
      concatArgs = `<<ctp "${id}" ${ctpKeywordString}>> ${contentToAppend}`;
    } else if (index == argsLength - 1) {
      concatArgs += `<<ctpNext ${ctpKeywordString}>> ${contentToAppend}`;
    } else {
      concatArgs += `<<ctpNext ${ctpKeywordString}>> ${contentToAppend} <</ctp>>`;
    }
  });

  return concatArgs as CtpBlock;
}

export function ctpNoId(...args: CtpParam[]): CtpBlock {
  return ctp(crypto.randomUUID(), ...args);
}

export function ctpNext(args: CtpKeywordString | CtpKeywords): CtpNext {
  const string =
    typeof args == "string" ? args : convertCtpKeywordsToString(args);

  return `<<ctpNext ${string}>>`;
}

function convertCtpKeywordsToString(arg: CtpKeywords): CtpKeywordString {
  return Object.keys(arg)
    .map((val) => {
      const v = val as keyof CtpKeywords;
      if (v == "elementTag") return `element:${arg[v]}`;
      else return v;
    })
    .join(" ") as CtpKeywordString;
}

export function ctpAdvance(id: string): CtpAdvance {
  return `<<ctpAdvance "${id}">>`;
}
export function ctpBack(id: string): CtpBack {
  return `<<ctpBack "${id}">>`;
}
