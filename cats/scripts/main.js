import { getPageContent, onLinkNavigate, transitionHelper, getLink } from "./utils.js";

const galleryPath = "index.html";
const detailPath = `cat_`;

/**
 * 遷移先の種類を判定します。
 * @param fromPath {string}
 * @param toPath {string}
 * @returns {string}
 */
function getNavigationType(fromPath, toPath) {
  if (fromPath.includes(detailPath) && toPath.endsWith(galleryPath)) {
    return "detail-page-to-index";
  }

  if (fromPath.endsWith(galleryPath) && toPath.includes(detailPath)) {
    return "index-to-detail-page";
  }

  if (fromPath.includes(detailPath) && toPath.includes(detailPath)) {
    return "detail-to-detail-page";
  }

  return "other";
}

onLinkNavigate(async ({ fromPath, toPath, isBack }) => {
  const navigationType = getNavigationType(fromPath, toPath);
  const content = await getPageContent(toPath);

  let targetThumbnail;
  let classNames = "";

  if (navigationType === "index-to-detail-page") {
    targetThumbnail = getLink(toPath).querySelector("img");
    targetThumbnail.style.viewTransitionName = "cat-anime";
    classNames = "from-index to-detail";
  } else if (navigationType === "detail-page-to-index") {
    classNames = "to-index from-detail";
  } else if (navigationType === "detail-to-detail-page") {
    classNames = "to-detail from-detail" + (isBack ? " back-transition" : "");
  }

  const transition = transitionHelper({
    updateDOM() {
      document.body.innerHTML = content;

      if (navigationType === "detail-page-to-index") {
        targetThumbnail = getLink(fromPath).querySelector("img");
        targetThumbnail.style.viewTransitionName = "cat-anime";
      }
    },
    classNames,
  });

  transition.finished.finally(() => {
    if (targetThumbnail) targetThumbnail.style.viewTransitionName = "";
  });
});
