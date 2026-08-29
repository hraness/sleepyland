import {
  RESEARCH_IMAGE_SIZE,
  renderResearchCollectionImage,
} from "./article-image";

export const size = RESEARCH_IMAGE_SIZE;
export const contentType = "image/png";
export const alt = "Sleepyland evidence-led sound wellness research";

export default function OpenGraphImage() {
  return renderResearchCollectionImage();
}
