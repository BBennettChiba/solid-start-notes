import { Tag } from "@prisma/client";
import {
  createSignal,
  createEffect,
  For,
  Resource,
  Accessor,
  Show,
} from "solid-js";

/**@TODO maybe change this to do pure tags instead of array of strings */
type Option = { name: string; id: string };

type Props = {
  value: Accessor<string[]>;
  onChange: (value: string[]) => void;
  options: Resource<Option[]>;
  noInput?: Accessor<boolean>;
};
/**@TODO allow conditional non-input properties e.g. I don't want user interaction so I only want tags shown */
export default function MultiSelect({
  value,
  options,
  onChange,
  noInput: noInput = () => false,
}: Props) {
  const [display, setDisplay] = createSignal(false);
  const [highlightedIndex, setHighlightedIndex] = createSignal(0);
  const [width, setWidth] = createSignal(2);
  const [inputValue, setInputValue] = createSignal("");

  let input: HTMLInputElement;
  let box: HTMLDivElement;

  createEffect(() => display() && setHighlightedIndex(0));

  const clear = (e: MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectOption = (o: string) => {
    if (value().includes(o)) onChange(value().filter((v) => o !== v));
    else onChange([...value(), o]);
  };

  const isSelected = (o: string) => value().includes(o);

  const selected = "bg-blue-700";
  const highlighted = "text-white bg-blue-500";

  /**@TODO add keyboard support */
  /**@TODO when nothing is selected blur doesn't unfocus*/

  return (
    <>
      <Show when={noInput()}>
        <div class="text-left relative w-full min-h-[1.5em] border-gray-700 border-solid border-[1px] rounded-md flex items-center gap-2 p-2 outline-none focus:border-blue-400">
          <span class="flex-grow flex gap-2 flex-wrap h-full">
            <For each={value()}>
              {(v) => (
                <div class="group flex items-center border-solid border-gray-700 border-[0.05em] rounded-md px-[0.25rem] py-[0.015rem] gap-1 bg-none outline-none">
                  {v}
                </div>
              )}
            </For>
          </span>
        </div>
      </Show>
      <Show when={!noInput()}>
        {" "}
        <div
          ref={box}
          onBlur={() => setDisplay(false)}
          tabIndex={0}
          class="text-left relative w-full min-h-[1.5em] border-gray-700 border-solid border-[1px] rounded-md flex items-center gap-2 p-2 outline-none focus:border-blue-400"
          onKeyDown={(e) => {
            const { code } = e;
            if (document.activeElement === input && code === "Enter") {
              selectOption(input.value);
              setInputValue("");
              setWidth(2);
              input.value = "";
              setDisplay(false);
              return e.preventDefault();
            }
            switch (code) {
              case "ArrowDown":
              case "ArrowUp":
                if (!display()) return setDisplay(true);
                setHighlightedIndex((i) => {
                  if (code === "ArrowDown") {
                    return i < options.length - 1 ? i + 1 : options.length - 1;
                  }
                  return i > 0 ? i - 1 : 0;
                });
                break;
              case "Space":
              case "Enter":
                setDisplay(!display());
                break;
              case "ArrowUp":
                break;
            }
          }}
        >
          <span class="flex-grow flex gap-2 flex-wrap h-full">
            <For each={value()}>
              {(v) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                  class="group flex items-center border-solid border-gray-700 border-[0.05em] rounded-md px-[0.25rem] py-[0.015rem] gap-1 cursor-pointer bg-none outline-none hover:bg-red-400 hover:border-red-700"
                >
                  <input type="text" name="tags" class="hidden" value={v} />
                  {v}
                  <span class="group-hover:text-red-700 group-hover:scale-150 group-hover:animate-spin">
                    &times;
                  </span>
                </div>
              )}
            </For>
            <input
              onBlur={(e) => {
                if (e.relatedTarget === box) return;
                setInputValue("");
                input.value = "";
                setDisplay(false);
                setWidth(2);
              }}
              type="text"
              ref={input}
              onInput={(e) => {
                setDisplay(true);
                e.currentTarget.value.length > 1 &&
                  setWidth(e.currentTarget.value.length);
                if (e.currentTarget.value.length == 0) {
                  setWidth(2);
                  setDisplay(false);
                }
                setInputValue(e.currentTarget.value);
              }}
              maxLength={25}
              style={{ width: `${width()}ch` }}
            />
          </span>
          <button
            class="focus:scale-150 bg-none text-gray-700 border-none outline-none cursor-pointer padding-0 text-lg focus:text-black hover:text-gray-800"
            type="button"
            onClick={clear}
          >
            &times;
          </button>
          <div class="bg-gray-700 self-stretch w-[0.05rem]"></div>
          <div class="border-solid border-[.25em] border-transparent border-t-gray-700 translate-y-1/4"></div>
          <div
            tabIndex={-1}
            onClick={() => setDisplay(!display())}
            class="absolute right-0 h-full w-6"
          ></div>
          <ul
            onFocus={(e) => e.preventDefault()}
            class={`absolute m-0 p-0 list-none max-h-60 overflow-y-auto border-solid border-gray-700 border-[.05em] rounded-md left-0 w-full bg-white z-50 ${
              !display() && "hidden"
            } top-[calc(100%_+_0.25em)]`}
          >
            <For
              each={options()
                ?.map((a) => a.name)
                ?.filter((o) => o.includes(inputValue()))}
            >
              {(option, i) => (
                <li
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(option);
                    if (inputValue()) {
                      setDisplay(false);
                      setInputValue("");
                      setWidth(2);
                      input.value = "";
                    }
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  class={`${
                    i() === highlightedIndex() && highlighted
                  } py-1 px-2 cursor-pointer ${isSelected(option) && selected}`}
                >
                  {option}
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </>
  );
}
