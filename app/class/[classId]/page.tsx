import { notFound } from "next/navigation"
import { LeadForm } from "@/components/lead-form/lead-form"
import { isValidClassId } from "@/lib/config/classes"

interface PageProps {
  params: Promise<{
    classId: string
  }>
}

export default async function LeadFormPage({ params }: PageProps) {
  const { classId } = await params

  if (!isValidClassId(classId)) {
    notFound()
  }

  return <LeadForm classId={classId} />
}