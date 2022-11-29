import { Note } from "@prisma/client";
import { For } from "solid-js";
import { getNotes } from "~/db/note";
import { type routeData } from "~/routes/notes/(notes)";
type Props = {
  note: ReturnType<ReturnType<typeof routeData>["notes"]>[number];
};

export default function NoteThumbnail({ note }: Props) {
  return (
    <div class="border-2 h-60 w-60 m-4 hover:-translate-y-2 focus:-translate-y-2 ease-in-out transition-all duration-100 hover:shadow-lg flex items-center justify-center flex-col container">
      <span class="text-3xl">{note.title}</span>
      <div class="flex flex-wrap justify-evenly">
        <For each={note.tags}>
          {(tag) => <div class="border rounded-md bg-blue-600 text-white mx-1 px-1 my-2">{tag.name}</div>}
        </For>
      </div>
    </div>
  );
}
