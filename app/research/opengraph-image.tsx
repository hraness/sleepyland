import {
  RESEARCH_IMAGE_SIZE,
  renderResearchCollectionImage,
} from "./article-image";

export const size = RESEARCH_IMAGE_SIZE;
export const contentType = "image/png";
export const alt =
  "The Sleepyland mark above the title “All sleep research guides” on a dark card";

export default function OpenGraphImage() {
  return renderResearchCollectionImage();
}
