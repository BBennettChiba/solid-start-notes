import { Note } from "@prisma/client";
import { For } from "solid-js";
import { getNotes } from "~/db/note";
import { type routeData } from "~/routes/notes/(notes)";
type Props = { note: ReturnType<ReturnType<typeof routeData>["notes"]>[number] };

export default function NoteThumbnail({ note }: Props) {
  return (
    <div class="border-2 h-60 w-60 m-4">
      <h2>{note.title}</h2>
      <div class="flex flex-wrap items-between">
        <For each={note.tags}>
          {(tag) => <div class="border rounded-md bg-gray-500">{tag.name}</div>}
        </For>
      </div>
    </div>
  );
}
