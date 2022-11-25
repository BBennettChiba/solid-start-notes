import { createSignal } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Navbar from "~/components/Navbar";
import NoteForm from "~/components/NoteForm";
import { getNote, getTags } from "~/db/note";

export function routeData({ params }: RouteDataArgs) {
  const tags = createServerData$(() => getTags());
  const note = createServerData$(([, id]) => getNote(id), {
    key: () => ["note", params.id],
  });
  return { note, tags };
}

export default function Id() {
  const { note, tags } = useRouteData<typeof routeData>();
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Navbar />
      Hello {note()?.id}
      <NoteForm tags={tags} note={note} />
    </main>
  );
}
