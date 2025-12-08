import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the default class (C12) or a landing page
  // For now, let's redirect to C12 as it's the most prominent one
  redirect("/class/c12");
}
