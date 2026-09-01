import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the default class for this campaign.
  // TODO: confirm which of c6/c7/c8/c9 should be the landing default.
  redirect("/class/c6");
}
