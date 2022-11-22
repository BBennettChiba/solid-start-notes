import { A } from "@solidjs/router";
import Navbar from "~/components/Navbar";

export default function Notes() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Navbar />
      Hello Notes
      <A href="/notes/new">New Note</A>
    </main>
  );
}
