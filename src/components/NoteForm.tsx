import { createEffect, createSignal, Resource, Show } from "solid-js";
import { createRouteAction, redirect } from "solid-start";
import MultiSelect from "./MultiSelect";
import { createNote, editNote } from "~/db/note";
import server$ from "solid-start/server";
import { Note } from "~/routes/notes/(notes)";
import { useNavigate } from "@solidjs/router";

const createNote$ = server$(createNote);
const editNote$ = server$(editNote);

/**@TODO make these props depend on other props */
type Props =
  | {
      tags: Resource<{ name: string; id: string }[]>;
      note?: never;
    }
  | {
      tags: Resource<{ name: string; id: string }[]>;
      note: Resource<Note>;
    };

export default function NoteForm({ tags, note }: Props) {
  const editMode = !!note;
  const action = editMode ? editNote$ : createNote$;
  const navigate = useNavigate();
  const [noInput, setNoInput] = createSignal(note ? true : false);

  const [_, { Form }] = createRouteAction(async (formData: FormData) => {
    const content = formData.get("content") as string;
    const title = formData.get("title") as string;
    const tags = formData.getAll("tags") as string[];
    const id = editMode ? note().id : "";
    let n = { content, title, tags, id };
    try {
      await action(n);
      if (!editMode) return redirect("/notes");
      return setNoInput(true);
    } catch (e) {}
    throw new Error("something");
  });

  let titleEl: HTMLInputElement;
  let contentEl: HTMLTextAreaElement;

  const [activeTags, setActiveTags] = createSignal([]);
  const [error, setError] = createSignal(false);

  const handleSubmit = (e: SubmitEvent) => {
    if (
      titleEl.value.trim() === "" ||
      activeTags().length === 0 ||
      contentEl.value.trim() === ""
    ) {
      setError(true);
      setTimeout(() => setError(false), 400);
      e.preventDefault();
    }
  };

  return (
    <div class="w-full items-center justify-center flex">
      <Form class="w-1/2 border" onSubmit={handleSubmit}>
        <div
          class={`flex flex-row ${
            error() && titleEl?.value.trim() === "" && "animate-shake"
          }`}
        >
          <div class="flex flex-col w-1/2">
            <label for="title">Title:</label>
            <input
              ref={titleEl}
              class="h-full border p-2"
              type="text"
              name="title"
              readonly={noInput()}
              value={note ? note()?.title : ""}
              disabled={noInput()}
            />
          </div>
          <div
            class={`flex flex-col w-1/2 relative ${
              error() && activeTags().length === 0 && "animate-shake"
            }`}
          >
            <label for="tags">Tags:</label>
            <MultiSelect
              noInput={noInput}
              value={activeTags}
              options={tags}
              onChange={(o) => setActiveTags(o)}
              resource={note}
            />
          </div>
        </div>
        <div class="flex flex-row w-full">
          <div
            class={`flex flex-col w-full ${
              error() && contentEl?.value.trim() === "" && "animate-shake"
            }`}
          >
            <label for="content">Body:</label>
            <textarea
              disabled={noInput()}
              readonly={noInput()}
              ref={contentEl}
              name="content"
              class="w-full h-52"
              id="content"
              value={note ? note()?.content : ""}
            >
              {note && note()?.content}
            </textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <Show when={editMode}>
            <button
              type="button"
              onClick={() => setNoInput(false)}
              class="h-8 w-20 rounded-md bg-green-500 m-3 text-white"
            >
              Edit
            </button>
          </Show>
          <input
            type="submit"
            class={`h-8 w-20 rounded-md m-3 text-white ${
              noInput()
                ? "bg-gray-500 hover:bg-gray-800"
                : "bg-blue-500  hover:bg-blue-800"
            } `}
            disabled={noInput()}
          />
          <button
            type="button"
            onClick={() => {
              if (editMode && noInput()) return navigate("..");
              if (!editMode && !noInput()) return navigate("..");
              setNoInput(true);
            }}
            class="group h-8 w-20 rounded-md border text-center m-3 hover:bg-gray-500"
          >
            <div class="group-hover:scale-110 transition-all">
              {noInput() ? "Back" : "Cancel"}
            </div>
          </button>
        </div>
      </Form>
    </div>
  );
}
