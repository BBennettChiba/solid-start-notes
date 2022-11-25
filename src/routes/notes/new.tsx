import { useNavigate, useRouteData } from "@solidjs/router";
import { createServerData$ } from "solid-start/server";
import Navbar from "~/components/Navbar";
import NoteForm from "~/components/NoteForm";
import { getTags } from "~/db/note";

export function routeData() {
  return createServerData$(
    async () => await getTags()
    // .map((t) => t.name)
  );
}

export default function NewNote() {
  const tags = useRouteData<typeof routeData>();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Navbar />
      <h1 class="text-4xl">New Note</h1>
      <NoteForm tags={tags} />
    </main>
  );
}
