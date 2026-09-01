import { notFound } from "next/navigation"
import { SuccessScreen } from "@/components/lead-form/success-screen"
import { isValidClassId } from "@/lib/config/classes"

interface PageProps {
  params: Promise<{
    classId: string
  }>
  searchParams: Promise<{
    group?: string
  }>
}

export default async function SuccessPage({ params, searchParams }: PageProps) {
  const { classId } = await params
  const { group } = await searchParams

  if (!isValidClassId(classId)) {
    notFound()
  }

  return <SuccessScreen classId={classId} group={group} />
}
