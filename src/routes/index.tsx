import { isServer } from "solid-js/web";
import { useRouteData } from "solid-start";
import Navbar from "~/components/Navbar";
import { useUser } from "../db/useUser";

export function routeData() {
  return useUser();
}

export default function Home() {
  const user = useRouteData<typeof routeData>();

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Navbar />
      {/* <h1 class="font-bold text-3xl">Hello {user()?.username}</h1> */}
    </main>
  );
}
