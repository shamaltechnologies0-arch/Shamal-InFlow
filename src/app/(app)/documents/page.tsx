import { listDocuments } from "@/lib/data";
import { DocumentsClient } from "@/components/documents/documents-client";

export default async function DocumentsPage() {
  const data = await listDocuments();
  return <DocumentsClient data={data} />;
}
