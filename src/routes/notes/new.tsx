import { useNavigate } from "@solidjs/router";
import { createRouteAction, redirect } from "solid-start";
import Navbar from "~/components/Navbar";
import NoteForm from "~/components/NoteForm";

export default function NewNote() {
  const navigate = useNavigate()
  function back() {
    navigate("..")
  }


  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Navbar />
      New Note
      <NoteForm back={back} />
    </main>
  );
}
