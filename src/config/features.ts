// src/config/features.ts
import { IconKey } from "@/components/icons";
import featuresContent from "@content/site/features.json";

export interface FeatureItem {
  title: string;
  description: string;
  icon: IconKey;
}

export interface FeaturesContent {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

type FeatureTemplateItem = {
  titleKey: string;
  descriptionKey: string;
  icon: IconKey;
};

type FeaturesTemplate = {
  titleKey: string;
  subtitleKey: string;
  features: FeatureTemplateItem[];
};

/**
 * 根据翻译函数生成 features 内容
 * @param t - 翻译函数，对应 "Features" 命名空间
 */
export function getFeaturesContent(t: (key: string) => string): FeaturesContent {
  const template = featuresContent as FeaturesTemplate;

  return {
    title: t(template.titleKey),
    subtitle: t(template.subtitleKey),
    features: template.features.map((item) => ({
      title: t(item.titleKey),
      description: t(item.descriptionKey),
      icon: item.icon,
    })),
  };
}