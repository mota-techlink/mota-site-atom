import { Metadata } from "next"
import contactContent from "@/generated/content-config/contact.json"
import { buildContentPageMetadata } from "@/lib/page-metadata"
import { ContactClientPage } from "./contact-client"

type ContactContent = {
  metadata: {
    titleKey: string;
    descriptionKey: string;
  };
};

const typedContact = contactContent as ContactContent;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildContentPageMetadata({
    locale,
    namespace: "ContactPage",
    config: typedContact,
  });
}

export default function ContactPage() {
  return <ContactClientPage />
}
