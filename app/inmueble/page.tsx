import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function InmuebleLegacyRedirect({ searchParams }: PageProps) {
  const { id } = await searchParams;
  if (id) redirect(`/inmueble/${id}`);
  redirect("/inmuebles");
}
