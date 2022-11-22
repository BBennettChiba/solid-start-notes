import { createSignal } from "solid-js";
// import { createStore } from "solid-js/store";
import { createRouteAction, redirect } from "solid-start";
import MultiSelect from "./MultiSelect";

const options = ["green", "purple", "yellow", "blue", "red", "pink"];

export default function NoteForm({ back }: { back: () => void }) {
  const [form, { Form }] = createRouteAction(async (formData: FormData) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 1000));

    return redirect("/");
  });

  const [value, setValue] = createSignal([]);

  return (
    <div class="w-full items-center justify-center flex">
      <Form class="w-1/2 border">
        <div class="flex flex-row">
          <div class="flex flex-col w-1/2">
            <label for="username">Title:</label>
            <input class="border" type="text" name="Title" />
          </div>
          <MultiSelect
            value={value}
            options={options}
            onChange={(o) => {
              setValue(o);
            }}
          />
        </div>
        <div class="flex flex-row w-full">
          <div class="flex flex-col w-full">
            <label for="body">Body:</label>
            <textarea name="body" class="w-full h-52" id="body"></textarea>
          </div>
        </div>
        <input
          type="submit"
          value="save"
          class="h-8 w-20 bg-cyan-500 rounded-md"
        />
        <button
          type="button"
          onClick={() => {
            back();
          }}
          class="h-8 w-20 rounded-md border text-center"
        >
          cancel
        </button>
      </Form>
    </div>
  );
}
