import { notFound } from "next/navigation"
import { OTPVerification } from "@/components/lead-form/otp-verification"
import { isValidClassId } from "@/lib/config/classes"

interface PageProps {
  params: Promise<{
    classId: string
  }>
}

export default async function VerifyPage({ params }: PageProps) {
  const { classId } = await params

  if (!isValidClassId(classId)) {
    notFound()
  }

  return <OTPVerification classId={classId} />
}