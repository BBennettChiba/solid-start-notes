import { A } from "@solidjs/router";
import { createServerAction$ } from "solid-start/server";
import { logout } from "~/db/session";

export default function Navbar() {
  const [, { Form }] = createServerAction$((f: FormData, { request }) =>
    logout(request)
  );
  return (
    <nav class="flex flex-row w-full h-5">
      <A href="/" class="text-xl px-4">
        Home
      </A>
      <A href="/notes" class="text-xl px-4">
        Notes
      </A>
      <Form class="absolute right-2 text-xl">
        <button name="logout" type="submit">
          Logout
        </button>
      </Form>
    </nav>
  );
}
