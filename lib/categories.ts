export type CategoryId = "business" | "law" | "risk" | "other";

type CategoryStyle = {
  label: string;
  /** Label text color (meets 4.5:1 on the dark grounds). */
  text: string;
  /** Accent rule under artwork. */
  rule: string;
  /** Title color on hover of the row or card. */
  hoverText: string;
  /** Artwork border color on hover. */
  hoverBorder: string;
  /** Optional tint shown over artwork on hover. */
  overlay?: string;
};

// Class names are spelled out in full so Tailwind can find them.
export const categories: Record<CategoryId, CategoryStyle> = {
  business: {
    label: "Business",
    text: "text-category-business",
    rule: "border-b-category-business",
    hoverText: "group-hover:text-category-business",
    hoverBorder: "group-hover:border-category-business",
    overlay: "bg-category-business/15",
  },
  law: {
    label: "Law",
    text: "text-category-law",
    rule: "border-b-category-law",
    hoverText: "group-hover:text-category-law",
    hoverBorder: "group-hover:border-category-law",
  },
  risk: {
    label: "Risk",
    text: "text-category-risk-text",
    rule: "border-b-category-risk",
    hoverText: "group-hover:text-category-risk-text",
    hoverBorder: "group-hover:border-category-risk",
  },
  other: {
    label: "Other Things",
    text: "text-category-other-text",
    rule: "border-b-category-other",
    hoverText: "group-hover:text-category-other-text",
    hoverBorder: "group-hover:border-category-other",
  },
};

/** Episodes without a category (such as the trailer) keep the neutral rule and the lime hover. */
const uncategorized: CategoryStyle = {
  label: "",
  text: "",
  rule: "border-b-rule",
  hoverText: "group-hover:text-brand-lime",
  hoverBorder: "",
};

export function categoryStyle(id: CategoryId | null) {
  return id ? categories[id] : uncategorized;
}
