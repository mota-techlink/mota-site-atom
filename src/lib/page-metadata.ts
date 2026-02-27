import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export type ContentPageMetaConfig = {
  metadata: {
    titleKey: string;
    descriptionKey: string;
  };
};

export async function buildContentPageMetadata({
  locale,
  namespace,
  config,
}: {
  locale: string;
  namespace: string;
  config: ContentPageMetaConfig;
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  return {
    title: t(config.metadata.titleKey),
    description: t(config.metadata.descriptionKey),
  };
}
