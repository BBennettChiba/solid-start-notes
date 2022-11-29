import { createEffect, createSignal, Resource, Show } from "solid-js";
import { createRouteAction, redirect } from "solid-start";
import MultiSelect from "./MultiSelect";
import { createNote, deleteNote, editNote } from "~/db/note";
import server$ from "solid-start/server";
import { useNavigate } from "@solidjs/router";
import Markdown from "./Markdown";
import { Tags } from "../routes/notes/(notes)";
import { NoteResource } from "~/routes/notes/[id]/(id)";

const createNote$ = server$(createNote);
const editNote$ = server$(editNote);
const deleteNote$ = server$(deleteNote);

type Props = {
  tags: Tags;
  note?: NoteResource;
};

export default function NoteForm({ note, tags }: Props) {
  const editMode = !!note;
  const action = editMode ? editNote$ : createNote$;
  const navigate = useNavigate();
  const [noInput, setNoInput] = createSignal(note ? true : false);

  const [_, { Form }] = createRouteAction(async (formData: FormData) => {
    const content = formData.get("content") as string;
    const title = formData.get("title") as string;
    const tags = formData.getAll("tags") as string[];
    const id = editMode ? note()?.id! : "";

    let n = { content, title, tags, id };
    try {
      //@ts-ignore
      await action(n);
      if (!editMode) return redirect("/notes");
      return setNoInput(true);
    } catch (e) {}
    throw new Error("something");
  });

  let titleEl: HTMLInputElement;
  let contentEl: HTMLTextAreaElement;

  const [activeTags, setActiveTags] = createSignal<string[]>([]);
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

  const handleDelete = async () => {
    if (!note) return;
    if (note.loading) return;
    if (!note()) return;
    note &&
      deleteNote$(note()?.id!).then((e) => {
        navigate("..");
      });
  };

  return (
    <div class="w-full items-center justify-center flex">
      <Form class="w-1/2 border" onSubmit={handleSubmit}>
        <div
          class={`flex flex-row ${
            error() && titleEl!?.value.trim() === "" && "animate-shake"
          }`}
        >
          <div class="flex flex-col w-1/2">
            <label for="title">Title:</label>
            <input
              ref={titleEl!}
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
              onChange={(o: string[]) => setActiveTags(o)}
              resource={note}
              tags={tags}
            />
          </div>
        </div>
        <div class="flex flex-row w-full">
          <div
            class={`flex flex-col w-full ${
              error() && contentEl!?.value.trim() === "" && "animate-shake"
            }`}
          >
            <label for="content">Body:</label>
            <Show when={!noInput()}>
              <textarea
                // disabled={noInput()}
                // readonly={noInput()}
                ref={contentEl!}
                name="content"
                class="w-full h-52 p-2"
                id="content"
                value={note ? note()?.content : ""}
              >
                {note && note()?.content}
              </textarea>
            </Show>
            <Show when={noInput()}>
              <Markdown note={note} />
            </Show>
          </div>
        </div>
        <div class="flex justify-end">
          <Show when={editMode}>
            <button
              type="button"
              onClick={() => setNoInput(!noInput())}
              class="h-8 w-20 rounded-md bg-green-500 m-3 text-white"
            >
              {noInput() ? "Edit" : "Cancel"}
            </button>
            <button
              type="button"
              onclick={handleDelete}
              class="h-8 w-20 rounded-md m-3 text-red-600 border-red-600 border-solid border-[1px] hover:bg-red-600 hover:text-white"
            >
              Delete
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
            onClick={() => navigate("..")}
            class="group h-8 w-20 rounded-md border text-center m-3 hover:bg-gray-500"
          >
            <div class="group-hover:scale-110 transition-all">Back</div>
          </button>
        </div>
      </Form>
    </div>
  );
}
