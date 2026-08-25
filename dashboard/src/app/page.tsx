import { redirect } from "next/navigation";

/** Root route has no content of its own — send visitors to the first section. */
export default function Home() {
  redirect("/youtube");
}
