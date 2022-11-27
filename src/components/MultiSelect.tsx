import {
  createSignal,
  createEffect,
  For,
  Resource,
  Accessor,
  Show,
} from "solid-js";
import { Note } from "~/routes/notes/(notes)";

type Option = { name: string; id: string };

type Props = {
  value: Accessor<string[]>;
  onChange: (value: string[]) => void;
  options: Resource<Option[]>;
  noInput?: Accessor<boolean>;
  resource?: Resource<Note>;
  singleSelect?: boolean;
};

export default function MultiSelect({
  value,
  options,
  onChange,
  noInput: noInput = () => false,
  resource: resource = null,
  singleSelect: singleSelect = false,
}: Props) {
  const [display, setDisplay] = createSignal(false);
  const [highlightedIndex, setHighlightedIndex] = createSignal(0);
  const [inputValue, setInputValue] = createSignal("");

  let input: HTMLInputElement;
  let box: HTMLDivElement;

  createEffect(() => display() && setHighlightedIndex(0));
  createEffect(
    () =>
      resource &&
      resource().tags &&
      onChange(resource().tags.map((t) => t.name))
  );

  const clear = (e: MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const selectOption = (o: string) => {
    setInputValue("");
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
            <Show when={!resource}>
              <For each={value()}>
                {(v) => (
                  <div class="group flex items-center border-solid border-gray-700 border-[0.05em] rounded-md px-[0.25rem] py-[0.015rem] gap-1 bg-none outline-none">
                    {v}
                  </div>
                )}
              </For>
            </Show>
            <Show when={resource()?.tags}>
              <For each={resource().tags}>
                {(v) => (
                  <div class="group flex items-center border-solid border-gray-700 border-[0.05em] rounded-md px-[0.25rem] py-[0.015rem] gap-1 bg-none outline-none">
                    {v.name}
                  </div>
                )}
              </For>
            </Show>
          </span>
        </div>
      </Show>
      <Show when={!noInput()}>
        <div
          onBlur={() => setDisplay(false)}
          tabIndex={0}
          ref={box}
          class="text-left relative w-full min-h-[1.5em] border-gray-700 border-solid border-[1px] rounded-md flex items-center gap-2 p-2 outline-none focus:border-blue-400"
          onKeyDown={(e) => {
            const { code } = e;
            if (
              document.activeElement === input &&
              code === "Enter" &&
              inputValue() !== ""
            ) {
              selectOption(input.value);
              input.textContent = ". . . ";
              setInputValue("");
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
          onClick={() => singleSelect && setDisplay(true)}
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
            <Show when={singleSelect && value().length === 0}>
              <input type="text" disabled placeholder="Select ..." />
            </Show>
            <Show when={!singleSelect}>
              <input class="hidden" ref={input} />
              <span
                ref={input}
                contentEditable
                class="min-w-[5px]"
                role="textbox"
                onInput={(e) => {
                  setDisplay(true);
                }}
                onFocus={(e) => (e.target.textContent = "")}
                onBlur={(e) => {
                  e.target.textContent = ". . .";
                  if (e.relatedTarget === box) return;
                  setInputValue("");
                  setDisplay(false);
                }}
                onKeyUp={(e) => {
                  setInputValue(e.target.textContent);
                  input.value = e.target.textContent;
                }}
                onkeydown={(e) => {
                  let deleting = e.code === "Backspace" || e.key === "Delete";
                  if (
                    (e.target.textContent.length >= 20 && !deleting) ||
                    e.key === "Enter"
                  ) {
                    e.preventDefault();
                  }
                  if (deleting && e.target.textContent === "") {
                    e.target.textContent = ". . .";
                    e.currentTarget.blur();
                  }
                }}
              >
                . . .
              </span>
            </Show>
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
            onClick={() => {
              setDisplay(!display());
              setInputValue("");
            }}
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
