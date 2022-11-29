import { A, useRouteData } from "@solidjs/router";
import { createMemo, createSignal, For } from "solid-js";
import { createServerData$ } from "solid-start/server";
import MultiSelect from "~/components/MultiSelect";
import Navbar from "~/components/Navbar";
import NoteThumbnail from "~/components/NoteThumbnail";
import { getNotes, getTags } from "~/db/note";

export function routeData() {
  const notes = createServerData$(async () => await getNotes());
  const tags = createServerData$(
    async () => await getTags()
  );
  return { notes, tags };
}

/**@TODO add created and updated dates  */

export type Tags = ReturnType<typeof routeData>["tags"];
export type Notes = ReturnType<typeof routeData>["notes"];

export default function Notes() {
  const data = useRouteData<typeof routeData>();
  const { notes, tags } = data;

  const [value, setValue] = createSignal<string[]>([]);
  const [title, setTitle] = createSignal("");

  const filter = () =>
    notes()
      ?.filter((n) =>
        value().every((t) => n.tags.map((ta) => ta.name).includes(t))
      )
      ?.filter((v) => v.title.includes(title()));

  const filteredNotes = createMemo(() => filter());

  const onChange = (v: string[]) => {
    setValue(v);
  };

  const handleInput = (s: string) => setTitle(s);

  return (
    <main class="text-center mx-auto text-gray-700 p-4 container">
      <Navbar />
      <div class="flex flex-row justify-between mt-4">
        <h1 class="text-4xl p-3 pl-0">Notes!!!</h1>
        <A href="/notes/new">
          <button class="text-4xl bg-blue-600 rounded-md p-3 text-white hover:bg-blue-800">
            Create
          </button>
        </A>
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col w-1/2">
          <label for="title-search" class="self-start ml-3">
            Title
          </label>
          <input
            type="text"
            id="title"
            class="h-full border p-2"
            onInput={(e) => handleInput(e.currentTarget.value)}
          />
        </div>
        <div class="w-1/2 flex flex-col">
          <label for="tags" class="self-start ml-3">
            Tags
          </label>
          <MultiSelect
            onChange={onChange}
            value={value}
            singleSelect
            tags={tags}
          />
        </div>
      </div>
      <form class="flex flex-wrap container justify-around">
        <For each={filteredNotes()}>
          {(note) => (
            <A href={`/notes/${note.id}`}>
              <NoteThumbnail note={note} />
            </A>
          )}
        </For>
      </form>
    </main>
  );
}
