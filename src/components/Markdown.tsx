import MarkdownIt from "markdown-it";

type Props = { note: any };

export default function Markdown({ note }: Props) {
  const mk = new MarkdownIt();
  return (
    <div
      class="text-left w-full h-52 p-2 overflow-auto"
      innerHTML={mk.render(note()?.content || "")}
    ></div>
  );
}
