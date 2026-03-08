import type { Metadata } from "next";
import { getEpisodes } from "@/lib/youtube";
import AssistirClient from "@/components/AssistirClient";

export const metadata: Metadata = {
  title: "Assistir",
  description: "Assista todos os episódios do MetôCast diretamente nesta página.",
};

export const revalidate = 600;

export default async function AssistirPage() {
  const episodes = await getEpisodes();

  return <AssistirClient episodes={episodes} />;
}
