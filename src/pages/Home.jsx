import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AdvancedImage } from "@cloudinary/react";
import { cld } from "../utils/cloudinary";
import { limitFit } from "@cloudinary/url-gen/actions/resize";
import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
  isValidElement,
} from "react";
import { animate } from "animejs";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { supabase } from "../utils/supabase";
import ScrollBookingReveal from "../components/ScrollBookingReveal";
import { ReviewsGrid } from "./Booking";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HERO_IMAGE_IDS = [
  "AF1I0729_catszb",
  "2021-12-01_fj6dqk",
  "Image_1_iz7lk8",
  "AF1I1454_vcc77d",
  "3P4A1455_ctp4pj",
];

const HERO_IMAGE_ALTS = [
  "Editorial portrait portfolio image by Starling Photography",
  "Wedding portrait portfolio image by Starling Photography",
  "Lifestyle portfolio image by Starling Photography",
  "Bride and groom portrait portfolio image by Starling Photography",
  "Event portrait portfolio image by Starling Photography",
];

const WEDDING_1_IMAGE_IDS = [
  "Smith_Wedding_Edits_-_0001_of_0176_gu376e",
  "Smith_Wedding_Edits_-_0003_of_0176_bj9cpe",
  "Smith_Wedding_Edits_-_0002_of_0176_vbyqlu",
  "Smith_Wedding_Edits_-_0005_of_0176_hiaytz",
];

const WEDDING_1_IMAGE_ALTS = [
  "Smith Wedding portrait in Chesapeake City, Maryland",
  "Smith Wedding candid moment in Chesapeake City, Maryland",
  "Smith Wedding detail photography in Chesapeake City, Maryland",
  "Smith Wedding celebration portrait in Chesapeake City, Maryland",
];

const WEDDING_2_IMAGE_IDS = [
  "0006__DSC3027-topaz-denoise-denoise_DxO_tpqmmc",
  "0007__DSC3049-topaz-denoise-denoise_DxO_vh2j4m",
  "0010__DSC3081-topaz-denoise-denoise_DxO_rzb2jn",
  "0009__DSC3078-topaz-denoise-denoise_DxO_jsffaf",
  "0001__DSC0749-topaz-denoise-denoise_DxO_rv1pwc",
  "0008__DSC3059-topaz-denoise-denoise_DxO_mtpjqi",
  "0005__DSC2794-topaz-denoise-denoise_DxO_sltnnl",
  "0016__DSC4459-topaz-denoise-denoise_DxO_cjqihn",
];

const WEDDING_2_IMAGE_ALTS = [
  "wedding portrait at Glasbern",
  "candid wedding photography at Glasbern",
  "ceremony photography at Glasbern",
  "Makayla and Hunter wedding detail image at Glasbern",
  "couple portrait at Glasbern",
  "celebration photography at Glasbern",
  "summer wedding portrait",
  "wedding portfolio image at Glasbern",
];

const WEDDING_3_IMAGE_IDS = [
  "Thickstun_Wedding_Edits_-_001_of_053_d9jzgj",
  "Thickstun_Wedding_Edits_-_005_of_053_m4kutb",
  "Thickstun_Wedding_Edits_-_007_of_053_l8m03g",
  "Thickstun_Wedding_Edits_-_002_of_053_yfn4tj",
];

const WEDDING_3_IMAGE_ALTS = [
  "Thickstun Wedding portrait in Flemington, New Jersey",
  "Thickstun Wedding candid photography in Flemington, New Jersey",
  "Thickstun Wedding detail image in Flemington, New Jersey",
  "Thickstun Wedding celebration portrait in Flemington, New Jersey",
];

const ASSORTED_IMAGE_IDS = [
  "AF1I2242-Edit-2_cor6p9",
  "AF1I7015_2_hp56wr",
  "3P4A3745_otnq3g",
  "center_city_ag1h8b",
  "481666221_1153185816742175_5478825840378387253_n_ghztfm",
  "481208611_1153185853408838_4828418083954240645_n_ibeopl",
  "486975237_1174151831312240_7366045333287137682_n_q31v3y",
  "467500758_18303674563206065_3791607323077205586_n_n9awon",
  "467556740_18303681562206065_6578080749619128591_n_roaquw",
  "481777607_4086871861532488_3131714259942236180_n_h5cbs9",
  "482247755_4092919330927741_6702387078515023031_n_bvw40o",
  "476573711_4064025533817121_6295416143369206442_n_ewzzea",
];

const ASSORTED_IMAGE_ALTS = [
  "Selected portfolio image from a Philadelphia portrait session",
  "Selected portfolio image from an editorial shoot",
  "Selected portfolio image from a wedding portrait session",
  "Selected portfolio image photographed in Center City Philadelphia",
  "Selected portfolio image from a lifestyle photography session",
  "Selected portfolio image from a commercial portrait session",
  "Selected portfolio image featuring on-location photography",
  "Selected portfolio image from a wedding celebration",
  "Selected portfolio image from an event portrait session",
  "Selected portfolio image from an editorial portrait session",
  "Selected portfolio image from a city photography session",
  "Selected portfolio image from a lifestyle portrait session",
];

const STACK_OFFSET_DESKTOP_X = 44;
const STACK_OFFSET_DESKTOP_Y = 32;
const STACK_OFFSET_MOBILE_X = 24;
const STACK_OFFSET_MOBILE_Y = 16;
const STACK_COUNT = 3;
const CARD_SHADOWS = ["none", "none", "none"];
const EXPANDED_GALLERY_DESKTOP_GRID_COLUMNS = 15;
const EXPANDED_GALLERY_DESKTOP_CARD_SPAN = 3;
const EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_START = 4;
const EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_SPAN = 9;
const EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START = 2;
const EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN = 3;
const EXPANDED_GALLERY_DESKTOP_SLOT_COUNT =
  EXPANDED_GALLERY_DESKTOP_GRID_COLUMNS / EXPANDED_GALLERY_DESKTOP_CARD_SPAN;
const EXPANDED_GALLERY_FLOW_MAX_X = 26;
const EXPANDED_GALLERY_FLOW_MAX_Y = 14;
const EXPANDED_GALLERY_FLOW_DEAD_ZONE = 0.34;
const EXPANDED_GALLERY_SOFT_CLOSE_DURATION = 0.82;
const EXPANDED_GALLERY_SOFT_REVEAL_DURATION = 0.82;
const EXPANDED_GALLERY_PREMIUM_OPEN_DURATION = 0.56;
const EXPANDED_GALLERY_HERO_SWAP_DURATION = 1.05;
const EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION = 0.68;
const EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION = 0.62;
const EXPANDED_GALLERY_PERIMETER_SWAP_DURATION = 1.15;
const EXPANDED_GALLERY_SCROLL_CLOSE_ARM_DELAY_MS = Math.round(
  (Math.max(
    EXPANDED_GALLERY_PREMIUM_OPEN_DURATION,
    EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
    EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION,
  ) +
    0.12) *
    1000,
);
const EXPANDED_GALLERY_PERIMETER_PROGRESS_INIT_DELAY_MS = Math.round(
  (Math.max(
    EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
    EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION,
  ) +
    0.08) *
    1000,
);
const EXPANDED_GALLERY_PERIMETER_FLOW_STAGGER = 0.018;
const EXPANDED_GALLERY_PERIMETER_CLOSE_BUTTON_SAFE_TOP = 12;
const buildExpandedGalleryDesktopRows = (images) => {
  const rows = [];

  let imageIndex = 0;
  let rowNumber = 1;

  while (imageIndex < images.length) {
    const row = Array.from(
      { length: EXPANDED_GALLERY_DESKTOP_SLOT_COUNT },
      () => null,
    );
    const isPinnedRow =
      rowNumber >= EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START &&
      rowNumber <
        EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
          EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN;
    const slotIndexes = isPinnedRow
      ? [0, EXPANDED_GALLERY_DESKTOP_SLOT_COUNT - 1]
      : Array.from(
          { length: EXPANDED_GALLERY_DESKTOP_SLOT_COUNT },
          (_, slotIndex) => slotIndex,
        );

    for (const slotIndex of slotIndexes) {
      if (imageIndex >= images.length) break;
      row[slotIndex] = images[imageIndex];
      imageIndex += 1;
    }

    rows.push(row);
    rowNumber += 1;
  }

  return rows;
};

const clampValue = (min, value, max) => Math.min(max, Math.max(min, value));
const interpolateValue = (from, to, progress) =>
  from + (to - from) * clampValue(0, progress, 1);
const EXPANDED_GALLERY_PERIMETER_CARD_WIDTH = 16;
const EXPANDED_GALLERY_PERIMETER_HERO_WIDTH = 56;
const createExpandedGalleryPerimeterPose = (x, y, edge, opacity = 1) => ({
  x,
  y,
  edge,
  width: EXPANDED_GALLERY_PERIMETER_CARD_WIDTH,
  rotate: 0,
  scale: 1,
  opacity,
});
const perimeterSnapEase = (t) => t * t * (3 - 2 * t);
const interpolatePerimeterPose = (fromPose, toPose, progress) => {
  const clampedProgress = clampValue(0, progress, 1);
  const eased = perimeterSnapEase(clampedProgress);
  let x = interpolateValue(fromPose.x, toPose.x, eased);
  let y = interpolateValue(fromPose.y, toPose.y, eased);

  if (fromPose.edge !== toPose.edge) {
    let cornerX = fromPose.x;
    let cornerY = fromPose.y;

    if (fromPose.edge === "left" && toPose.edge === "bottom") {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    } else if (fromPose.edge === "bottom" && toPose.edge === "right") {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === "right" && toPose.edge === "top") {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    } else if (fromPose.edge === "top" && toPose.edge === "left") {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === "top" && toPose.edge === "right") {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === "right" && toPose.edge === "bottom") {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    } else if (fromPose.edge === "bottom" && toPose.edge === "left") {
      cornerX = toPose.x;
      cornerY = fromPose.y;
    } else if (fromPose.edge === "left" && toPose.edge === "top") {
      cornerX = fromPose.x;
      cornerY = toPose.y;
    }

    if (eased < 0.5) {
      const localProgress = eased * 2;
      x = interpolateValue(fromPose.x, cornerX, localProgress);
      y = interpolateValue(fromPose.y, cornerY, localProgress);
    } else {
      const localProgress = (eased - 0.5) * 2;
      x = interpolateValue(cornerX, toPose.x, localProgress);
      y = interpolateValue(cornerY, toPose.y, localProgress);
    }
  }

  let opacity = interpolateValue(fromPose.opacity, toPose.opacity, eased);
  if (fromPose.opacity !== toPose.opacity) {
    // Compress the opacity ramp near the arrival/departure so fading cards
    // don't linger at positions that overlap with their neighboring slot.
    if (fromPose.opacity < toPose.opacity) {
      // Fading in: stay invisible until the last 25% of travel.
      opacity =
        clampedProgress < 0.75
          ? 0
          : perimeterSnapEase((clampedProgress - 0.75) / 0.25);
    } else {
      // Fading out: drop to 0 within the first 25% of travel.
      opacity =
        clampedProgress > 0.25
          ? 0
          : 1 - perimeterSnapEase(clampedProgress / 0.25);
    }
  }

  return {
    x,
    y,
    edge: toPose.edge,
    width: interpolateValue(fromPose.width, toPose.width, eased),
    rotate: interpolateValue(fromPose.rotate, toPose.rotate, eased),
    scale: interpolateValue(fromPose.scale, toPose.scale, eased),
    opacity,
  };
};
const EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT = 5;
const EXPANDED_GALLERY_PERIMETER_VISIBLE_COUNT =
  EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT * 2;
const EXPANDED_GALLERY_PERIMETER_LEFT_TRACK = {
  slots: [
    createExpandedGalleryPerimeterPose(30, 96, "bottom"),
    createExpandedGalleryPerimeterPose(13, 75, "left"),
    createExpandedGalleryPerimeterPose(13, 50, "left"),
    createExpandedGalleryPerimeterPose(13, 25, "left"),
    createExpandedGalleryPerimeterPose(33, 3, "top"),
  ],
  entry: createExpandedGalleryPerimeterPose(30, 103, "bottom", 0),
  exit: createExpandedGalleryPerimeterPose(33, -4, "top", 0),
};
const EXPANDED_GALLERY_PERIMETER_RIGHT_TRACK = {
  slots: [
    createExpandedGalleryPerimeterPose(70, 96, "bottom"),
    createExpandedGalleryPerimeterPose(87, 75, "right"),
    createExpandedGalleryPerimeterPose(87, 50, "right"),
    createExpandedGalleryPerimeterPose(87, 25, "right"),
    createExpandedGalleryPerimeterPose(67, 3, "top"),
  ],
  entry: createExpandedGalleryPerimeterPose(70, 103, "bottom", 0),
  exit: createExpandedGalleryPerimeterPose(67, -4, "top", 0),
};
const EXPANDED_GALLERY_PERIMETER_CENTER_TRACK_SLOT_COUNT = 1;
const EXPANDED_GALLERY_PERIMETER_CENTER_TRACK = {
  slots: [createExpandedGalleryPerimeterPose(50, 3, "top")],
  entry: createExpandedGalleryPerimeterPose(50, 3, "top", 0),
  exit: createExpandedGalleryPerimeterPose(50, -4, "top", 0),
};
const EXPANDED_GALLERY_PERIMETER_BOTTOM_CENTER_TRACK = {
  slots: [createExpandedGalleryPerimeterPose(50, 96, "bottom")],
  entry: createExpandedGalleryPerimeterPose(50, 103, "bottom", 0),
  exit: createExpandedGalleryPerimeterPose(50, 96, "bottom", 0),
};
const resolveTrackPose = (track, position) => {
  const slots = track.slots;
  const lastSlotIndex = slots.length - 1;
  if (position <= 0) {
    return interpolatePerimeterPose(track.entry, slots[0], position + 1);
  }
  if (position >= lastSlotIndex) {
    return interpolatePerimeterPose(
      slots[lastSlotIndex],
      track.exit,
      position - lastSlotIndex,
    );
  }
  const fromIndex = Math.floor(position);
  const toIndex = Math.min(fromIndex + 1, lastSlotIndex);
  return interpolatePerimeterPose(
    slots[fromIndex],
    slots[toIndex],
    position - fromIndex,
  );
};
const resolveCapturedGalleryRect = (rects, cardKey) => {
  if (!cardKey) return null;
  return rects.get(cardKey) ?? rects.get(cardKey.replace(/:btm$/, "")) ?? null;
};
const captureDocumentRect = (rect) => {
  if (!rect?.width || !rect?.height || typeof window === "undefined")
    return null;
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    docLeft: rect.left + window.scrollX,
    docTop: rect.top + window.scrollY,
  };
};
const projectDocumentRectToViewport = (rect) => {
  if (!rect) return null;
  if (typeof window === "undefined") return rect;

  const hasDocPosition =
    Number.isFinite(rect.docLeft) && Number.isFinite(rect.docTop);
  return {
    left: hasDocPosition ? rect.docLeft - window.scrollX : rect.left,
    top: hasDocPosition ? rect.docTop - window.scrollY : rect.top,
    width: rect.width,
    height: rect.height,
    docLeft: hasDocPosition ? rect.docLeft : rect.left + window.scrollX,
    docTop: hasDocPosition ? rect.docTop : rect.top + window.scrollY,
  };
};
const setFixedRect = (node, rect) => {
  if (!(node instanceof HTMLElement) || !rect) return;
  node.style.left = `${rect.left}px`;
  node.style.top = `${rect.top}px`;
  node.style.width = `${rect.width}px`;
  node.style.height = `${rect.height}px`;
};
const interpolateRect = (fromRect, toRect, progress) => ({
  left: interpolateValue(fromRect.left, toRect.left, progress),
  top: interpolateValue(fromRect.top, toRect.top, progress),
  width: interpolateValue(fromRect.width, toRect.width, progress),
  height: interpolateValue(fromRect.height, toRect.height, progress),
});
const normalizeRangeProgress = (value, start, end) => {
  if (end <= start) return value >= end ? 1 : 0;
  return clampValue(0, (value - start) / (end - start), 1);
};
const isRectNearViewport = (rect, padding = 160) =>
  rect.left + rect.width >= -padding &&
  rect.left <= window.innerWidth + padding &&
  rect.top + rect.height >= -padding &&
  rect.top <= window.innerHeight + padding;
const resolveScrollTopToRevealRect = (
  rect,
  { topInset = 0, bottomInset = 24, topBias = 0 } = {},
) => {
  if (!rect || typeof window === "undefined") return null;

  const safeTop = Math.min(window.innerHeight - 1, Math.max(16, topInset));
  const safeBottom = Math.max(safeTop + 1, window.innerHeight - bottomInset);
  const safeHeight = safeBottom - safeTop;

  if (rect.height >= safeHeight || rect.top < safeTop) {
    return Math.max(0, window.scrollY + rect.top - safeTop + topBias);
  }

  if (rect.bottom > safeBottom) {
    return Math.max(0, window.scrollY + rect.bottom - safeBottom);
  }

  return null;
};
const shouldAnimateGalleryReturnToTarget = (fromRect, toRect) => {
  if (!fromRect || !toRect || typeof window === "undefined") return false;
  if (!isRectNearViewport(fromRect, 120) || !isRectNearViewport(toRect, 180)) {
    return false;
  }

  const fromCenterX = fromRect.left + fromRect.width / 2;
  const fromCenterY = fromRect.top + fromRect.height / 2;
  const toCenterX = toRect.left + toRect.width / 2;
  const toCenterY = toRect.top + toRect.height / 2;
  const maxDistance = Math.max(
    320,
    Math.min(
      620,
      Math.max(window.innerWidth * 0.42, window.innerHeight * 0.48),
    ),
  );

  return (
    Math.hypot(toCenterX - fromCenterX, toCenterY - fromCenterY) <= maxDistance
  );
};
const getPerimeterEntryOffset = (edge) => {
  if (edge === "left") return { x: -18, y: 0 };
  if (edge === "right") return { x: 18, y: 0 };
  if (edge === "top") return { x: 0, y: -14 };
  return { x: 0, y: 14 };
};

const useMediaQuery = (query) => {
  const getInitial = () => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return false;
    return Boolean(window.matchMedia(query).matches);
  };

  const [matches, setMatches] = useState(getInitial);

  useEffect(() => {
    const mediaQueryList = window.matchMedia?.(query);
    if (!mediaQueryList) return undefined;

    const handleChange = () => setMatches(Boolean(mediaQueryList.matches));
    handleChange();

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
      return () => mediaQueryList.removeEventListener("change", handleChange);
    }

    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [query]);

  return matches;
};

const buildOptimizedImage = (publicId, maxWidth) => {
  const img = cld.image(publicId).format("auto").quality("auto");
  if (typeof maxWidth === "number") {
    img.resize(limitFit().width(maxWidth));
  }
  return img;
};

const buildPlaceholderUrl = (publicId, maxWidth = 96) => {
  return cld
    .image(publicId)
    .format("auto")
    .quality(10)
    .resize(limitFit().width(maxWidth))
    .toURL();
};

const loadedGalleryImageIds = new Set();

const ProgressiveCldImage = ({
  publicId,
  cldImg,
  alt,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  placeholderWidth = 96,
  imgClassName = "",
}) => {
  const [hiLoaded, setHiLoaded] = useState(() =>
    loadedGalleryImageIds.has(publicId),
  );
  const [hiError, setHiError] = useState(false);

  const placeholderSrc = useMemo(
    () => buildPlaceholderUrl(publicId, placeholderWidth),
    [publicId, placeholderWidth],
  );

  const [prevPublicId, setPrevPublicId] = useState(publicId);
  if (prevPublicId !== publicId) {
    setPrevPublicId(publicId);
    setHiLoaded(loadedGalleryImageIds.has(publicId));
    setHiError(false);
  }

  const handleHiLoad = useCallback(
    (e) => {
      const el = e.currentTarget;
      const markLoaded = () => {
        loadedGalleryImageIds.add(publicId);
        setHiLoaded(true);
      };

      if (typeof el?.decode === "function") {
        el.decode().then(markLoaded, markLoaded);
        return;
      }
      markLoaded();
    },
    [publicId],
  );

  const showHi = hiLoaded && !hiError;

  return (
    <>
      <div
        className={`absolute inset-0 ${
          showHi ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
        aria-hidden="true"
      >
        <img
          src={placeholderSrc}
          alt=""
          loading="eager"
          decoding="async"
          className={`w-full h-full ${imgClassName} blur-2xl`}
        />
      </div>

      <div
        className={`absolute inset-0 ${
          showHi ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
      >
        <AdvancedImage
          cldImg={cldImg}
          className={`w-full h-full ${imgClassName}`}
          alt={alt}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          onLoad={handleHiLoad}
          onError={() => setHiError(true)}
        />
      </div>
    </>
  );
};

const ExpandedGalleryHeroImage = ({
  imageKey,
  publicId,
  cldImg,
  alt,
  loading = "eager",
  decoding = "async",
  fetchPriority = "high",
  placeholderWidth = 96,
  imgClassName = "object-cover",
  animateOnChange = true,
}) => {
  const [outgoingImage, setOutgoingImage] = useState(null);
  const previousImageRef = useRef(null);
  const incomingLayerRef = useRef(null);
  const outgoingLayerRef = useRef(null);
  const transitionIdRef = useRef(0);

  useLayoutEffect(() => {
    const nextImage = {
      imageKey,
      publicId,
      cldImg,
      alt,
      loading,
      decoding,
      fetchPriority,
      placeholderWidth,
      imgClassName,
    };
    const previousImage = previousImageRef.current;
    const didChange = Boolean(
      animateOnChange &&
      previousImage?.imageKey &&
      imageKey &&
      previousImage.imageKey !== imageKey,
    );

    if (didChange) {
      transitionIdRef.current += 1;
      setOutgoingImage({
        ...previousImage,
        transitionId: transitionIdRef.current,
      });
    } else {
      setOutgoingImage(null);
    }

    previousImageRef.current = nextImage;
  }, [
    animateOnChange,
    alt,
    cldImg,
    decoding,
    fetchPriority,
    imageKey,
    imgClassName,
    loading,
    placeholderWidth,
    publicId,
  ]);

  useLayoutEffect(() => {
    const incomingLayer = incomingLayerRef.current;
    const outgoingLayer = outgoingLayerRef.current;

    if (!incomingLayer) return undefined;

    gsap.killTweensOf(incomingLayer);
    if (outgoingLayer) {
      gsap.killTweensOf(outgoingLayer);
    }

    if (!animateOnChange || !outgoingImage) {
      gsap.set(incomingLayer, {
        opacity: 1,
        filter: "none",
        clearProps: "opacity,transform,filter",
      });
      return undefined;
    }

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      const transitionId = outgoingImage.transitionId;
      queueMicrotask(() => {
        setOutgoingImage((current) =>
          current?.transitionId === transitionId ? null : current,
        );
      });
      gsap.set(incomingLayer, {
        opacity: 1,
        filter: "none",
        clearProps: "opacity,transform,filter",
      });
      return undefined;
    }

    const transitionId = outgoingImage.transitionId;

    gsap.fromTo(
      incomingLayer,
      {
        opacity: 0.5,
        filter: "blur(1.2px) saturate(1.03)",
      },
      {
        opacity: 1,
        filter: "blur(0px) saturate(1)",
        duration: EXPANDED_GALLERY_HERO_SWAP_DURATION,
        ease: "expo.out",
        overwrite: "auto",
        clearProps: "opacity,transform,filter",
      },
    );

    if (outgoingLayer) {
      gsap.fromTo(
        outgoingLayer,
        {
          opacity: 1,
          filter: "blur(0px) brightness(1)",
        },
        {
          opacity: 0,
          filter: "blur(2.4px) brightness(0.985)",
          duration: EXPANDED_GALLERY_HERO_SWAP_DURATION * 1.05,
          ease: "expo.out",
          overwrite: "auto",
          clearProps: "transform,filter",
          onComplete: () => {
            setOutgoingImage((current) =>
              current?.transitionId === transitionId ? null : current,
            );
          },
        },
      );
    }

    return () => {
      gsap.killTweensOf(incomingLayer);
      if (outgoingLayer) {
        gsap.killTweensOf(outgoingLayer);
      }
    };
  }, [animateOnChange, outgoingImage]);

  return (
    <>
      <div
        ref={incomingLayerRef}
        className="absolute inset-0"
        style={{ willChange: "opacity, transform, filter" }}
      >
        <ProgressiveCldImage
          key={imageKey}
          publicId={publicId}
          cldImg={cldImg}
          alt={alt}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          placeholderWidth={placeholderWidth}
          imgClassName={imgClassName}
        />
      </div>

      {outgoingImage ? (
        <div
          ref={outgoingLayerRef}
          className="absolute inset-0 pointer-events-none"
          style={{ willChange: "opacity, transform, filter" }}
          aria-hidden="true"
        >
          <ProgressiveCldImage
            key={outgoingImage.imageKey}
            publicId={outgoingImage.publicId}
            cldImg={outgoingImage.cldImg}
            alt=""
            loading="eager"
            decoding="async"
            placeholderWidth={outgoingImage.placeholderWidth}
            imgClassName={outgoingImage.imgClassName}
          />
        </div>
      ) : null}
    </>
  );
};

const useSectionMount = (rootMargin = "250px") => {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender, rootMargin]);

  return [sectionRef, shouldRender];
};

const splitChildrenToWordTokens = (children) => {
  const tokens = [];
  let key = 0;

  const visit = (node, italic = false) => {
    if (node == null || node === false) return;
    if (typeof node === "string" || typeof node === "number") {
      const parts = String(node).split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          tokens.push({ kind: "space", text: part, key: key++ });
        } else {
          tokens.push({ kind: "word", text: part, italic, key: key++ });
        }
      }
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((n) => visit(n, italic));
      return;
    }
    if (isValidElement(node)) {
      const isEm = node.type === "em" || node.type === "i";
      visit(node.props.children, italic || isEm);
    }
  };

  visit(children);
  return tokens;
};

const ScrollWordReveal = ({ children, className }) => {
  const containerRef = useRef(null);
  const tokens = useMemo(
    () => splitChildrenToWordTokens(children),
    [children],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const words = container.querySelectorAll("[data-word-reveal]");
    if (!words.length) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      words.forEach((w) => {
        w.style.color = "#0f172a";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { color: "#cbd5e1" });
      gsap.to(words, {
        color: "#0f172a",
        ease: "none",
        duration: 0.6,
        stagger: 0.25,
        scrollTrigger: {
          trigger: container,
          start: "top 90%",
          end: "top 50%",
          scrub: 0.6,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [tokens]);

  const wordStyle = {
    display: "inline-block",
    color: "#cbd5e1",
  };

  return (
    <p ref={containerRef} className={className}>
      {tokens.map((t) => {
        if (t.kind === "space") return t.text;
        const Wrapper = t.italic ? "em" : "span";
        return (
          <Wrapper key={t.key} data-word-reveal style={wordStyle}>
            {t.text}
          </Wrapper>
        );
      })}
    </p>
  );
};

const useReveal = (shouldAnimate) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
      return;

    const ctx = gsap.context(() => {
      const reveal = () => {
        gsap.to(node, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "expo.out",
          clearProps: "transform,filter",
        });
      };

      gsap.set(node, { opacity: 0, y: 28, filter: "blur(6px)" });

      // If the section is already in view (common after layout shifts),
      // don't leave it stuck at opacity:0 waiting for a scroll event.
      const threshold = window.innerHeight * 0.88;
      const rect = node.getBoundingClientRect();
      if (rect.top < threshold && rect.bottom > 0) {
        reveal();
        return;
      }

      ScrollTrigger.create({
        trigger: node,
        start: "top 88%",
        once: true,
        onEnter: reveal,
      });
    });

    return () => ctx.revert();
  }, [shouldAnimate]);

  return ref;
};

const useStaggerReveal = (shouldAnimate) => {
  const gridRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;
    const node = gridRef.current;
    if (!node) return;

    const items = [...node.children];
    if (!items.length) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)
      return;

    const ctx = gsap.context(() => {
      gsap.set(items, {
        opacity: 0,
        y: 20,
        x: -10,
        scale: 0.985,
        willChange: "opacity, transform",
      });

      items.forEach((item, index) => {
        const col = index % 4;
        const startPct = 92 - col * 5;
        const endPct = startPct - 5;
        gsap.to(item, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: `top ${startPct}%`,
            end: `top ${endPct}%`,
            scrub: 0.5,
          },
        });
      });

      // The per-item ScrollTrigger handles initial in-view items via its own
      // immediate progress computation. A defensive refresh covers any
      // post-mount layout shifts (e.g. expanded gallery closing) without
      // overwriting the scroll-controlled tweens.
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [shouldAnimate]);

  return gridRef;
};

const Home = () => {
  const lenis = useLenis();
  const [visibleSet, setVisibleSet] = useState([0, 1, 2]);
  const [departingIdx, setDepartingIdx] = useState(null);
  const [entranceDone, setEntranceDone] = useState(false);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [isClosingQuoteModal, setIsClosingQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ phone: "" });
  const [quoteStatus, setQuoteStatus] = useState("idle");
  const [showStickyReachOut, setShowStickyReachOut] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollHintDismissedRef = useRef(false);
  const [showLightboxBookingPrompt, setShowLightboxBookingPrompt] =
    useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.scrollY > 80) {
      scrollHintDismissedRef.current = true;
      return undefined;
    }

    const DISMISS_THRESHOLD = 400;

    const onScroll = () => {
      if (window.scrollY > DISMISS_THRESHOLD) {
        scrollHintDismissedRef.current = true;
        setShowScrollHint(false);
      }
    };

    const timer = window.setTimeout(() => {
      if (!scrollHintDismissedRef.current && window.scrollY < 80) {
        setShowScrollHint(true);
      }
    }, 13000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleScrollHintClick = useCallback(() => {
    scrollHintDismissedRef.current = true;
    setShowScrollHint(false);
    const target =
      document.getElementById("home-selected") ||
      document.getElementById("home-featured");
    if (!target) return;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, offset: -80 });
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [lenis]);

  const closeQuoteModal = useCallback((isSlow = false) => {
    setIsClosingQuoteModal(isSlow ? "slow" : "fast");
    setTimeout(
      () => {
        setShowQuoteModal(false);
        setQuoteStatus("idle");
        setQuoteForm({ phone: "" });
        setIsClosingQuoteModal(false);
      },
      isSlow ? 1500 : 350,
    );
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const docEl = document.documentElement;
    if (showQuoteModal && !isClosingQuoteModal) {
      docEl.setAttribute("data-quote-modal-open", "");
      docEl.removeAttribute("data-quote-modal-restoring");
    } else if (showQuoteModal && isClosingQuoteModal) {
      docEl.removeAttribute("data-quote-modal-open");
      docEl.setAttribute("data-quote-modal-restoring", "");
    } else {
      docEl.removeAttribute("data-quote-modal-open");
      docEl.removeAttribute("data-quote-modal-restoring");
    }

    return () => {
      docEl.removeAttribute("data-quote-modal-open");
      docEl.removeAttribute("data-quote-modal-restoring");
    };
  }, [showQuoteModal, isClosingQuoteModal]);

  useEffect(() => {
    const openFromNav = () => setShowQuoteModal(true);
    window.addEventListener("starling:open-quote", openFromNav);
    return () => window.removeEventListener("starling:open-quote", openFromNav);
  }, []);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    setQuoteStatus("sending");

    const emailPromise = emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        name: "Quick Quote Request",
        email: "quote@request.com",
        phone: quoteForm.phone,
        date: "",
        time: new Date().toLocaleString(),
        location: "",
        message: `Quick quote request.\nPhone: ${quoteForm.phone}`,
        reply_to: "quote@request.com",
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );

    supabase
      .from("inquiries")
      .insert({
        type: "quick_quote",
        name: "Quick Quote Request",
        phone: quoteForm.phone,
      })
      .then(({ error }) => {
        if (error) console.error("Supabase insert error:", error);
      });

    emailPromise
      .then(() => {
        setQuoteStatus("success");
        setTimeout(() => {
          closeQuoteModal(true);
        }, 3000);
      })
      .catch(() => {
        setQuoteStatus("error");
      });
  };
  const stackIntervalRef = useRef(null);
  const stackRef = useRef(null);
  const visibleSetRef = useRef([0, 1, 2]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [stackWidth, setStackWidth] = useState(null);

  const isMobileStack = useMediaQuery(
    "(max-width: 767px), (orientation: landscape) and (max-height: 500px)",
  );
  const isMobileLandscape = useMediaQuery(
    "(max-width: 1023px) and (orientation: landscape) and (max-height: 500px)",
  );
  const isDesktopGallery = useMediaQuery("(min-width: 1024px)");
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === "undefined" ? 1440 : window.innerWidth,
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === "undefined" ? 900 : window.innerHeight,
  );
  const [expandedGalleryImage, setExpandedGalleryImage] = useState(null);
  const expandedGalleryImageKey = expandedGalleryImage
    ? `${expandedGalleryImage.galleryKey}:${expandedGalleryImage.imageId}`
    : null;
  const hasExpandedGalleryImage = Boolean(expandedGalleryImage);

  useEffect(() => {
    setShowLightboxBookingPrompt(false);
    if (!expandedGalleryImageKey) return undefined;
    const timer = window.setTimeout(() => {
      setShowLightboxBookingPrompt(true);
    }, 10000);
    return () => window.clearTimeout(timer);
  }, [expandedGalleryImageKey]);

  const expandedGalleryStageRef = useRef(null);
  const expandedGalleryFixedCardRef = useRef(null);
  const expandedGalleryPerimeterFlowRef = useRef(null);
  const expandedGallerySourceRectRef = useRef(null);
  const expandedGallerySourceInnerRef = useRef(null);
  const expandedGallerySourceScrollRef = useRef({ x: 0, y: 0 });
  const expandedGalleryRectsRef = useRef(new Map());
  const expandedGalleryPerimeterClockwiseSwapRef = useRef(false);
  const expandedGalleryClosingCloneRef = useRef(null);
  const expandedGalleryCloseMetaRef = useRef(null);
  const expandedGalleryOpeningCloneRef = useRef(null);
  const expandedGalleryPremiumOpenKeyRef = useRef(null);
  const expandedGalleryScrollCloseArmUntilRef = useRef(0);
  const expandedGallerySoftCloseRef = useRef(false);
  const expandedGalleryIsClosingRef = useRef(false);
  const expandedGalleryMorphLayerPendingRemoveRef = useRef(null);
  const expandedGalleryScrollMorphRef = useRef({
    active: false,
    progress: 0,
    distance: 0,
    heroStartTop: 0,
    heroEndTop: 0,
    animation: null,
    layer: null,
    stageContentNode: null,
    heroItem: null,
    flowItems: [],
    previewItems: [],
    suppressedRowIndex: null,
    heroRestoreStyles: [],
    stageRestoreStyles: [],
  });
  const expandedGalleryWasVisibleRef = useRef(false);
  const expandedGalleryWasOpenRef = useRef(false);
  const [_expandedGalleryPinSize, setExpandedGalleryPinSize] = useState(null);
  const [
    expandedGalleryPerimeterProgress,
    setExpandedGalleryPerimeterProgress,
  ] = useState(0);
  const [expandedGalleryPinnedRowOffset, setExpandedGalleryPinnedRowOffset] =
    useState(0);
  const [
    expandedGalleryScrollMorphActive,
    setExpandedGalleryScrollMorphActive,
  ] = useState(false);
  const expandedGalleryRowMetricsRef = useRef({
    basePinnedRowTopFromStage: 0,
    rowStep: 0,
  });
  const expandedGalleryAnimatedRowsRef = useRef(new Set());
  const expandedGalleryPerimeterSnapRef = useRef({
    target: 0,
    current: 0,
    animId: 0,
  });
  const expandedGalleryPerimeterPostMorphRef = useRef(false);
  const expandedGalleryPerimeterFreshOpenRef = useRef(false);
  const [mobileLightbox, setMobileLightbox] = useState(null);
  const mobileLightboxTouchStartRef = useRef(null);
  const mobileLightboxTrackRef = useRef(null);
  const mobileLightboxDragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    lastX: 0,
    lastTime: 0,
    horizontal: null,
    width: 0,
  });
  const mobileLightboxJustSwipedRef = useRef(false);
  const mobileLightboxImage =
    mobileLightbox?.images?.[mobileLightbox.index] ?? null;

  useEffect(() => {
    expandedGalleryRowMetricsRef.current = {
      basePinnedRowTopFromStage: 0,
      rowStep: 0,
    };
    if (!expandedGalleryImageKey) {
      expandedGalleryPerimeterClockwiseSwapRef.current = false;
    }
    expandedGalleryAnimatedRowsRef.current.clear();
    const snap = expandedGalleryPerimeterSnapRef.current;
    if (snap.animId) window.cancelAnimationFrame(snap.animId);
    snap.target = 0;
    snap.current = 0;
    snap.animId = 0;
  }, [expandedGalleryImageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!isDesktopGallery) return undefined;

    // The expanded-gallery open/close causes large layout shifts (sticky stages,
    // dynamic heights). Refresh ScrollTrigger so staggered galleries don't end
    // up stuck at opacity:0 after a jump.
    let raf1 = 0;
    let raf2 = 0;
    let timeoutId = 0;

    const repairVisibleGalleryCards = () => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();

      const threshold = window.innerHeight * 0.93;
      const nodes = Array.from(
        document.querySelectorAll(
          "#home-featured .home-gallery-card, #home-selected .home-gallery-card",
        ),
      ).filter((node) => node instanceof HTMLElement);

      const stuckVisible = nodes.filter((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= threshold) return false;
        const opacity = Number.parseFloat(
          window.getComputedStyle(node).opacity ?? "1",
        );
        return Number.isFinite(opacity) && opacity < 0.12;
      });

      if (!stuckVisible.length) return;

      gsap.killTweensOf(stuckVisible);
      gsap.to(stuckVisible, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power2.out",
        overwrite: true,
        clearProps: "opacity,transform",
      });
    };

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(repairVisibleGalleryCards);
    });
    timeoutId = window.setTimeout(repairVisibleGalleryCards, 220);

    return () => {
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [expandedGalleryImageKey, isDesktopGallery]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const node = stackRef.current;
    if (!node) return undefined;
    if (typeof ResizeObserver === "undefined") return undefined;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry?.contentRect?.width;
      if (typeof width === "number" && Number.isFinite(width) && width > 0) {
        setStackWidth(width);
      }
    });

    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const stackOffsetX = useMemo(() => {
    const width = stackWidth ?? (isMobileStack ? 360 : 900);
    const ratio = isMobileStack ? 0.07 : 0.07;
    const min = isMobileStack ? 10 : 16;
    const max = isMobileStack ? STACK_OFFSET_MOBILE_X : STACK_OFFSET_DESKTOP_X;
    return Math.round(clampValue(min, width * ratio, max));
  }, [stackWidth, isMobileStack]);

  const stackOffsetY = useMemo(() => {
    const width = stackWidth ?? (isMobileStack ? 360 : 900);
    const ratio = isMobileStack ? 0.045 : 0.05;
    const min = isMobileStack ? 7 : 10;
    const max = isMobileStack ? STACK_OFFSET_MOBILE_Y : STACK_OFFSET_DESKTOP_Y;
    return Math.round(clampValue(min, width * ratio, max));
  }, [stackWidth, isMobileStack]);

  const stackWrapperTranslateX = useMemo(() => {
    if (isMobileStack) return 0;
    return Math.round(36 + stackOffsetX * 1.75);
  }, [isMobileStack, stackOffsetX]);

  const heroScale = useMemo(() => {
    if (isMobileStack) return 1;
    const w = typeof viewportWidth === "number" ? viewportWidth : 1440;
    if (w >= 1440) return 1;
    const pad = Math.min(128, Math.max(48, 0.1563 * w - 72));
    const available = w - 2 * pad;
    return Math.max(0.55, available / 1184);
  }, [isMobileStack, viewportWidth]);

  const heroLayoutRef = useRef(null);
  const [heroNaturalHeight, setHeroNaturalHeight] = useState(0);

  useEffect(() => {
    if (isMobileStack) return undefined;
    const el = heroLayoutRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => {
      setHeroNaturalHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobileStack]);

  const heroLayoutStyle = useMemo(() => {
    if (isMobileStack) return undefined;
    if (heroScale >= 1) {
      return { width: 1184, marginLeft: "auto", marginRight: "auto" };
    }
    const w = typeof viewportWidth === "number" ? viewportWidth : 1440;
    const pad = Math.min(128, Math.max(48, 0.1563 * w - 72));
    const containerW = w - 2 * pad;
    const tx = Math.round((containerW - 1184) / 2);
    return {
      width: 1184,
      transform: `translateX(${tx}px) scale(${heroScale})`,
      transformOrigin: "top center",
    };
  }, [isMobileStack, heroScale, viewportWidth]);

  const container = useRef(null);
  const heroReachOutButtonRef = useRef(null);
  const bookingRevealRef = useRef(null);
  const reviewsBackdropRef = useRef(null);
  const reviewsSectionRef = useRef(null);
  const reviewsContentRef = useRef(null);
  const [featuredRef, renderFeatured] = useSectionMount();
  const [selectedRef, renderSelected] = useSectionMount();

  const wedding2GridRef = useStaggerReveal(renderFeatured);
  const wedding1GridRef = useStaggerReveal(renderFeatured);
  const wedding3GridRef = useStaggerReveal(renderFeatured);
  const assortedGridRef = useStaggerReveal(renderSelected);

  const wedding2HeaderRef = useReveal(renderFeatured);
  const wedding1HeaderRef = useReveal(renderFeatured);
  const wedding3HeaderRef = useReveal(renderFeatured);
  const selectedDividerRef = useReveal(renderSelected);

  const heroImages = useMemo(
    () => HERO_IMAGE_IDS.map((publicId) => buildOptimizedImage(publicId, 2000)),
    [],
  );

  const wedding2Images = useMemo(() => {
    if (!renderFeatured && !hasExpandedGalleryImage) return [];
    return WEDDING_2_IMAGE_IDS.map((publicId, index) => ({
      id: `${publicId}-mh`,
      galleryKey: "wedding-2",
      altLabel: "Makayla and Hunter",
      altText:
        WEDDING_2_IMAGE_ALTS[index] ??
        "Makayla and Hunter wedding portfolio image",
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: "aspect-[4/3]",
      className: isMobileLandscape
        ? "md:col-span-3 lg:col-span-3"
        : "md:col-span-6 lg:col-span-3",
    }));
  }, [renderFeatured, hasExpandedGalleryImage, isMobileLandscape]);

  const wedding1Images = useMemo(() => {
    if (!renderFeatured && !hasExpandedGalleryImage) return [];
    return WEDDING_1_IMAGE_IDS.map((publicId, index) => ({
      id: publicId,
      galleryKey: "wedding-1",
      altLabel: "Smith Wedding",
      altText: WEDDING_1_IMAGE_ALTS[index] ?? "Smith Wedding portfolio image",
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: "aspect-[4/3]",
      className: isMobileLandscape
        ? "md:col-span-3 lg:col-span-3"
        : "md:col-span-6 lg:col-span-3",
    }));
  }, [renderFeatured, hasExpandedGalleryImage, isMobileLandscape]);

  const wedding3Images = useMemo(() => {
    if (!renderFeatured && !hasExpandedGalleryImage) return [];
    return WEDDING_3_IMAGE_IDS.map((publicId, index) => ({
      id: publicId,
      galleryKey: "wedding-3",
      altLabel: "Thickstun Wedding",
      altText:
        WEDDING_3_IMAGE_ALTS[index] ??
        "Thickstun Wedding portfolio image",
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: "aspect-[4/3]",
      className: isMobileLandscape
        ? "md:col-span-3 lg:col-span-3"
        : "md:col-span-6 lg:col-span-3",
    }));
  }, [renderFeatured, hasExpandedGalleryImage, isMobileLandscape]);

  const assortedImages = useMemo(() => {
    if (!renderSelected && !hasExpandedGalleryImage) return [];
    return ASSORTED_IMAGE_IDS.map((publicId, i) => ({
      id: `as-${i + 1}`,
      galleryKey: "selected",
      altLabel: "Selected Work",
      altText:
        ASSORTED_IMAGE_ALTS[i] ??
        "Selected portfolio image by Starling Photography",
      publicId,
      cldImg: buildOptimizedImage(publicId, 1600),
      aspectRatio: "aspect-[4/3]",
      className: isMobileLandscape
        ? "md:col-span-3 lg:col-span-3"
        : "md:col-span-6 lg:col-span-3",
    }));
  }, [renderSelected, hasExpandedGalleryImage, isMobileLandscape]);
  const expandedGalleryCatalogImages = useMemo(() => {
    const className = isMobileLandscape
      ? "md:col-span-3 lg:col-span-3"
      : "md:col-span-6 lg:col-span-3";

    return [
      ...HERO_IMAGE_IDS.map((publicId, index) => ({
        id: `hero-${index + 1}`,
        galleryKey: "hero",
        altLabel: "Landing Page",
        altText:
          HERO_IMAGE_ALTS[index] ??
          "Landing page portfolio image by Starling Photography",
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: "aspect-[3/2]",
        className,
      })),
      ...ASSORTED_IMAGE_IDS.map((publicId, index) => ({
        id: `as-${index + 1}`,
        galleryKey: "selected",
        altLabel: "Selected Work",
        altText:
          ASSORTED_IMAGE_ALTS[index] ??
          "Selected portfolio image by Starling Photography",
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: "aspect-[4/3]",
        className,
      })),
      ...WEDDING_2_IMAGE_IDS.map((publicId, index) => ({
        id: `${publicId}-mh`,
        galleryKey: "wedding-2",
        altLabel: "Makayla and Hunter",
        altText:
          WEDDING_2_IMAGE_ALTS[index] ??
          "Makayla and Hunter wedding portfolio image",
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: "aspect-[4/3]",
        className,
      })),
      ...WEDDING_1_IMAGE_IDS.map((publicId, index) => ({
        id: publicId,
        galleryKey: "wedding-1",
        altLabel: "Smith Wedding",
        altText: WEDDING_1_IMAGE_ALTS[index] ?? "Smith Wedding portfolio image",
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: "aspect-[4/3]",
        className,
      })),
      ...WEDDING_3_IMAGE_IDS.map((publicId, index) => ({
        id: publicId,
        galleryKey: "wedding-3",
        altLabel: "Thickstun Wedding",
        altText:
          WEDDING_3_IMAGE_ALTS[index] ??
          "Thickstun Wedding portfolio image",
        publicId,
        cldImg: buildOptimizedImage(publicId, 1600),
        aspectRatio: "aspect-[4/3]",
        className,
      })),
    ];
  }, [isMobileLandscape]);

  const expandedLandingFlowImages = useMemo(() => {
    if (!hasExpandedGalleryImage) return [];

    return expandedGalleryCatalogImages.filter(
      (img) =>
        !(
          expandedGalleryImage?.galleryKey === img.galleryKey &&
          expandedGalleryImage?.imageId === img.id
        ),
    );
  }, [
    expandedGalleryCatalogImages,
    expandedGalleryImage,
    hasExpandedGalleryImage,
  ]);
  const expandedLandingSelectedImage = useMemo(() => {
    if (!hasExpandedGalleryImage) return null;

    return (
      expandedGalleryCatalogImages.find(
        (img) =>
          expandedGalleryImage?.galleryKey === img.galleryKey &&
          expandedGalleryImage?.imageId === img.id,
      ) ?? null
    );
  }, [
    expandedGalleryCatalogImages,
    expandedGalleryImage,
    hasExpandedGalleryImage,
  ]);
  const expandedLandingPerimeterImages = useMemo(() => {
    if (!expandedLandingSelectedImage) return expandedLandingFlowImages;

    const selectedIndex = expandedGalleryCatalogImages.findIndex(
      (img) =>
        img.galleryKey === expandedLandingSelectedImage.galleryKey &&
        img.id === expandedLandingSelectedImage.id,
    );
    if (selectedIndex < 0) return expandedLandingFlowImages;

    return [
      ...expandedGalleryCatalogImages.slice(selectedIndex + 1),
      ...expandedGalleryCatalogImages.slice(0, selectedIndex),
    ];
  }, [
    expandedGalleryCatalogImages,
    expandedLandingFlowImages,
    expandedLandingSelectedImage,
  ]);

  const expandedLandingGridRowCount = useMemo(
    () => buildExpandedGalleryDesktopRows(expandedLandingFlowImages).length,
    [expandedLandingFlowImages],
  );

  const expandedGalleryMaxPinnedRowOffset = useMemo(
    () =>
      Math.max(
        0,
        expandedLandingGridRowCount -
          (EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
            EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN -
            1),
      ),
    [expandedLandingGridRowCount],
  );

  const expandedGalleryStickyTop = useMemo(() => {
    if (!isDesktopGallery) return 112;
    return Math.round(clampValue(112, viewportHeight * 0.14, 168));
  }, [isDesktopGallery, viewportHeight]);
  const useExpandedLandingPerimeter =
    hasExpandedGalleryImage && isDesktopGallery;
  const expandedGalleryPerimeterMaxProgress = useMemo(() => {
    const total = expandedLandingPerimeterImages.length;
    if (total < 3) return 0;

    const leftCount = Math.ceil(total / 3);
    const centerCount = Math.floor((total + 1) / 3);
    const rightCount = Math.floor(total / 3);

    const sideSlots = EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT;
    const centerSlots = EXPANDED_GALLERY_PERIMETER_CENTER_TRACK_SLOT_COUNT;

    return Math.max(
      0,
      Math.min(
        leftCount - sideSlots,
        centerCount - centerSlots,
        rightCount - sideSlots,
      ),
    );
  }, [expandedLandingPerimeterImages.length]);
  const expandedGalleryPerimeterStepDistance = useMemo(
    () => Math.round(clampValue(112, viewportHeight * 0.15, 172)),
    [viewportHeight],
  );
  const expandedGalleryPerimeterStageHeight = useMemo(
    () => Math.round(clampValue(900, viewportHeight * 0.86, 1040)),
    [viewportHeight],
  );
  const expandedGalleryPerimeterVerticalShift = useMemo(() => {
    if (!isDesktopGallery) return 0;

    return Math.max(
      0,
      Math.round(
        expandedGalleryStickyTop +
          expandedGalleryPerimeterStageHeight / 2 -
          viewportHeight / 2,
      ),
    );
  }, [
    expandedGalleryPerimeterStageHeight,
    expandedGalleryStickyTop,
    isDesktopGallery,
    viewportHeight,
  ]);
  const expandedGalleryPerimeterTravel = useMemo(
    () =>
      Math.max(
        expandedGalleryPerimeterStepDistance,
        expandedGalleryPerimeterMaxProgress *
          expandedGalleryPerimeterStepDistance,
      ),
    [expandedGalleryPerimeterMaxProgress, expandedGalleryPerimeterStepDistance],
  );
  const expandedGalleryScrollMorphDistance = useMemo(
    () => Math.round(clampValue(420, viewportHeight * 0.52, 620)),
    [viewportHeight],
  );
  const expandedGalleryPerimeterOuterHeight = useMemo(
    () =>
      expandedGalleryPerimeterStageHeight +
      expandedGalleryStickyTop +
      expandedGalleryPerimeterTravel +
      64,
    [
      expandedGalleryPerimeterStageHeight,
      expandedGalleryStickyTop,
      expandedGalleryPerimeterTravel,
    ],
  );
  const expandedGalleryPerimeterCards = useMemo(() => {
    const sideSlots = EXPANDED_GALLERY_PERIMETER_TRACK_SLOT_COUNT;
    const centerSlots = EXPANDED_GALLERY_PERIMETER_CENTER_TRACK_SLOT_COUNT;
    const mapTrack = (images, track, slotCount, offset = 0, keySuffix = "") =>
      images
        .map((img, index) => {
          const position = index - expandedGalleryPerimeterProgress + offset;
          if (position <= -1 || position >= slotCount) return null;
          return {
            img,
            cardKey: `${img.galleryKey}:${img.id}${keySuffix}`,
            position,
            pose: resolveTrackPose(track, position),
          };
        })
        .filter(Boolean);

    const leftImages = [];
    const centerImages = [];
    const rightImages = [];
    expandedLandingPerimeterImages.forEach((img, i) => {
      const track = i % 3;
      if (track === 0) leftImages.push(img);
      else if (track === 1) centerImages.push(img);
      else rightImages.push(img);
    });

    const bottomCenterOffset = -(sideSlots - 1);

    return [
      ...mapTrack(leftImages, EXPANDED_GALLERY_PERIMETER_LEFT_TRACK, sideSlots),
      ...mapTrack(
        centerImages,
        EXPANDED_GALLERY_PERIMETER_CENTER_TRACK,
        centerSlots,
      ),
      ...mapTrack(
        centerImages,
        EXPANDED_GALLERY_PERIMETER_BOTTOM_CENTER_TRACK,
        centerSlots,
        bottomCenterOffset,
        ":btm",
      ),
      ...mapTrack(
        rightImages,
        EXPANDED_GALLERY_PERIMETER_RIGHT_TRACK,
        sideSlots,
      ),
    ];
  }, [expandedGalleryPerimeterProgress, expandedLandingPerimeterImages]);

  useEffect(() => {
    visibleSetRef.current = visibleSet;
  }, [visibleSet]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    if (!isMobileStack) {
      const resetId = window.requestAnimationFrame(() => {
        setShowStickyReachOut(false);
      });
      return () => window.cancelAnimationFrame(resetId);
    }

    let rafId = 0;
    const update = () => {
      const btn = heroReachOutButtonRef.current;
      if (!btn) {
        setShowStickyReachOut(false);
        return;
      }

      const rect = btn.getBoundingClientRect();
      setShowStickyReachOut(rect.bottom <= 0);
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isMobileStack]);

  const advanceStack = useCallback(() => {
    setDepartingIdx(visibleSetRef.current[0]);
    setVisibleSet((prev) => [
      prev[1],
      prev[2],
      (prev[2] + 1) % heroImages.length,
    ]);
    setHasInitialized(true);
  }, [heroImages.length]);

  useEffect(() => {
    if (expandedGalleryScrollMorphActive) return undefined;
    stackIntervalRef.current = setInterval(advanceStack, 12000);
    return () => clearInterval(stackIntervalRef.current);
  }, [advanceStack, expandedGalleryScrollMorphActive]);

  useEffect(() => {
    if (departingIdx === null) return;
    const t = setTimeout(() => setDepartingIdx(null), 1800);
    return () => clearTimeout(t);
  }, [departingIdx]);

  useEffect(() => {
    const nextIdx = (visibleSet[2] + 1) % heroImages.length;
    const preload = () => {
      const preloadImage = new Image();
      preloadImage.decoding = "async";
      preloadImage.src = heroImages[nextIdx].toURL();
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(preload, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(preload, 600);
    return () => window.clearTimeout(timeoutId);
  }, [visibleSet, heroImages]);

  const captureGalleryCardRects = useCallback(() => {
    if (typeof document === "undefined") return;

    const nextRects = new Map();
    document
      .querySelectorAll("[data-gallery-flow-card-key]")
      .forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        const cardKey = node.dataset.galleryFlowCardKey;
        if (!cardKey) return;

        const rect = captureDocumentRect(node.getBoundingClientRect());
        if (!rect) return;
        nextRects.set(cardKey, rect);
      });

    expandedGalleryRectsRef.current = nextRects;
  }, []);

  const removeClosingClone = useCallback(() => {
    const clone = expandedGalleryClosingCloneRef.current;
    if (!(clone instanceof HTMLElement)) return;

    const animatedNodes = Array.from(
      clone.querySelectorAll(
        '[data-gallery-card-inner="true"], [data-gallery-flow-card-key], [data-gallery-pinned="true"], button',
      ),
    );

    if (animatedNodes.length) {
      gsap.killTweensOf(animatedNodes);
    }
    gsap.killTweensOf(clone);
    clone.remove();
    expandedGalleryClosingCloneRef.current = null;
  }, []);

  const finalizeExpandedGalleryClose = useCallback(() => {
    expandedGalleryCloseMetaRef.current = null;
    expandedGalleryIsClosingRef.current = false;
    removeClosingClone();
  }, [removeClosingClone]);

  const removeOpeningClone = useCallback(() => {
    const clone = expandedGalleryOpeningCloneRef.current;
    if (!(clone instanceof HTMLElement)) return;

    gsap.killTweensOf(clone);
    clone.remove();
    expandedGalleryOpeningCloneRef.current = null;
  }, []);

  const makeGalleryCloneNonInteractive = useCallback((node) => {
    if (!(node instanceof HTMLElement)) return;

    node.style.pointerEvents = "none";
    node.setAttribute("aria-hidden", "true");
    node.inert = true;

    node.querySelectorAll("*").forEach((child) => {
      child.style.pointerEvents = "none";
    });
  }, []);

  const createOpeningCloneLayer = useCallback(() => {
    if (typeof document === "undefined") return null;

    const layer = document.createElement("div");
    layer.style.position = "fixed";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "45";
    layer.style.overflow = "hidden";
    layer.style.willChange = "opacity";

    [selectedRef.current, featuredRef.current]
      .filter((node) => node instanceof HTMLElement)
      .forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

        const clone = node.cloneNode(true);
        if (!(clone instanceof HTMLElement)) return;

        clone.style.position = "absolute";
        clone.style.left = `${rect.left}px`;
        clone.style.top = `${rect.top}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.margin = "0";
        clone.style.pointerEvents = "none";
        clone.style.transform = "none";
        makeGalleryCloneNonInteractive(clone);

        layer.appendChild(clone);
      });

    if (!layer.childElementCount) return null;

    makeGalleryCloneNonInteractive(layer);
    document.body.appendChild(layer);
    return layer;
  }, [featuredRef, makeGalleryCloneNonInteractive, selectedRef]);

  const captureInlineStyles = useCallback(
    (nodes, keys) =>
      nodes
        .filter((node) => node instanceof HTMLElement)
        .map((node) => ({
          node,
          styles: keys.reduce(
            (acc, key) => ({
              ...acc,
              [key]: node.style[key] ?? "",
            }),
            {},
          ),
        })),
    [],
  );

  const restoreInlineStyles = useCallback((records = []) => {
    records.forEach(({ node, styles }) => {
      if (!(node instanceof HTMLElement) || !styles) return;
      Object.entries(styles).forEach(([key, value]) => {
        node.style[key] = value;
      });
    });
  }, []);

  const commitExpandedGalleryCloseState = useCallback(() => {
    expandedGallerySourceRectRef.current = null;
    expandedGallerySourceInnerRef.current = null;
    expandedGalleryPremiumOpenKeyRef.current = null;
    expandedGalleryScrollCloseArmUntilRef.current = 0;
    removeOpeningClone();
    setExpandedGalleryPerimeterProgress(0);
    setExpandedGalleryPinnedRowOffset(0);
    setExpandedGalleryImage(null);
  }, [removeOpeningClone]);

  const renderExpandedGalleryScrollMorph = useCallback((nextProgress) => {
    const morph = expandedGalleryScrollMorphRef.current;
    if (!morph.active || !(morph.stageContentNode instanceof HTMLElement))
      return;

    const progress = clampValue(0, nextProgress, 1);
    morph.progress = progress;
    const eased = perimeterSnapEase(progress);
    // Perimeter clones at their original lightbox positions — clear early so the
    // hero overlay has room to morph and the new gallery can take the stage.
    const flowFade = perimeterSnapEase(
      normalizeRangeProgress(progress, 0, 0.38),
    );
    // Selected-works gallery clones at their target positions — fade IN while
    // the hero overlay is still shrinking, so the gallery morphs in beneath it.
    const previewReveal = perimeterSnapEase(
      normalizeRangeProgress(progress, 0.18, 0.82),
    );
    const stackReveal = perimeterSnapEase(
      normalizeRangeProgress(progress, 0.28, 0.85),
    );
    // Crossfade the hero clone with the real front card right at the end.
    const frontCardReveal = perimeterSnapEase(
      normalizeRangeProgress(progress, 0.72, 0.94),
    );
    const heroFade = perimeterSnapEase(
      normalizeRangeProgress(progress, 0.76, 0.97),
    );

    morph.stageContentNode.style.opacity = "0";
    morph.stageContentNode.style.willChange = "opacity";

    if (morph.layer instanceof HTMLElement) {
      morph.layer.style.opacity = "1";
      morph.layer.style.willChange = "opacity";
    }

    const stackNode = stackRef.current;
    if (stackNode instanceof HTMLElement) {
      stackNode.style.opacity = `${interpolateValue(0.24, 1, stackReveal).toFixed(3)}`;
      stackNode.style.filter = `blur(${interpolateValue(7, 0, stackReveal).toFixed(2)}px)`;
      stackNode.style.willChange = "opacity,filter";

      stackNode
        .querySelectorAll('[data-hero-stack-bg-card="true"]')
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const baseOpacity = Number.parseFloat(
            node.dataset.heroStackBaseOpacity ?? "0",
          );
          node.style.opacity = `${(baseOpacity * stackReveal).toFixed(3)}`;
          node.style.willChange = "opacity";
        });

      stackNode
        .querySelectorAll('[data-hero-stack-card="true"]')
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const position = Number.parseInt(
            node.dataset.heroStackCardPosition ?? "0",
            10,
          );
          const isFrontCard = position === STACK_COUNT - 1;
          if (isFrontCard) {
            node.style.opacity = `${frontCardReveal.toFixed(3)}`;
            node.style.willChange = "opacity";
            return;
          }
          const baseOpacity = Math.min(0.45 + position * 0.16, 0.85);
          node.style.opacity = `${interpolateValue(baseOpacity, 1, stackReveal).toFixed(3)}`;
          node.style.willChange = "opacity";
        });

      const departingNode = stackNode.querySelector(
        '[data-hero-stack-departing="true"]',
      );
      if (departingNode instanceof HTMLElement) {
        const baseOpacity = Number.parseFloat(
          departingNode.dataset.heroStackBaseOpacity ?? "1",
        );
        departingNode.style.opacity = `${interpolateValue(0, baseOpacity, stackReveal).toFixed(3)}`;
        departingNode.style.willChange = "opacity";
      }
    }

    if (morph.heroItem?.node instanceof HTMLElement) {
      const heroTargetNode =
        stackRef.current?.querySelector?.(
          `[data-hero-stack-card-position="${STACK_COUNT - 1}"]`,
        ) ?? stackRef.current;
      const heroTargetRect = heroTargetNode?.getBoundingClientRect?.();
      if (
        morph.heroItem.fromRect?.width &&
        morph.heroItem.fromRect?.height &&
        heroTargetRect?.width &&
        heroTargetRect?.height
      ) {
        setFixedRect(
          morph.heroItem.node,
          interpolateRect(morph.heroItem.fromRect, heroTargetRect, eased),
        );
        morph.heroItem.node.style.opacity = `${interpolateValue(1, 0, heroFade).toFixed(3)}`;
        morph.heroItem.node.style.willChange = "left,top,width,height,opacity";
      }
    }

    morph.flowItems.forEach(({ node, fromRect, targetRow }) => {
      if (
        !(node instanceof HTMLElement) ||
        !fromRect?.width ||
        !fromRect?.height
      )
        return;

      if (
        typeof morph.suppressedRowIndex === "number" &&
        targetRow === morph.suppressedRowIndex
      ) {
        node.style.opacity = "0";
        node.style.willChange = "opacity";
        return;
      }

      setFixedRect(node, fromRect);
      node.style.opacity = `${interpolateValue(1, 0, flowFade).toFixed(3)}`;
      node.style.filter = `blur(${interpolateValue(0, 2.5, flowFade).toFixed(2)}px)`;
      node.style.willChange = "opacity,filter";
    });

    morph.previewItems.forEach(({ node, cardKey }) => {
      if (!(node instanceof HTMLElement)) return;

      const targetRect = projectDocumentRectToViewport(
        resolveCapturedGalleryRect(expandedGalleryRectsRef.current, cardKey),
      );
      if (!(targetRect?.width && targetRect?.height)) {
        node.style.opacity = "0";
        return;
      }

      setFixedRect(node, targetRect);
      node.style.opacity = `${previewReveal.toFixed(3)}`;
      node.style.filter = `blur(${interpolateValue(4, 0, previewReveal).toFixed(2)}px)`;
      node.style.willChange = "left,top,width,height,opacity,filter";
    });
  }, []);

  const cleanupExpandedGalleryScrollMorph = useCallback(
    (options = {}) => {
      const { close = false, restoreStage = !close } = options;
      const morph = expandedGalleryScrollMorphRef.current;
      if (!morph.active) return;

      morph.animation?.cancel?.();

      restoreInlineStyles(morph.heroRestoreStyles);
      if (restoreStage) {
        restoreInlineStyles(morph.stageRestoreStyles);
      } else if (
        typeof window !== "undefined" &&
        morph.stageRestoreStyles.length
      ) {
        window.requestAnimationFrame(() =>
          restoreInlineStyles(morph.stageRestoreStyles),
        );
      }

      const layerToRemove = morph.layer;
      if (layerToRemove instanceof HTMLElement) {
        layerToRemove.style.transition = "opacity 180ms ease-out";
        layerToRemove.style.opacity = "0";
        const removeTimer = setTimeout(() => {
          layerToRemove.remove();
          if (
            expandedGalleryMorphLayerPendingRemoveRef.current?.layer ===
            layerToRemove
          ) {
            expandedGalleryMorphLayerPendingRemoveRef.current = null;
          }
        }, 200);
        expandedGalleryMorphLayerPendingRemoveRef.current = {
          layer: layerToRemove,
          timer: removeTimer,
        };
      }

      expandedGalleryScrollMorphRef.current = {
        active: false,
        progress: 0,
        distance: 0,
        heroStartTop: 0,
        heroEndTop: 0,
        animation: null,
        layer: null,
        stageContentNode: null,
        heroItem: null,
        flowItems: [],
        previewItems: [],
        suppressedRowIndex: null,
        heroRestoreStyles: [],
        stageRestoreStyles: [],
      };
      setExpandedGalleryScrollMorphActive(false);
      expandedGalleryPerimeterPostMorphRef.current = true;
    },
    [restoreInlineStyles],
  );

  const startExpandedGalleryScrollMorph = useCallback(() => {
    // Scroll-up close morph disabled: the lightbox now closes directly
    // when the user scrolls up to dismiss it (no transitional animation).
    return false;
    /* eslint-disable no-unreachable */
    if (
      expandedGalleryScrollMorphRef.current.active ||
      !expandedGalleryImageKey ||
      !isDesktopGallery ||
      !useExpandedLandingPerimeter ||
      typeof document === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    ) {
      return expandedGalleryScrollMorphRef.current.active;
    }

    const stageNode = expandedGalleryStageRef.current;
    const stageContentNode =
      stageNode?.querySelector?.('[data-gallery-stage-content="true"]') ??
      stageNode;
    const pinnedNode = expandedGalleryFixedCardRef.current;
    const pinnedInner =
      pinnedNode?.querySelector?.('[data-gallery-card-inner="true"]') ??
      pinnedNode;
    const stackNode = stackRef.current;
    const heroTargetNode =
      stackNode?.querySelector?.(
        `[data-hero-stack-card-position="${STACK_COUNT - 1}"]`,
      ) ?? stackNode;
    if (
      !(stageContentNode instanceof HTMLElement) ||
      !(pinnedNode instanceof HTMLElement) ||
      !(pinnedInner instanceof HTMLElement) ||
      !(stackNode instanceof HTMLElement) ||
      !(heroTargetNode instanceof HTMLElement)
    ) {
      return false;
    }

    const heroTargetRect = heroTargetNode.getBoundingClientRect();
    const heroEndTop = Math.round(
      clampValue(
        108,
        Math.max(expandedGalleryStickyTop - 6, viewportHeight * 0.132),
        152,
      ),
    );
    const morphDistance = Math.round(
      clampValue(
        expandedGalleryScrollMorphDistance,
        Math.max(
          Math.abs(Math.min(heroTargetRect.top, 0)) +
            heroTargetRect.height * 0.68,
          viewportHeight * 0.58,
        ),
        Math.max(expandedGalleryScrollMorphDistance, viewportHeight * 0.9),
      ),
    );

    removeClosingClone();
    removeOpeningClone();

    const pendingRemove = expandedGalleryMorphLayerPendingRemoveRef.current;
    if (pendingRemove) {
      clearTimeout(pendingRemove.timer);
      pendingRemove.layer.remove();
      expandedGalleryMorphLayerPendingRemoveRef.current = null;
    }

    const nextRects = new Map();

    let morphGridLeft = 0;
    let morphColsPerRow = 4;
    let morphGap = 32;
    let morphCardWidth = 0;
    let morphCardHeight = 0;
    let morphGridTop = 0;
    let morphGridIndex = 0;
    let heroGuideBottom = null;

    const selectedSection = selectedRef.current;
    if (selectedSection instanceof HTMLElement) {
      const sectionRect = selectedSection.getBoundingClientRect();
      const sectionStyle = window.getComputedStyle(selectedSection);
      const padLeft = parseFloat(sectionStyle.paddingLeft) || 0;
      const padRight = parseFloat(sectionStyle.paddingRight) || 0;

      morphGridLeft = sectionRect.left + padLeft;
      const gridWidth = sectionRect.width - padLeft - padRight;

      const isLg = window.innerWidth >= 1024;
      morphColsPerRow = isLg ? 4 : 2;
      morphGap = window.innerWidth >= 768 ? 32 : 8;

      morphCardWidth =
        (gridWidth - (morphColsPerRow - 1) * morphGap) / morphColsPerRow;
      morphCardHeight = morphCardWidth * 0.75;

      const heroGuide =
        stackRef.current?.querySelector?.(
          `[data-hero-stack-card-position="${STACK_COUNT - 1}"]`,
        ) ?? stackRef.current;
      const rawHeroGuideBottom = heroGuide?.getBoundingClientRect?.()?.bottom;
      heroGuideBottom = Number.isFinite(rawHeroGuideBottom)
        ? rawHeroGuideBottom
        : null;
      morphGridTop = Math.round(
        clampValue(
          360,
          heroGuideBottom !== null
            ? heroGuideBottom + 24
            : viewportHeight * 0.44,
          viewportHeight * 0.5,
        ),
      );

      ASSORTED_IMAGE_IDS.forEach((_, i) => {
        const cardKey = `selected:as-${i + 1}`;
        const col = i % morphColsPerRow;
        const row = Math.floor(i / morphColsPerRow);
        nextRects.set(cardKey, {
          left: morphGridLeft + col * (morphCardWidth + morphGap),
          top: morphGridTop + row * (morphCardHeight + morphGap),
          width: morphCardWidth,
          height: morphCardHeight,
        });
      });

      morphGridIndex = ASSORTED_IMAGE_IDS.length;
    }

    if (morphCardWidth > 0) {
      document
        .querySelectorAll("[data-gallery-flow-card-key]")
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (stageNode?.contains(node)) return;
          const cardKey = node.dataset.galleryFlowCardKey;
          if (!cardKey || nextRects.has(cardKey)) return;

          const col = morphGridIndex % morphColsPerRow;
          const row = Math.floor(morphGridIndex / morphColsPerRow);
          nextRects.set(cardKey, {
            left: morphGridLeft + col * (morphCardWidth + morphGap),
            top: morphGridTop + row * (morphCardHeight + morphGap),
            width: morphCardWidth,
            height: morphCardHeight,
          });
          morphGridIndex++;
        });
    }
    const morphRowStep = morphCardHeight + morphGap;
    const targetKeysByRow = new Map();
    const targetRowByCardKey = new Map();
    if (morphRowStep > 0) {
      Array.from(nextRects.entries())
        .map(([cardKey, rect]) => ({
          cardKey,
          rect,
          targetRow: Math.round((rect.top - morphGridTop) / morphRowStep),
        }))
        .sort((a, b) =>
          a.targetRow === b.targetRow
            ? a.rect.left - b.rect.left
            : a.targetRow - b.targetRow,
        )
        .forEach(({ cardKey, targetRow }) => {
          targetRowByCardKey.set(cardKey, targetRow);
          const rowKeys = targetKeysByRow.get(targetRow) ?? [];
          rowKeys.push(cardKey);
          targetKeysByRow.set(targetRow, rowKeys);
        });
    }
    const previewRowIndex = targetKeysByRow.has(1)
      ? 1
      : (Array.from(targetKeysByRow.keys())
          .filter((targetRow) => targetRow > 0)
          .sort((a, b) => a - b)[0] ?? 0);
    const suppressedRowIndex = previewRowIndex > 0 ? previewRowIndex - 1 : null;
    const previewRowTargetKeys = targetKeysByRow.get(previewRowIndex) ?? [];

    expandedGalleryRectsRef.current = nextRects;

    const layer = document.createElement("div");
    layer.style.position = "fixed";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "46";
    layer.style.overflow = "visible";
    layer.style.willChange = "opacity";

    const createMorphCardClone = (sourceNode, sourceRect, zIndex) => {
      if (
        !(sourceNode instanceof HTMLElement) ||
        !sourceRect?.width ||
        !sourceRect?.height
      ) {
        return null;
      }

      const overlay = document.createElement("div");
      const sourceStyles = window.getComputedStyle(sourceNode);
      overlay.style.position = "fixed";
      overlay.style.margin = "0";
      overlay.style.pointerEvents = "none";
      overlay.style.overflow = "hidden";
      overlay.style.zIndex = String(zIndex);
      overlay.style.borderRadius = sourceStyles.borderRadius;
      overlay.style.boxShadow = sourceStyles.boxShadow;
      overlay.style.background = sourceStyles.backgroundColor;
      overlay.style.willChange = "left,top,width,height,opacity,filter";
      setFixedRect(overlay, sourceRect);

      const clone = sourceNode.cloneNode(true);
      if (!(clone instanceof HTMLElement)) return null;

      // clone.querySelectorAll('button').forEach((button) => button.remove());
      clone.style.width = "100%";
      clone.style.height = "100%";
      clone.style.transform = "none";
      clone.style.opacity = "1";
      clone.style.pointerEvents = "none";
      clone.querySelectorAll("*").forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        child.style.transition = "none";
        child.style.animation = "none";
        child.style.pointerEvents = "none";
      });

      overlay.appendChild(clone);
      makeGalleryCloneNonInteractive(overlay);
      return overlay;
    };

    const heroFromRect = captureDocumentRect(
      pinnedNode.getBoundingClientRect(),
    );
    const heroOverlayNode = createMorphCardClone(pinnedInner, heroFromRect, 48);
    if (!(heroOverlayNode instanceof HTMLElement)) return false;

    const pinnedRect = pinnedNode.getBoundingClientRect();
    const pinnedCenterX = pinnedRect.left + pinnedRect.width / 2;
    const pinnedCenterY = pinnedRect.top + pinnedRect.height / 2;

    const seenCanonicalFlowKeys = new Set();
    const renderedDomFlowCardNodes = Array.from(
      stageNode.querySelectorAll("[data-gallery-flow-card-key]"),
    ).filter((node) => node instanceof HTMLElement);
    const flowItems = renderedDomFlowCardNodes
      .map((node) => {
        const inner =
          node.querySelector('[data-gallery-card-inner="true"]') ?? node;
        const fromRect = captureDocumentRect(node.getBoundingClientRect());
        if (!(inner instanceof HTMLElement) || !fromRect) return null;

        const rawCardKey = node.dataset.galleryFlowCardKey ?? "";
        const canonicalCardKey = rawCardKey.replace(/:btm$/, "");
        if (!canonicalCardKey || seenCanonicalFlowKeys.has(canonicalCardKey))
          return null;
        seenCanonicalFlowKeys.add(canonicalCardKey);
        const targetRow = targetRowByCardKey.get(canonicalCardKey) ?? null;

        const centerX = fromRect.left + fromRect.width / 2;
        const centerY = fromRect.top + fromRect.height / 2;
        const overlayNode = createMorphCardClone(inner, fromRect, 47);
        if (!(overlayNode instanceof HTMLElement)) return null;
        if (targetRow === suppressedRowIndex) {
          overlayNode.style.opacity = "0";
        }

        return {
          node: overlayNode,
          fromRect,
          cardKey: canonicalCardKey,
          edge: node.dataset.galleryEdge ?? "bottom",
          targetRow,
          distance: Math.hypot(
            centerX - pinnedCenterX,
            centerY - pinnedCenterY,
          ),
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)
      .map(({ node, fromRect, cardKey, edge, targetRow }) => ({
        node,
        fromRect,
        cardKey,
        edge,
        targetRow,
      }));
    if (useExpandedLandingPerimeter) {
      const sortedKeys = [...previewRowTargetKeys];
      const targetIndices =
        sortedKeys.length === 5 ? [0, 1, 3, 4] : sortedKeys.map((_, i) => i);
      flowItems
        .sort((a, b) => {
          if (Math.abs(a.fromRect.left - b.fromRect.left) > 20) {
            return a.fromRect.left - b.fromRect.left;
          }
          return a.fromRect.top - b.fromRect.top;
        })
        .forEach((item, index) => {
          const slotIndex = targetIndices[index] ?? index;
          if (sortedKeys[slotIndex]) {
            item.cardKey = sortedKeys[slotIndex];
            item.targetRow = previewRowIndex;
          }
        });
    }

    const previewRowLiveKeys = [];
    flowItems.forEach(({ cardKey, targetRow }) => {
      if (targetRow === previewRowIndex) {
        previewRowLiveKeys.push(cardKey);
      }
    });
    const previewCatalogByKey = new Map(
      expandedGalleryCatalogImages.map((img) => [
        `${img.galleryKey}:${img.id}`,
        img,
      ]),
    );
    const previewRowPreviewKeys = previewRowTargetKeys.filter(
      (cardKey) => !previewRowLiveKeys.includes(cardKey),
    );
    const previewItems = previewRowPreviewKeys
      .map((cardKey) => {
        const previewImage = previewCatalogByKey.get(cardKey);
        const targetRect = projectDocumentRectToViewport(
          resolveCapturedGalleryRect(nextRects, cardKey),
        );
        const imageUrl = previewImage?.cldImg?.toURL?.();
        if (
          !previewImage ||
          !imageUrl ||
          !(targetRect?.width && targetRect?.height)
        ) {
          return null;
        }

        const previewNode = document.createElement("div");
        previewNode.dataset.galleryMorphPreviewKey = cardKey;
        previewNode.style.position = "fixed";
        previewNode.style.margin = "0";
        previewNode.style.pointerEvents = "none";
        previewNode.style.overflow = "hidden";
        previewNode.style.zIndex = "46";
        previewNode.style.borderRadius = "8px";
        previewNode.style.background = "rgba(226, 232, 240, 0.2)";
        previewNode.style.boxShadow = "0 16px 32px rgba(148, 163, 184, 0.18)";
        previewNode.style.opacity = "0";
        previewNode.style.filter = "blur(3px)";
        previewNode.style.willChange = "left,top,width,height,opacity,filter";
        setFixedRect(previewNode, targetRect);

        const previewImageNode = document.createElement("img");
        previewImageNode.src = imageUrl;
        previewImageNode.alt =
          previewImage.altText ??
          `${previewImage.altLabel ?? "Selected Work"} preview`;
        previewImageNode.loading = "eager";
        previewImageNode.decoding = "async";
        previewImageNode.draggable = false;
        previewImageNode.style.width = "100%";
        previewImageNode.style.height = "100%";
        previewImageNode.style.display = "block";
        previewImageNode.style.objectFit = "cover";
        previewImageNode.style.pointerEvents = "none";
        previewNode.appendChild(previewImageNode);
        makeGalleryCloneNonInteractive(previewNode);

        return {
          node: previewNode,
          cardKey,
        };
      })
      .filter(Boolean);

    previewItems.forEach(({ node }) => {
      layer.appendChild(node);
    });
    flowItems.forEach(({ node }) => {
      layer.appendChild(node);
    });
    layer.appendChild(heroOverlayNode);
    makeGalleryCloneNonInteractive(layer);
    document.body.appendChild(layer);

    const stageRestoreStyles = captureInlineStyles(
      [stageContentNode],
      ["opacity", "pointerEvents", "willChange"],
    );
    const heroRestoreStyles = captureInlineStyles(
      [
        stackNode,
        ...stackNode.querySelectorAll('[data-hero-stack-bg-card="true"]'),
        ...stackNode.querySelectorAll('[data-hero-stack-card="true"]'),
        ...stackNode.querySelectorAll('[data-hero-stack-departing="true"]'),
      ],
      ["opacity", "filter", "willChange"],
    );

    stageContentNode.style.opacity = "0";
    stageContentNode.style.pointerEvents = "none";
    stageContentNode.style.willChange = "opacity";

    const morphProgress = { value: 0 };
    expandedGalleryScrollMorphRef.current = {
      active: true,
      progress: 0,
      distance: morphDistance,
      heroStartTop: heroTargetRect.top,
      heroEndTop,
      animation: null,
      layer,
      stageContentNode,
      heroItem: {
        node: heroOverlayNode,
        fromRect: heroFromRect,
      },
      flowItems,
      previewItems,
      suppressedRowIndex,
      heroRestoreStyles,
      stageRestoreStyles,
    };

    const animation = animate(morphProgress, {
      value: 1,
      autoplay: false,
      duration: 1000,
      ease: "linear",
      onUpdate: () => {
        renderExpandedGalleryScrollMorph(morphProgress.value);
      },
    });

    expandedGalleryScrollMorphRef.current.animation = animation;
    setExpandedGalleryScrollMorphActive(true);
    animation.seek(0);
    renderExpandedGalleryScrollMorph(0);
    return true;
    /* eslint-enable no-unreachable */
  }, [
    captureInlineStyles,
    expandedGalleryImageKey,
    expandedGalleryScrollMorphDistance,
    expandedGalleryCatalogImages,
    expandedGalleryStickyTop,
    isDesktopGallery,
    makeGalleryCloneNonInteractive,
    removeClosingClone,
    removeOpeningClone,
    renderExpandedGalleryScrollMorph,
    selectedRef,
    useExpandedLandingPerimeter,
    viewportHeight,
  ]);

  const syncExpandedGalleryScrollMorphProgress = useCallback(
    (nextProgress) => {
      const clamped = clampValue(0, nextProgress, 1);
      if (!expandedGalleryScrollMorphRef.current.active) {
        if (!startExpandedGalleryScrollMorph()) return false;
      }

      const morph = expandedGalleryScrollMorphRef.current;
      const animation = morph.animation;
      if (!animation) {
        renderExpandedGalleryScrollMorph(clamped);
        morph.progress = clamped;
        return true;
      }

      const duration =
        Number.isFinite(animation.duration) && animation.duration > 0
          ? animation.duration
          : 1000;
      animation.seek(duration * clamped);
      morph.progress = clamped;
      return true;
    },
    [renderExpandedGalleryScrollMorph, startExpandedGalleryScrollMorph],
  );

  const finalizeExpandedGalleryScrollMorphClose = useCallback(() => {
    if (!expandedGalleryScrollMorphRef.current.active) return;

    expandedGalleryIsClosingRef.current = true;
    expandedGalleryCloseMetaRef.current = null;
    expandedGallerySoftCloseRef.current = false;
    expandedGalleryRectsRef.current = new Map();
    cleanupExpandedGalleryScrollMorph({ close: true });
    commitExpandedGalleryCloseState();
    finalizeExpandedGalleryClose();
  }, [
    cleanupExpandedGalleryScrollMorph,
    commitExpandedGalleryCloseState,
    finalizeExpandedGalleryClose,
  ]);

  const completeExpandedGalleryScrollMorphClose = useCallback(() => {
    if (expandedGalleryIsClosingRef.current) {
      return expandedGalleryScrollMorphRef.current.active;
    }
    if (!expandedGalleryScrollMorphRef.current.active) {
      if (!startExpandedGalleryScrollMorph()) return false;
    }

    const morph = expandedGalleryScrollMorphRef.current;
    morph.animation?.cancel?.();

    const startProgress = clampValue(0, morph.progress ?? 0, 1);
    expandedGalleryIsClosingRef.current = true;

    if (startProgress >= 0.999) {
      renderExpandedGalleryScrollMorph(1);
      finalizeExpandedGalleryScrollMorphClose();
      return true;
    }

    const remaining = 1 - startProgress;
    const duration = Math.max(320, Math.round(260 + remaining * 520));
    const progressState = { value: startProgress };
    morph.progress = startProgress;

    const tween = animate(progressState, {
      value: 1,
      autoplay: true,
      duration,
      ease: "linear",
      onUpdate: () => {
        renderExpandedGalleryScrollMorph(progressState.value);
      },
      onComplete: () => {
        renderExpandedGalleryScrollMorph(1);
        finalizeExpandedGalleryScrollMorphClose();
      },
    });

    morph.animation = tween;
    return true;
  }, [
    finalizeExpandedGalleryScrollMorphClose,
    renderExpandedGalleryScrollMorph,
    startExpandedGalleryScrollMorph,
  ]);

  const closeExpandedGalleryImage = useCallback(
    (options = {}) => {
      const { reason = "explicit" } = options;

      if (!expandedGalleryImageKey || expandedGalleryIsClosingRef.current)
        return;

      if (expandedGalleryScrollMorphRef.current.active) {
        if (completeExpandedGalleryScrollMorphClose()) return;
        finalizeExpandedGalleryScrollMorphClose();
        return;
      }

      if (
        !isDesktopGallery ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
      ) {
        removeClosingClone();
        expandedGalleryCloseMetaRef.current = null;
        expandedGallerySoftCloseRef.current = false;
        captureGalleryCardRects();
        commitExpandedGalleryCloseState();
        expandedGalleryIsClosingRef.current = false;
        return;
      }

      const stageNode = expandedGalleryStageRef.current;
      const stageContentNode =
        stageNode?.querySelector?.('[data-gallery-stage-content="true"]') ??
        stageNode;
      const pinnedNode = expandedGalleryFixedCardRef.current;
      const pinnedInner =
        pinnedNode?.querySelector?.('[data-gallery-card-inner="true"]') ??
        pinnedNode;

      if (!(stageContentNode instanceof HTMLElement)) {
        removeClosingClone();
        expandedGalleryCloseMetaRef.current = null;
        expandedGallerySoftCloseRef.current = false;
        commitExpandedGalleryCloseState();
        expandedGalleryIsClosingRef.current = false;
        return;
      }

      const stageRect = stageContentNode.getBoundingClientRect();
      const closingClone = stageContentNode.cloneNode(true);
      if (!(closingClone instanceof HTMLElement)) {
        removeClosingClone();
        expandedGalleryCloseMetaRef.current = null;
        expandedGallerySoftCloseRef.current = false;
        commitExpandedGalleryCloseState();
        expandedGalleryIsClosingRef.current = false;
        return;
      }

      removeClosingClone();
      removeOpeningClone();
      closingClone.style.position = "fixed";
      closingClone.style.left = `${stageRect.left}px`;
      closingClone.style.top = `${stageRect.top}px`;
      closingClone.style.width = `${stageRect.width}px`;
      closingClone.style.height = `${stageRect.height}px`;
      closingClone.style.margin = "0";
      closingClone.style.pointerEvents = "none";
      closingClone.style.zIndex = "45";
      closingClone.style.willChange = "opacity,transform";
      makeGalleryCloneNonInteractive(closingClone);
      document.body.appendChild(closingClone);
      expandedGalleryClosingCloneRef.current = closingClone;

      expandedGalleryIsClosingRef.current = true;
      const shouldUsePerimeterClose =
        useExpandedLandingPerimeter && reason === "explicit";
      expandedGalleryCloseMetaRef.current = {
        mode: shouldUsePerimeterClose ? "landing-perimeter" : "soft",
        selectedCardKey: expandedGalleryImageKey,
      };

      gsap.killTweensOf(stageContentNode);
      if (pinnedInner instanceof HTMLElement) {
        gsap.killTweensOf(pinnedInner);
      }

      if (shouldUsePerimeterClose) {
        expandedGalleryRectsRef.current = new Map();
        expandedGallerySoftCloseRef.current = false;
        commitExpandedGalleryCloseState();
        return;
      }

      captureGalleryCardRects();
      expandedGallerySoftCloseRef.current = true;
      commitExpandedGalleryCloseState();

      gsap.to(closingClone, {
        opacity: 0,
        scale: 0.992,
        y: 8,
        duration: EXPANDED_GALLERY_SOFT_CLOSE_DURATION,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: finalizeExpandedGalleryClose,
      });
    },
    [
      captureGalleryCardRects,
      completeExpandedGalleryScrollMorphClose,
      expandedGalleryImageKey,
      finalizeExpandedGalleryScrollMorphClose,
      finalizeExpandedGalleryClose,
      isDesktopGallery,
      makeGalleryCloneNonInteractive,
      removeClosingClone,
      removeOpeningClone,
      commitExpandedGalleryCloseState,
      useExpandedLandingPerimeter,
    ],
  );

  const handleExpandedGalleryBackdropClick = useCallback(
    (e) => {
      if (!expandedGalleryImageKey || !isDesktopGallery) return;

      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-gallery-card-key]")) return;

      closeExpandedGalleryImage();
    },
    [closeExpandedGalleryImage, expandedGalleryImageKey, isDesktopGallery],
  );

  useEffect(() => {
    if (expandedGalleryImageKey && isDesktopGallery) return undefined;
    if (!expandedGalleryScrollMorphRef.current.active) return undefined;
    const rafId = window.requestAnimationFrame(() => {
      cleanupExpandedGalleryScrollMorph();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [
    cleanupExpandedGalleryScrollMorph,
    expandedGalleryImageKey,
    isDesktopGallery,
  ]);

  useEffect(
    () => () => {
      cleanupExpandedGalleryScrollMorph();
    },
    [cleanupExpandedGalleryScrollMorph],
  );

  const closeMobileLightbox = useCallback(() => {
    mobileLightboxTouchStartRef.current = null;
    setMobileLightbox(null);
  }, []);

  const navigateMobileLightbox = useCallback((direction) => {
    setMobileLightbox((prev) => {
      if (!prev || prev.images.length < 2) return prev;

      const nextIndex =
        (prev.index + direction + prev.images.length) % prev.images.length;
      return { ...prev, index: nextIndex };
    });
  }, []);

  const openMobileLightbox = useCallback((images, index, e) => {
    if (!Array.isArray(images) || !images.length) return;

    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

    outer.style.zIndex = "";
    gsap.killTweensOf(inner);
    gsap.set(inner, { scale: 1 });

    mobileLightboxTouchStartRef.current = null;
    setMobileLightbox({
      images,
      index: clampValue(0, index, images.length - 1),
    });
  }, []);

  const handleGalleryImageClick = useCallback(
    (galleryKey, imageId, e) => {
      const nextImageKey = `${galleryKey}:${imageId}`;
      const outer = e.currentTarget;
      const inner =
        outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;
      const rect = inner?.getBoundingClientRect?.();
      const shouldTrackExpandedSource =
        !hasExpandedGalleryImage && isDesktopGallery;
      const shouldUseClockwisePerimeterSwap =
        hasExpandedGalleryImage && isDesktopGallery;

      if (expandedGalleryIsClosingRef.current) {
        finalizeExpandedGalleryClose();
      }

      if (expandedGalleryScrollMorphRef.current.active) {
        cleanupExpandedGalleryScrollMorph({ close: true });
      }

      if (expandedGalleryImageKey === nextImageKey) {
        closeExpandedGalleryImage();
        return;
      }

      outer.style.zIndex = "";
      gsap.killTweensOf(inner);
      gsap.set(inner, { scale: 1 });

      if (shouldTrackExpandedSource && rect?.width && rect?.height) {
        expandedGallerySourceRectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        };
      } else {
        expandedGallerySourceRectRef.current = null;
      }

      // Once the desktop lightbox is already open, keep the hero anchored and
      // transition the image layers instead of replaying the full source-card morph.
      expandedGallerySourceInnerRef.current = shouldTrackExpandedSource
        ? inner
        : null;
      expandedGalleryPerimeterClockwiseSwapRef.current =
        shouldUseClockwisePerimeterSwap;
      expandedGallerySourceScrollRef.current = {
        x: typeof window !== "undefined" ? window.scrollX : 0,
        y: typeof window !== "undefined" ? window.scrollY : 0,
      };

      removeOpeningClone();
      const shouldUsePremiumOpen =
        !hasExpandedGalleryImage &&
        isDesktopGallery &&
        !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

      const openingClone = shouldUsePremiumOpen
        ? createOpeningCloneLayer()
        : null;

      expandedGalleryPremiumOpenKeyRef.current = shouldUsePremiumOpen
        ? nextImageKey
        : null;

      if (openingClone instanceof HTMLElement) {
        expandedGalleryOpeningCloneRef.current = openingClone;
      }

      captureGalleryCardRects();
      setExpandedGalleryPerimeterProgress(0);
      setExpandedGalleryPinnedRowOffset(0);
      expandedGalleryWasVisibleRef.current = true;
      expandedGalleryScrollCloseArmUntilRef.current =
        Date.now() + EXPANDED_GALLERY_SCROLL_CLOSE_ARM_DELAY_MS;
      expandedGallerySoftCloseRef.current = false;
      expandedGalleryIsClosingRef.current = false;
      expandedGalleryPerimeterFreshOpenRef.current = isDesktopGallery;
      setExpandedGalleryImage({ galleryKey, imageId });
    },
    [
      captureGalleryCardRects,
      cleanupExpandedGalleryScrollMorph,
      closeExpandedGalleryImage,
      createOpeningCloneLayer,
      expandedGalleryImageKey,
      finalizeExpandedGalleryClose,
      hasExpandedGalleryImage,
      isDesktopGallery,
      removeOpeningClone,
    ],
  );

  const handleGalleryCardActivate = useCallback(
    (images, galleryKey, imageId, index, e) => {
      if (isDesktopGallery) {
        handleGalleryImageClick(galleryKey, imageId, e);
        return;
      }

      openMobileLightbox(images, index, e);
    },
    [handleGalleryImageClick, isDesktopGallery, openMobileLightbox],
  );

  const handleMobileLightboxTouchStart = useCallback(
    (e) => {
      if (!mobileLightbox) return;
      const touch = e.touches[0];
      if (!touch) return;

      const drag = mobileLightboxDragRef.current;
      const now = Date.now();
      drag.isDragging = true;
      drag.startX = touch.clientX;
      drag.startY = touch.clientY;
      drag.startTime = now;
      drag.lastX = touch.clientX;
      drag.lastTime = now;
      drag.horizontal = null;
      drag.width = window.innerWidth;

      mobileLightboxTouchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      if (mobileLightboxTrackRef.current) {
        gsap.killTweensOf(mobileLightboxTrackRef.current);
      }
    },
    [mobileLightbox],
  );

  const handleMobileLightboxTouchMove = useCallback(
    (e) => {
      if (!mobileLightbox) return;
      const drag = mobileLightboxDragRef.current;
      if (!drag.isDragging) return;
      const touch = e.touches[0];
      if (!touch) return;

      const dx = touch.clientX - drag.startX;
      const dy = touch.clientY - drag.startY;

      if (drag.horizontal === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        drag.horizontal = Math.abs(dx) > Math.abs(dy);
      }

      if (!drag.horizontal) return;

      drag.lastX = touch.clientX;
      drag.lastTime = Date.now();

      const idx = mobileLightbox.index;
      const total = mobileLightbox.images.length;
      let appliedDx = dx;
      if (dx > 0 && idx === 0) appliedDx = dx * 0.32;
      if (dx < 0 && idx === total - 1) appliedDx = dx * 0.32;

      if (mobileLightboxTrackRef.current) {
        gsap.set(mobileLightboxTrackRef.current, { x: appliedDx });
      }
    },
    [mobileLightbox],
  );

  const handleMobileLightboxTouchEnd = useCallback(
    (e) => {
      if (!mobileLightbox) return;
      const drag = mobileLightboxDragRef.current;
      if (!drag.isDragging) {
        mobileLightboxTouchStartRef.current = null;
        return;
      }
      drag.isDragging = false;

      const startEntry = mobileLightboxTouchStartRef.current;
      mobileLightboxTouchStartRef.current = null;
      if (!startEntry) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const totalDx = touch.clientX - drag.startX;
      const totalDy = touch.clientY - drag.startY;

      // Tap (no horizontal movement) → no navigation
      if (
        drag.horizontal === false ||
        (Math.abs(totalDx) < 6 && Math.abs(totalDy) < 6)
      ) {
        if (mobileLightboxTrackRef.current) {
          gsap.set(mobileLightboxTrackRef.current, { x: 0 });
        }
        return;
      }

      const W = drag.width || window.innerWidth;
      const dt = Date.now() - drag.startTime;
      const velocity = dt > 0 ? totalDx / dt : 0; // px per ms
      const idx = mobileLightbox.index;
      const total = mobileLightbox.images.length;

      let direction = 0;
      if ((totalDx < -W * 0.22 || velocity < -0.45) && idx < total - 1) {
        direction = 1;
      } else if ((totalDx > W * 0.22 || velocity > 0.45) && idx > 0) {
        direction = -1;
      }

      const targetX = direction === 0 ? 0 : -direction * W;

      gsap.to(mobileLightboxTrackRef.current, {
        x: targetX,
        duration: 0.42,
        ease: "cubic-bezier(0.32, 0.72, 0, 1)",
        onComplete: () => {
          if (direction === 0) return;
          mobileLightboxJustSwipedRef.current = true;
          setMobileLightbox((prev) =>
            prev
              ? {
                  ...prev,
                  index: clampValue(0, prev.index + direction, prev.images.length - 1),
                }
              : prev,
          );
        },
      });
    },
    [mobileLightbox],
  );

  useLayoutEffect(() => {
    if (!mobileLightboxJustSwipedRef.current) return;
    mobileLightboxJustSwipedRef.current = false;
    if (mobileLightboxTrackRef.current) {
      gsap.set(mobileLightboxTrackRef.current, { x: 0 });
    }
  }, [mobileLightbox?.index]);

  const handleCardEnter = useCallback((e) => {
    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

    if (outer.dataset.galleryFeatured === "true") return;

    outer.style.zIndex = "10";
    gsap.to(inner, {
      scale: 1.025,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, []);

  const handleCardLeave = useCallback((e) => {
    const outer = e.currentTarget;
    const inner =
      outer?.querySelector?.('[data-gallery-card-inner="true"]') ?? outer;

    if (outer.dataset.galleryFeatured === "true") {
      gsap.killTweensOf(inner);
      gsap.set(inner, { scale: 1 });
      outer.style.zIndex = "";
      return;
    }

    gsap.to(inner, {
      scale: 1,
      duration: 0.3,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => {
        outer.style.zIndex = "";
      },
    });
  }, []);

  const getExpandedGalleryOpenScrollBias = useCallback((shouldApply = true) => {
    if (!shouldApply || typeof window === "undefined") return 0;

    const sourceRect = expandedGallerySourceRectRef.current;
    if (!sourceRect) return 0;

    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const threshold = window.innerHeight * 0.34;
    if (!Number.isFinite(sourceCenterY) || sourceCenterY >= threshold) return 0;

    const maxBias = Math.round(clampValue(28, window.innerHeight * 0.08, 72));
    const biasProgress =
      1 - normalizeRangeProgress(sourceCenterY, 0, threshold);

    return Math.round(interpolateValue(0, maxBias, biasProgress));
  }, []);
  const scrollExpandedGalleryViewport = useCallback(
    (top, behavior = "auto") => {
      if (!Number.isFinite(top) || typeof window === "undefined") return;

      if (lenis) {
        lenis.scrollTo(top, {
          immediate: behavior !== "smooth",
          force: true,
        });
        return;
      }

      window.scrollTo({ top, behavior });
    },
    [lenis],
  );

  const resolveExpandedLandingPerimeterStartScrollTop = useCallback(() => {
    if (typeof window === "undefined") return null;

    const stageNode = expandedGalleryStageRef.current;
    if (!(stageNode instanceof HTMLElement)) return null;

    const rect = stageNode.getBoundingClientRect();
    const targetTop =
      expandedGalleryStickyTop - expandedGalleryPerimeterVerticalShift;
    if (!Number.isFinite(rect.top) || !Number.isFinite(targetTop)) return null;

    const computedStartScrollTop = Math.max(
      0,
      window.scrollY + rect.top - targetTop,
    );
    return computedStartScrollTop;
  }, [expandedGalleryPerimeterVerticalShift, expandedGalleryStickyTop]);
  const alignExpandedLandingPerimeterForOpen = useCallback(() => {
    if (typeof window === "undefined") return;

    const nextScrollTop = resolveExpandedLandingPerimeterStartScrollTop();
    const shouldAlignToPerimeterStart =
      Number.isFinite(nextScrollTop) &&
      Math.abs(nextScrollTop - window.scrollY) > 1;
    if (shouldAlignToPerimeterStart) {
      scrollExpandedGalleryViewport(nextScrollTop, "auto");
    }

    const expandedCard =
      expandedGalleryFixedCardRef.current ??
      document.querySelector(
        `[data-gallery-card-key="${expandedGalleryImageKey}"]`,
      );
    const closeButton = expandedCard?.querySelector?.("button");

    if (!(closeButton instanceof HTMLElement)) return;

    const closeRect = closeButton.getBoundingClientRect();
    const stageNode = expandedGalleryStageRef.current;
    const stageContentNode =
      stageNode?.querySelector?.('[data-gallery-stage-content="true"]') ??
      stageNode;
    if (
      stageContentNode instanceof HTMLElement &&
      !expandedGalleryScrollMorphRef.current.active &&
      window.getComputedStyle(stageContentNode).pointerEvents === "none"
    ) {
      stageContentNode.style.pointerEvents = "auto";
    }
    const shouldSkipCloseButtonCorrection =
      !Number.isFinite(closeRect.top) ||
      closeRect.top >= EXPANDED_GALLERY_PERIMETER_CLOSE_BUTTON_SAFE_TOP;
    const correctedScrollTop = shouldSkipCloseButtonCorrection
      ? null
      : Math.max(
          0,
          window.scrollY +
            closeRect.top -
            EXPANDED_GALLERY_PERIMETER_CLOSE_BUTTON_SAFE_TOP,
        );
    const shouldApplyCloseButtonCorrection =
      Number.isFinite(correctedScrollTop) &&
      Math.abs(correctedScrollTop - window.scrollY) > 1;

    if (shouldApplyCloseButtonCorrection) {
      scrollExpandedGalleryViewport(correctedScrollTop, "auto");
    }
  }, [
    expandedGalleryPerimeterVerticalShift,
    expandedGalleryImageKey,
    expandedGalleryStickyTop,
    scrollExpandedGalleryViewport,
    resolveExpandedLandingPerimeterStartScrollTop,
  ]);

  useLayoutEffect(() => {
    if (!expandedGalleryImageKey) {
      expandedGalleryWasOpenRef.current = false;
      return undefined;
    }

    const wasOpen = expandedGalleryWasOpenRef.current;
    expandedGalleryWasOpenRef.current = true;

    const scrollExpandedTargetIntoView = () => {
      const shouldAlignPerimeterStart =
        isDesktopGallery &&
        useExpandedLandingPerimeter &&
        expandedGalleryPerimeterFreshOpenRef.current;

      if (shouldAlignPerimeterStart) {
        alignExpandedLandingPerimeterForOpen();
        return;
      }

      const openingScrollBias = wasOpen
        ? 0
        : getExpandedGalleryOpenScrollBias(true);

      const expandedCard =
        expandedGalleryFixedCardRef.current ??
        document.querySelector(
          `[data-gallery-card-key="${expandedGalleryImageKey}"]`,
        );

      if (isDesktopGallery && expandedCard instanceof HTMLElement) {
        const rect = expandedCard.getBoundingClientRect();
        const nextScrollTop = resolveScrollTopToRevealRect(rect, {
          topInset: expandedGalleryStickyTop,
          topBias: openingScrollBias,
        });

        const willScroll =
          Number.isFinite(nextScrollTop) &&
          Math.abs(nextScrollTop - window.scrollY) > 1;
        if (willScroll) {
          scrollExpandedGalleryViewport(
            nextScrollTop,
            wasOpen ? "smooth" : "auto",
          );
        }
        return;
      }

      if (isDesktopGallery) {
        const stageNode = expandedGalleryStageRef.current;
        const stageContentNode =
          stageNode?.querySelector?.('[data-gallery-stage-content="true"]') ??
          stageNode;

        if (stageContentNode instanceof HTMLElement) {
          const rect = stageContentNode.getBoundingClientRect();
          const nextScrollTop = resolveScrollTopToRevealRect(rect, {
            topInset: expandedGalleryStickyTop,
            topBias: openingScrollBias,
          });
          const willScroll =
            Number.isFinite(nextScrollTop) &&
            Math.abs(nextScrollTop - window.scrollY) > 1;

          if (willScroll) {
            scrollExpandedGalleryViewport(
              nextScrollTop,
              wasOpen ? "smooth" : "auto",
            );
          }
          return;
        }
      }

      expandedCard?.scrollIntoView({
        behavior: wasOpen ? "smooth" : "auto",
        block: "center",
        inline: "center",
      });
    };

    scrollExpandedTargetIntoView();
    return undefined;
  }, [
    expandedGalleryImageKey,
    alignExpandedLandingPerimeterForOpen,
    expandedGalleryStickyTop,
    getExpandedGalleryOpenScrollBias,
    isDesktopGallery,
    scrollExpandedGalleryViewport,
    useExpandedLandingPerimeter,
    selectedRef,
  ]);

  useEffect(() => {
    if (!expandedGalleryImageKey) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeExpandedGalleryImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeExpandedGalleryImage, expandedGalleryImageKey]);

  useEffect(() => {
    if (isDesktopGallery || !expandedGalleryImageKey) return undefined;

    const id = requestAnimationFrame(() => closeExpandedGalleryImage());
    return () => cancelAnimationFrame(id);
  }, [closeExpandedGalleryImage, expandedGalleryImageKey, isDesktopGallery]);

  useEffect(() => {
    if (!isDesktopGallery || !mobileLightbox) return undefined;

    const id = requestAnimationFrame(() => closeMobileLightbox());
    return () => cancelAnimationFrame(id);
  }, [closeMobileLightbox, isDesktopGallery, mobileLightbox]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const docEl = document.documentElement;

    if (mobileLightbox) {
      docEl.setAttribute("data-lightbox-open", "");
    } else {
      docEl.removeAttribute("data-lightbox-open");
    }

    return () => {
      docEl.removeAttribute("data-lightbox-open");
    };
  }, [mobileLightbox]);

  useEffect(() => {
    if (!mobileLightbox) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileLightbox();
        return;
      }

      if (mobileLightbox.images.length < 2) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateMobileLightbox(1);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateMobileLightbox(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileLightbox, mobileLightbox, navigateMobileLightbox]);

  useEffect(() => {
    if (!mobileLightbox) return undefined;

    const docEl = document.documentElement;
    const body = document.body;
    const savedScrollY = window.scrollY;
    const scrollBarGap = window.innerWidth - docEl.clientWidth;

    const prevDocOverflow = docEl.style.overflow;
    const prevDocOverscrollBehavior = docEl.style.overscrollBehavior;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const prevBodyPaddingRight = body.style.paddingRight;
    const prevBodyOverscrollBehavior = body.style.overscrollBehavior;

    docEl.style.overflow = "hidden";
    docEl.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.width = "100%";
    body.style.overscrollBehavior = "none";
    if (scrollBarGap > 0) {
      body.style.paddingRight = `${scrollBarGap}px`;
    }

    return () => {
      docEl.style.overflow = prevDocOverflow;
      docEl.style.overscrollBehavior = prevDocOverscrollBehavior;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      body.style.paddingRight = prevBodyPaddingRight;
      body.style.overscrollBehavior = prevBodyOverscrollBehavior;
      window.scrollTo(0, savedScrollY);
    };
  }, [mobileLightbox]);

  useEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery) return undefined;

    const node = expandedGalleryFixedCardRef.current;
    if (!node) return undefined;

    const updatePinSize = () => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      setExpandedGalleryPinSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updatePinSize();

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => updatePinSize());

    resizeObserver?.observe(node);
    window.addEventListener("resize", updatePinSize, { passive: true });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePinSize);
    };
  }, [expandedGalleryImageKey, isDesktopGallery]);

  useEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery) {
      expandedGalleryWasVisibleRef.current = false;
      return undefined;
    }

    let rafId = 0;
    let armTimeoutId = 0;
    let lastScrollY = window.scrollY;
    let hasReachedTopAnchor = false;
    let isClosingStage = false;
    let isScrollCloseArmed = false;
    let hadUpwardScrollBeforeArm = false;
    let didPrestartMorphFromWheel = false;
    let morphPrestartTimestamp = 0;
    let accumulatedWheelUpDelta = 0;
    let lastWheelUpTimestamp = 0;
    const checkStageVisibility = () => {
      rafId = 0;
      if (isClosingStage) return;

      const node = expandedGalleryStageRef.current ?? selectedRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const upwardScrollDelta = Math.max(0, lastScrollY - currentScrollY);
      const scrollCloseDistance = clampValue(
        96,
        window.innerHeight * 0.18,
        180,
      );
      const topOverscroll = rect.top - expandedGalleryStickyTop;
      const perimeterMorphStartTop =
        expandedGalleryStickyTop - expandedGalleryPerimeterVerticalShift;
      const perimeterTopOverscroll = rect.top - perimeterMorphStartTop;
      const topAnchorThreshold = useExpandedLandingPerimeter
        ? perimeterMorphStartTop + 2
        : expandedGalleryStickyTop + 2;
      const hasPassedTopAnchor = useExpandedLandingPerimeter
        ? perimeterTopOverscroll > 0
        : topOverscroll > 0;

      if (!isScrollCloseArmed && isScrollingUp) {
        hadUpwardScrollBeforeArm = true;
      }

      if (isVisible) {
        expandedGalleryWasVisibleRef.current = true;
      }

      if (
        rect.top <= topAnchorThreshold ||
        (expandedGalleryWasVisibleRef.current &&
          hasPassedTopAnchor &&
          (isScrollingUp || hadUpwardScrollBeforeArm))
      ) {
        hasReachedTopAnchor = true;
      }

      const shouldForceTopMorphClose =
        useExpandedLandingPerimeter &&
        hasReachedTopAnchor &&
        currentScrollY <= 4;

      lastScrollY = currentScrollY;

      if (!isScrollCloseArmed) return;

      if (isVisible) {
        const skipMorphDelta = clampValue(20, window.innerHeight * 0.03, 48);
        const shouldSkipMorph =
          isScrollingUp &&
          hasReachedTopAnchor &&
          upwardScrollDelta >= skipMorphDelta;

        if (shouldSkipMorph && expandedGalleryScrollMorphRef.current.active) {
          didPrestartMorphFromWheel = false;
          isClosingStage = true;
          if (!completeExpandedGalleryScrollMorphClose()) {
            closeExpandedGalleryImage({ reason: "explicit" });
          }
          return;
        }

        const perimeterMorphLeadDistance = clampValue(
          48,
          window.innerHeight * 0.06,
          96,
        );
        const isPerimeterMorphRegion =
          useExpandedLandingPerimeter &&
          hasReachedTopAnchor &&
          perimeterTopOverscroll > -perimeterMorphLeadDistance;
        const morphIsActive = expandedGalleryScrollMorphRef.current.active;
        const hasMorphScrollIntent = isScrollingUp || hadUpwardScrollBeforeArm;

        if (
          isPerimeterMorphRegion &&
          (morphIsActive || hasMorphScrollIntent) &&
          !shouldSkipMorph
        ) {
          didPrestartMorphFromWheel = false;
          if (!morphIsActive) {
            if (isScrollingDown) return;
            startExpandedGalleryScrollMorph();
          }
          const morphState = expandedGalleryScrollMorphRef.current;
          const heroTargetNode =
            stackRef.current?.querySelector?.(
              `[data-hero-stack-card-position="${STACK_COUNT - 1}"]`,
            ) ?? stackRef.current;
          const heroTargetTop = heroTargetNode?.getBoundingClientRect?.().top;
          const morphProgress = Number.isFinite(heroTargetTop)
            ? normalizeRangeProgress(
                heroTargetTop,
                morphState.heroStartTop,
                morphState.heroEndTop,
              )
            : clampValue(
                0,
                perimeterTopOverscroll /
                  (morphState.distance || expandedGalleryScrollMorphDistance),
                1,
              );
          const didSyncMorph =
            syncExpandedGalleryScrollMorphProgress(morphProgress);

          if (didSyncMorph) {
            if (morphProgress >= 0.94 || shouldForceTopMorphClose) {
              isClosingStage = true;
              completeExpandedGalleryScrollMorphClose();
            } else if (isScrollingDown && morphProgress <= 0.02) {
              syncExpandedGalleryScrollMorphProgress(0);
              cleanupExpandedGalleryScrollMorph();
            }
            return;
          }
        }

        if (expandedGalleryScrollMorphRef.current.active) {
          if (
            didPrestartMorphFromWheel &&
            !isScrollingDown &&
            hasMorphScrollIntent &&
            useExpandedLandingPerimeter
          ) {
            const prestartAge = performance.now() - morphPrestartTimestamp;
            if (
              prestartAge >= 80 ||
              (hasReachedTopAnchor && topOverscroll >= scrollCloseDistance)
            ) {
              didPrestartMorphFromWheel = false;
              isClosingStage = true;
              if (!completeExpandedGalleryScrollMorphClose()) {
                closeExpandedGalleryImage({ reason: "explicit" });
              }
            }
            return;
          }
          didPrestartMorphFromWheel = false;
          syncExpandedGalleryScrollMorphProgress(0);
          cleanupExpandedGalleryScrollMorph();
        }

        if (
          hasReachedTopAnchor &&
          isScrollingUp &&
          topOverscroll >= scrollCloseDistance
        ) {
          isClosingStage = true;
          if (!completeExpandedGalleryScrollMorphClose()) {
            closeExpandedGalleryImage({ reason: "scroll" });
          }
        }

        if (isScrollingDown && rect.bottom <= window.innerHeight + 2) {
          isClosingStage = true;
          closeExpandedGalleryImage({ reason: "scroll" });
        }

        return;
      }

      if (
        shouldForceTopMorphClose &&
        completeExpandedGalleryScrollMorphClose()
      ) {
        isClosingStage = true;
        return;
      }

      if (!expandedGalleryWasVisibleRef.current) {
        if (expandedGalleryScrollMorphRef.current.active) {
          syncExpandedGalleryScrollMorphProgress(0);
          cleanupExpandedGalleryScrollMorph();
        }
        return;
      }

      isClosingStage = true;
      if (!completeExpandedGalleryScrollMorphClose()) {
        if (expandedGalleryScrollMorphRef.current.active) {
          syncExpandedGalleryScrollMorphProgress(0);
          cleanupExpandedGalleryScrollMorph();
        }
        closeExpandedGalleryImage({ reason: "scroll" });
      }
    };

    const queueCheck = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(checkStageVisibility);
    };

    const handleWheelMorphPrestart = (event) => {
      if (
        event.deltaY >= 0 ||
        !isScrollCloseArmed ||
        isClosingStage ||
        !useExpandedLandingPerimeter ||
        expandedGalleryScrollMorphRef.current.active
      ) {
        if (event.deltaY >= 0) {
          accumulatedWheelUpDelta = 0;
        }
        return;
      }

      const now = performance.now();
      if (now - lastWheelUpTimestamp > 120) accumulatedWheelUpDelta = 0;
      accumulatedWheelUpDelta += Math.abs(event.deltaY);
      lastWheelUpTimestamp = now;

      const fastWheelThreshold = clampValue(50, window.innerHeight * 0.07, 120);
      if (accumulatedWheelUpDelta >= fastWheelThreshold) return;

      const node = expandedGalleryStageRef.current ?? selectedRef.current;
      if (!(node instanceof HTMLElement)) return;

      const rect = node.getBoundingClientRect();
      const isStageVisible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!isStageVisible) return;

      const perimeterMorphStartTop =
        expandedGalleryStickyTop - expandedGalleryPerimeterVerticalShift;
      const perimeterMorphLeadDistance = clampValue(
        48,
        window.innerHeight * 0.06,
        96,
      );
      const predictedTop = rect.top - event.deltaY;
      const predictedPerimeterOverscroll =
        predictedTop - perimeterMorphStartTop;

      if (predictedPerimeterOverscroll <= -perimeterMorphLeadDistance) return;

      hadUpwardScrollBeforeArm = true;
      expandedGalleryWasVisibleRef.current = true;
      hasReachedTopAnchor = true;
      morphPrestartTimestamp = performance.now();
      didPrestartMorphFromWheel =
        startExpandedGalleryScrollMorph() || didPrestartMorphFromWheel;
      queueCheck();
    };

    const armScrollClose = () => {
      if (isClosingStage) return;

      if (!hadUpwardScrollBeforeArm && window.scrollY < lastScrollY) {
        hadUpwardScrollBeforeArm = true;
      }

      if (window.scrollY <= 4) {
        hasReachedTopAnchor = true;
      }

      isScrollCloseArmed = true;
      lastScrollY = window.scrollY;
      queueCheck();
    };

    window.addEventListener("scroll", queueCheck, { passive: true });
    window.addEventListener("wheel", handleWheelMorphPrestart, {
      passive: true,
    });
    window.addEventListener("resize", queueCheck, { passive: true });
    const armDelay = Math.max(
      0,
      expandedGalleryScrollCloseArmUntilRef.current - Date.now(),
    );
    if (armDelay > 0) {
      armTimeoutId = window.setTimeout(armScrollClose, armDelay);
    } else {
      armScrollClose();
    }

    return () => {
      window.removeEventListener("scroll", queueCheck);
      window.removeEventListener("wheel", handleWheelMorphPrestart);
      window.removeEventListener("resize", queueCheck);
      if (armTimeoutId) window.clearTimeout(armTimeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    cleanupExpandedGalleryScrollMorph,
    closeExpandedGalleryImage,
    expandedGalleryImageKey,
    expandedGalleryPerimeterVerticalShift,
    expandedGalleryScrollMorphDistance,
    expandedGalleryStickyTop,
    finalizeExpandedGalleryScrollMorphClose,
    isDesktopGallery,
    selectedRef,
    startExpandedGalleryScrollMorph,
    completeExpandedGalleryScrollMorphClose,
    syncExpandedGalleryScrollMorphProgress,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    if (
      !expandedGalleryImageKey ||
      !isDesktopGallery ||
      !useExpandedLandingPerimeter ||
      expandedGalleryScrollMorphActive
    ) {
      return undefined;
    }
    if (!expandedGalleryPerimeterMaxProgress) {
      return undefined;
    }

    const stageNode = expandedGalleryStageRef.current;
    if (!stageNode) return undefined;

    const snap = expandedGalleryPerimeterSnapRef.current;
    let scrollRafId = 0;
    let settleTimeoutId = 0;
    let initialTrackingTimeoutId = 0;
    let trackingStarted = false;
    let baselineTravel = 0;
    const LERP_SPEED = 0.18;
    const SNAP_SETTLE_DELAY = 140;

    const tick = () => {
      const diff = snap.target - snap.current;

      if (Math.abs(diff) < 0.003) {
        snap.current = snap.target;
        snap.animId = 0;
        setExpandedGalleryPerimeterProgress((prev) =>
          Math.abs(prev - snap.current) < 0.001 ? prev : snap.current,
        );
        return;
      }

      snap.current += diff * LERP_SPEED;
      setExpandedGalleryPerimeterProgress((prev) =>
        Math.abs(prev - snap.current) < 0.001 ? prev : snap.current,
      );
      snap.animId = window.requestAnimationFrame(tick);
    };

    const ensureAnimating = () => {
      if (!snap.animId) {
        snap.animId = window.requestAnimationFrame(tick);
      }
    };

    const setImmediateProgress = (nextProgress) => {
      if (snap.animId) {
        window.cancelAnimationFrame(snap.animId);
        snap.animId = 0;
      }
      snap.current = nextProgress;
      snap.target = nextProgress;
      setExpandedGalleryPerimeterProgress((prev) =>
        Math.abs(prev - nextProgress) < 0.001 ? prev : nextProgress,
      );
    };

    const queueSnapToNearest = (rawProgress) => {
      if (settleTimeoutId) window.clearTimeout(settleTimeoutId);
      settleTimeoutId = window.setTimeout(() => {
        const snapped = clampValue(
          0,
          Math.round(rawProgress),
          expandedGalleryPerimeterMaxProgress,
        );
        if (Math.abs(snapped - snap.current) < 0.001) {
          snap.current = snapped;
          snap.target = snapped;
          setExpandedGalleryPerimeterProgress((prev) =>
            Math.abs(prev - snapped) < 0.001 ? prev : snapped,
          );
          return;
        }
        snap.target = snapped;
        ensureAnimating();
      }, SNAP_SETTLE_DELAY);
    };

    const resolveTravelDistance = () => {
      const rect = stageNode.getBoundingClientRect();
      const progressStartTop =
        expandedGalleryStickyTop - expandedGalleryPerimeterVerticalShift;
      return clampValue(
        0,
        progressStartTop - rect.top,
        expandedGalleryPerimeterTravel,
      );
    };

    const updatePerimeterProgress = () => {
      scrollRafId = 0;

      const traveled = resolveTravelDistance();
      const remainingTravel = Math.max(
        expandedGalleryPerimeterTravel - baselineTravel,
        1,
      );
      const adjustedTravel = clampValue(
        0,
        traveled - baselineTravel,
        remainingTravel,
      );
      const rawProgress =
        (adjustedTravel / remainingTravel) *
        expandedGalleryPerimeterMaxProgress;

      const clampedProgress = clampValue(
        0,
        rawProgress,
        expandedGalleryPerimeterMaxProgress,
      );

      setImmediateProgress(clampedProgress);
      queueSnapToNearest(clampedProgress);
    };

    const queueUpdate = () => {
      if (scrollRafId) return;
      scrollRafId = window.requestAnimationFrame(updatePerimeterProgress);
    };

    const isPostMorph = expandedGalleryPerimeterPostMorphRef.current;
    const isFreshPerimeterOpen = expandedGalleryPerimeterFreshOpenRef.current;
    const shouldSkipBaseline = isPostMorph || isFreshPerimeterOpen;
    const shouldPreserveInitialPerimeterTravel =
      isFreshPerimeterOpen && !isPostMorph;
    expandedGalleryPerimeterPostMorphRef.current = false;
    expandedGalleryPerimeterFreshOpenRef.current = false;

    const startTracking = (skipBaseline) => {
      if (trackingStarted) return;
      trackingStarted = true;

      const currentTravel = resolveTravelDistance();
      baselineTravel = shouldPreserveInitialPerimeterTravel
        ? currentTravel
        : skipBaseline
          ? 0
          : currentTravel;
      window.addEventListener("scroll", queueUpdate, { passive: true });
      window.addEventListener("resize", queueUpdate, { passive: true });
      queueUpdate();
    };

    if (isPostMorph) {
      startTracking(true);
    } else {
      initialTrackingTimeoutId = window.setTimeout(
        () => startTracking(shouldSkipBaseline),
        EXPANDED_GALLERY_PERIMETER_PROGRESS_INIT_DELAY_MS,
      );
    }

    return () => {
      if (trackingStarted) {
        window.removeEventListener("scroll", queueUpdate);
        window.removeEventListener("resize", queueUpdate);
      }
      if (initialTrackingTimeoutId)
        window.clearTimeout(initialTrackingTimeoutId);
      if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
      if (settleTimeoutId) window.clearTimeout(settleTimeoutId);
      if (snap.animId) window.cancelAnimationFrame(snap.animId);
      snap.animId = 0;
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryPerimeterMaxProgress,
    expandedGalleryPerimeterTravel,
    expandedGalleryPerimeterVerticalShift,
    expandedGalleryStickyTop,
    expandedGalleryScrollMorphActive,
    isDesktopGallery,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    if (
      useExpandedLandingPerimeter ||
      !expandedGalleryImageKey ||
      !isDesktopGallery ||
      !expandedGalleryMaxPinnedRowOffset
    ) {
      expandedGalleryRowMetricsRef.current = {
        basePinnedRowTopFromStage: 0,
        rowStep: 0,
      };
      return undefined;
    }

    const stageNode = expandedGalleryStageRef.current;
    const pinnedNode = expandedGalleryFixedCardRef.current;
    if (!stageNode || !pinnedNode) return undefined;

    let rafId = 0;
    const measureRowMetrics = () => {
      const flowRects = Array.from(
        stageNode.querySelectorAll("[data-gallery-flow-card-key]"),
      )
        .filter((node) => node instanceof HTMLElement)
        .map((node) => node.getBoundingClientRect())
        .filter((rect) => rect.width && rect.height)
        .sort((a, b) =>
          Math.abs(a.top - b.top) < 1 ? a.left - b.left : a.top - b.top,
        );
      if (!flowRects.length) return null;

      const uniqueRowTops = [];
      flowRects.forEach((rect) => {
        const lastTop = uniqueRowTops[uniqueRowTops.length - 1];
        if (typeof lastTop === "number" && Math.abs(rect.top - lastTop) <= 2)
          return;
        uniqueRowTops.push(rect.top);
      });

      const basePinnedRowTop =
        uniqueRowTops[EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START - 1];
      const rowDiffs = uniqueRowTops
        .slice(1)
        .map((top, index) => top - uniqueRowTops[index])
        .filter((diff) => diff > 1);
      const rowStep = rowDiffs.length
        ? rowDiffs.reduce((sum, diff) => sum + diff, 0) / rowDiffs.length
        : 0;
      if (typeof basePinnedRowTop !== "number" || !rowStep) return null;

      const stageRect = stageNode.getBoundingClientRect();
      const nextMetrics = {
        basePinnedRowTopFromStage: basePinnedRowTop - stageRect.top,
        rowStep,
      };

      expandedGalleryRowMetricsRef.current = nextMetrics;
      return nextMetrics;
    };

    const updatePinnedRowOffset = () => {
      rafId = 0;

      const rowMetrics =
        expandedGalleryRowMetricsRef.current.rowStep > 0
          ? expandedGalleryRowMetricsRef.current
          : measureRowMetrics();
      if (!rowMetrics) return;

      const stageRect = stageNode.getBoundingClientRect();
      const basePinnedRowTop =
        stageRect.top + rowMetrics.basePinnedRowTopFromStage;
      const exposedPinnedSpace = Math.max(
        0,
        expandedGalleryStickyTop - basePinnedRowTop,
      );
      const nextPinnedRowOffset = clampValue(
        0,
        Math.floor(exposedPinnedSpace / rowMetrics.rowStep + 0.001),
        expandedGalleryMaxPinnedRowOffset,
      );

      setExpandedGalleryPinnedRowOffset((prev) =>
        prev === nextPinnedRowOffset ? prev : nextPinnedRowOffset,
      );
    };

    const queueUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updatePinnedRowOffset);
    };

    const handleResize = () => {
      measureRowMetrics();
      queueUpdate();
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => handleResize());

    measureRowMetrics();
    resizeObserver?.observe(pinnedNode);
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    queueUpdate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", handleResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryMaxPinnedRowOffset,
    expandedGalleryStickyTop,
    isDesktopGallery,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    if (
      useExpandedLandingPerimeter ||
      !expandedGalleryImageKey ||
      !isDesktopGallery ||
      !expandedGalleryPinnedRowOffset
    ) {
      return undefined;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      return undefined;
    }

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      const stageNode = expandedGalleryStageRef.current;
      if (!stageNode) return;

      const flowCards = Array.from(
        stageNode.querySelectorAll("[data-gallery-flow-card-key]"),
      )
        .filter((node) => node instanceof HTMLElement)
        .map((node) => ({
          node,
          rect: node.getBoundingClientRect(),
        }))
        .filter(({ rect }) => rect.width && rect.height)
        .sort((a, b) =>
          Math.abs(a.rect.top - b.rect.top) < 1
            ? a.rect.left - b.rect.left
            : a.rect.top - b.rect.top,
        );
      if (!flowCards.length) return;

      const uniqueRowTops = [];
      flowCards.forEach(({ rect }) => {
        const lastTop = uniqueRowTops[uniqueRowTops.length - 1];
        if (typeof lastTop === "number" && Math.abs(rect.top - lastTop) <= 2)
          return;
        uniqueRowTops.push(rect.top);
      });

      const revealedRowIndex =
        EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
        expandedGalleryPinnedRowOffset -
        2;
      const revealedRowTop = uniqueRowTops[revealedRowIndex];
      if (typeof revealedRowTop !== "number") return;

      const revealedRowNodes = flowCards
        .filter(({ rect }) => Math.abs(rect.top - revealedRowTop) <= 2)
        .map(({ node }) => node);
      if (!revealedRowNodes.length) return;

      const revealedRowKey = `${expandedGalleryImageKey}:${revealedRowIndex}`;
      if (expandedGalleryAnimatedRowsRef.current.has(revealedRowKey)) return;

      expandedGalleryAnimatedRowsRef.current.add(revealedRowKey);
      gsap.killTweensOf(revealedRowNodes);
      gsap.fromTo(
        revealedRowNodes,
        { opacity: 0.55 },
        {
          opacity: 1,
          duration: 0.24,
          stagger: 0.04,
          ease: "power2.out",
          overwrite: "auto",
          clearProps: "opacity",
        },
      );
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [
    expandedGalleryImageKey,
    expandedGalleryPinnedRowOffset,
    isDesktopGallery,
    useExpandedLandingPerimeter,
  ]);

  useEffect(() => {
    const previousRects = expandedGalleryRectsRef.current;
    const shouldUseClockwisePerimeterSwap =
      expandedGalleryPerimeterClockwiseSwapRef.current;
    if (!previousRects.size && !shouldUseClockwisePerimeterSwap) {
      return undefined;
    }
    if (typeof window === "undefined") return undefined;
    if (expandedGallerySoftCloseRef.current) {
      expandedGalleryRectsRef.current = new Map();
      expandedGalleryPerimeterClockwiseSwapRef.current = false;
      return undefined;
    }

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      expandedGalleryRectsRef.current = new Map();
      expandedGalleryPerimeterClockwiseSwapRef.current = false;
      return undefined;
    }

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      if (useExpandedLandingPerimeter) {
        const stageNode = expandedGalleryStageRef.current;
        if (!stageNode) {
          expandedGalleryRectsRef.current = new Map();
          expandedGalleryPerimeterClockwiseSwapRef.current = false;
          return;
        }

        const flowNode = expandedGalleryPerimeterFlowRef.current;
        const pinnedRect =
          expandedGalleryFixedCardRef.current?.getBoundingClientRect?.();
        const pinnedCenterX = pinnedRect?.width
          ? pinnedRect.left + pinnedRect.width / 2
          : window.innerWidth / 2;
        const pinnedCenterY = pinnedRect?.height
          ? pinnedRect.top + pinnedRect.height / 2
          : window.innerHeight / 2;
        const perimeterCards = Array.from(
          stageNode.querySelectorAll("[data-gallery-flow-card-key]"),
        )
          .filter((node) => node instanceof HTMLElement)
          .map((node) => {
            const rect = node.getBoundingClientRect();
            const inner =
              node.querySelector('[data-gallery-card-inner="true"]') ?? node;

            if (
              !(inner instanceof HTMLElement) ||
              !rect.width ||
              !rect.height
            ) {
              return null;
            }

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            return {
              rect,
              inner,
              cardKey: node.dataset.galleryFlowCardKey ?? "",
              edge: node.dataset.galleryEdge ?? "bottom",
              centerX,
              centerY,
              radius: Math.hypot(
                centerX - pinnedCenterX,
                centerY - pinnedCenterY,
              ),
              distance: Math.hypot(
                centerX - pinnedCenterX,
                centerY - pinnedCenterY,
              ),
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.distance - b.distance);

        if (shouldUseClockwisePerimeterSwap) {
          if (flowNode instanceof HTMLElement) {
            gsap.killTweensOf(flowNode);
            gsap.fromTo(
              flowNode,
              {
                opacity: 0.82,
                filter: "blur(0.6px)",
              },
              {
                opacity: 1,
                filter: "blur(0px)",
                duration: EXPANDED_GALLERY_PERIMETER_SWAP_DURATION,
                ease: "expo.out",
                overwrite: "auto",
                clearProps: "opacity,filter",
              },
            );
          }

          perimeterCards.forEach(({ inner, centerX, centerY, radius }) => {
            const safeRadius = radius || 1;
            const tangentX = -(centerY - pinnedCenterY) / safeRadius;
            const tangentY = (centerX - pinnedCenterX) / safeRadius;
            const travel = clampValue(12, safeRadius * 0.055, 32);

            gsap.killTweensOf(inner);
            gsap.fromTo(
              inner,
              {
                x: -tangentX * travel,
                y: -tangentY * travel,
                scale: 0.985,
                opacity: 0.35,
                filter: "blur(2px) saturate(0.94)",
                transformOrigin: "center center",
              },
              {
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                filter: "blur(0px) saturate(1)",
                duration: EXPANDED_GALLERY_PERIMETER_SWAP_DURATION * 0.98,
                ease: "expo.out",
                overwrite: "auto",
                clearProps: "transform,opacity,filter",
              },
            );
          });

          expandedGalleryRectsRef.current = new Map();
          expandedGalleryPerimeterClockwiseSwapRef.current = false;
          return;
        }

        perimeterCards.forEach(({ rect, inner, cardKey, edge }, index) => {
          const prevRect = projectDocumentRectToViewport(
            resolveCapturedGalleryRect(previousRects, cardKey),
          );
          const delay = Math.min(
            index * EXPANDED_GALLERY_PERIMETER_FLOW_STAGGER,
            0.12,
          );

          gsap.killTweensOf(inner);

          if (prevRect && isRectNearViewport(prevRect)) {
            const deltaX = prevRect.left - rect.left;
            const deltaY = prevRect.top - rect.top;
            const scaleX = prevRect.width / rect.width;
            const scaleY = prevRect.height / rect.height;

            gsap.fromTo(
              inner,
              {
                x: deltaX,
                y: deltaY,
                scaleX,
                scaleY,
                opacity: 0.92,
                transformOrigin: "top left",
              },
              {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                duration: EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION,
                delay,
                ease: "power3.out",
                overwrite: "auto",
                clearProps: "transform,opacity",
              },
            );
            return;
          }

          const fallbackOffset = getPerimeterEntryOffset(edge);
          gsap.fromTo(
            inner,
            {
              x: fallbackOffset.x * 4,
              y: fallbackOffset.y * 4,
              scale: 0.985,
              opacity: 0,
              transformOrigin: "center center",
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              duration: EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION * 0.88,
              delay,
              ease: "power2.out",
              overwrite: "auto",
              clearProps: "transform,opacity",
            },
          );
        });

        expandedGalleryRectsRef.current = new Map();
        expandedGalleryPerimeterClockwiseSwapRef.current = false;
        return;
      }

      document
        .querySelectorAll("[data-gallery-flow-card-key]")
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          const cardKey = node.dataset.galleryFlowCardKey;
          if (!cardKey) return;

          const nextRect = node.getBoundingClientRect();
          const prevRect = projectDocumentRectToViewport(
            previousRects.get(cardKey),
          );

          if (!prevRect) {
            gsap.fromTo(
              node,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power2.out",
                clearProps: "opacity,transform",
              },
            );
            return;
          }

          const deltaX = prevRect.left - nextRect.left;
          const deltaY = prevRect.top - nextRect.top;
          const scaleX = prevRect.width / nextRect.width;
          const scaleY = prevRect.height / nextRect.height;

          if (
            Math.abs(deltaX) < 0.5 &&
            Math.abs(deltaY) < 0.5 &&
            Math.abs(scaleX - 1) < 0.01 &&
            Math.abs(scaleY - 1) < 0.01
          ) {
            return;
          }

          gsap.fromTo(
            node,
            {
              x: deltaX,
              y: deltaY,
              scaleX,
              scaleY,
              transformOrigin: "top left",
            },
            {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              duration: 0.82,
              ease: "power3.out",
              clearProps: "transform",
            },
          );
        });

      expandedGalleryRectsRef.current = new Map();
      expandedGalleryPerimeterClockwiseSwapRef.current = false;
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [expandedGalleryImageKey, useExpandedLandingPerimeter]);

  useEffect(() => {
    if (expandedGalleryImageKey || !expandedGallerySoftCloseRef.current) {
      return undefined;
    }
    if (typeof window === "undefined") {
      expandedGallerySoftCloseRef.current = false;
      return undefined;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      expandedGallerySoftCloseRef.current = false;
      return undefined;
    }

    const revealNodes = [selectedRef.current].filter(
      (node) => node instanceof HTMLElement,
    );
    if (!revealNodes.length) {
      expandedGallerySoftCloseRef.current = false;
      return undefined;
    }

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      gsap.killTweensOf(revealNodes);
      gsap.fromTo(
        revealNodes,
        { opacity: 0 },
        {
          opacity: 1,
          duration: EXPANDED_GALLERY_SOFT_REVEAL_DURATION,
          stagger: 0,
          ease: "power2.out",
          overwrite: "auto",
          clearProps: "opacity",
        },
      );
      expandedGallerySoftCloseRef.current = false;
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [expandedGalleryImageKey, selectedRef]);

  useEffect(() => {
    if (expandedGalleryImageKey) {
      return undefined;
    }

    const closeMeta = expandedGalleryCloseMetaRef.current;
    const closingClone = expandedGalleryClosingCloneRef.current;
    if (
      closeMeta?.mode !== "landing-perimeter" ||
      !(closingClone instanceof HTMLElement)
    ) {
      return undefined;
    }
    if (typeof window === "undefined") {
      finalizeExpandedGalleryClose();
      return undefined;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      finalizeExpandedGalleryClose();
      return undefined;
    }

    let rafId = 0;
    let cleanupTimeoutId = 0;
    rafId = window.requestAnimationFrame(() => {
      const targetNodesByKey = new Map();
      document.querySelectorAll("[data-gallery-card-key]").forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (closingClone.contains(node)) return;
        const cardKey = node.dataset.galleryCardKey;
        if (!cardKey || targetNodesByKey.has(cardKey)) return;
        targetNodesByKey.set(cardKey, node);
      });

      const heroCloneNode = closingClone.querySelector(
        '[data-gallery-pinned="true"]',
      );
      const heroCloneRect =
        heroCloneNode instanceof HTMLElement
          ? heroCloneNode.getBoundingClientRect()
          : null;
      const heroCenterX = heroCloneRect?.width
        ? heroCloneRect.left + heroCloneRect.width / 2
        : window.innerWidth / 2;
      const heroCenterY = heroCloneRect?.height
        ? heroCloneRect.top + heroCloneRect.height / 2
        : window.innerHeight / 2;
      const usedTargetKeys = new Set();

      // Only fly cards back to a real destination when that destination is still
      // local to the viewport; otherwise they do a short local exit.
      const cloneFlowCards = Array.from(
        closingClone.querySelectorAll("[data-gallery-flow-card-key]"),
      )
        .filter((node) => node instanceof HTMLElement)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          return {
            node,
            rect,
            distance: Math.hypot(centerX - heroCenterX, centerY - heroCenterY),
          };
        })
        .sort((a, b) => a.distance - b.distance);

      cloneFlowCards.forEach(({ node, rect }, index) => {
        const inner =
          node.querySelector('[data-gallery-card-inner="true"]') ?? node;
        if (!(inner instanceof HTMLElement)) return;

        const rawCardKey = node.dataset.galleryFlowCardKey ?? "";
        const canonicalCardKey = rawCardKey.replace(/:btm$/, "");
        const targetNode =
          rawCardKey === canonicalCardKey &&
          !usedTargetKeys.has(canonicalCardKey)
            ? targetNodesByKey.get(canonicalCardKey)
            : null;
        const targetRect = targetNode?.getBoundingClientRect?.();
        const delay = Math.min(
          index * EXPANDED_GALLERY_PERIMETER_FLOW_STAGGER,
          0.12,
        );

        gsap.killTweensOf(inner);

        if (
          targetRect?.width &&
          targetRect?.height &&
          shouldAnimateGalleryReturnToTarget(rect, targetRect)
        ) {
          usedTargetKeys.add(canonicalCardKey);
          gsap.to(inner, {
            x: targetRect.left - rect.left,
            y: targetRect.top - rect.top,
            scaleX: targetRect.width / rect.width,
            scaleY: targetRect.height / rect.height,
            opacity: 0,
            transformOrigin: "top left",
            duration: EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION,
            delay,
            ease: "power3.inOut",
            overwrite: "auto",
          });
          return;
        }

        const exitOffset = getPerimeterEntryOffset(
          node.dataset.galleryEdge ?? "bottom",
        );
        gsap.to(inner, {
          x: exitOffset.x * 4,
          y: exitOffset.y * 4,
          scale: 0.985,
          opacity: 0,
          duration: EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION * 0.72,
          delay,
          ease: "power2.in",
          overwrite: "auto",
        });
      });

      if (heroCloneNode instanceof HTMLElement) {
        const heroInner =
          heroCloneNode.querySelector('[data-gallery-card-inner="true"]') ??
          heroCloneNode;
        const clonedCloseButton = heroCloneNode.querySelector("button");
        const targetNode = targetNodesByKey.get(closeMeta.selectedCardKey);
        const targetRect = targetNode?.getBoundingClientRect?.();

        if (clonedCloseButton instanceof HTMLElement) {
          gsap.killTweensOf(clonedCloseButton);
          gsap.to(clonedCloseButton, {
            opacity: 0,
            duration: 0.16,
            ease: "power1.out",
            overwrite: "auto",
          });
        }

        if (
          heroInner instanceof HTMLElement &&
          heroCloneRect?.width &&
          heroCloneRect?.height
        ) {
          gsap.killTweensOf(heroInner);

          if (
            targetRect?.width &&
            targetRect?.height &&
            shouldAnimateGalleryReturnToTarget(heroCloneRect, targetRect)
          ) {
            gsap.to(heroInner, {
              x: targetRect.left - heroCloneRect.left,
              y: targetRect.top - heroCloneRect.top,
              scaleX: targetRect.width / heroCloneRect.width,
              scaleY: targetRect.height / heroCloneRect.height,
              opacity: 0,
              transformOrigin: "center center",
              duration: EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
              ease: "power3.inOut",
              overwrite: "auto",
            });
          } else {
            gsap.to(heroInner, {
              y: 12,
              scale: 0.986,
              opacity: 0,
              duration: EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION * 0.74,
              ease: "power2.in",
              overwrite: "auto",
            });
          }
        }
      }

      const flowDuration =
        EXPANDED_GALLERY_PERIMETER_FLOW_OPEN_DURATION +
        Math.min(
          cloneFlowCards.length * EXPANDED_GALLERY_PERIMETER_FLOW_STAGGER,
          0.12,
        );
      const heroDuration = EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION;
      const cleanupDelayMs = Math.round(
        (Math.max(flowDuration, heroDuration) + 0.1) * 1000,
      );
      cleanupTimeoutId = window.setTimeout(
        finalizeExpandedGalleryClose,
        cleanupDelayMs,
      );
    });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (cleanupTimeoutId) window.clearTimeout(cleanupTimeoutId);
    };
  }, [expandedGalleryImageKey, finalizeExpandedGalleryClose]);

  useEffect(
    () => () => {
      expandedGalleryCloseMetaRef.current = null;
      removeClosingClone();
    },
    [removeClosingClone],
  );

  useEffect(
    () => () => {
      removeOpeningClone();
    },
    [removeOpeningClone],
  );

  useLayoutEffect(() => {
    if (!expandedGalleryImageKey) return undefined;

    const stageNode = expandedGalleryStageRef.current;
    if (!stageNode) return undefined;

    const motionNode =
      stageNode.querySelector('[data-gallery-stage-content="true"]') ??
      stageNode;
    const openingClone = expandedGalleryOpeningCloneRef.current;
    const shouldUsePremiumOpen =
      expandedGalleryPremiumOpenKeyRef.current === expandedGalleryImageKey;

    gsap.killTweensOf(motionNode);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      removeOpeningClone();
      gsap.set(motionNode, { opacity: 1 });
      return undefined;
    }

    if (!shouldUsePremiumOpen) {
      removeOpeningClone();
      gsap.set(motionNode, { opacity: 1, clearProps: "opacity" });
      return undefined;
    }

    if (isDesktopGallery) {
      const shouldAlignPerimeterStart =
        useExpandedLandingPerimeter &&
        expandedGalleryPerimeterFreshOpenRef.current;

      if (shouldAlignPerimeterStart) {
        alignExpandedLandingPerimeterForOpen();
      } else {
        const openingScrollBias = getExpandedGalleryOpenScrollBias(
          !expandedGalleryWasOpenRef.current,
        );
        const expandedCard =
          expandedGalleryFixedCardRef.current ??
          document.querySelector(
            `[data-gallery-card-key="${expandedGalleryImageKey}"]`,
          );

        if (expandedCard instanceof HTMLElement) {
          const rect = expandedCard.getBoundingClientRect();
          const nextScrollTop = resolveScrollTopToRevealRect(rect, {
            topInset: expandedGalleryStickyTop,
            topBias: openingScrollBias,
          });
          const willScroll =
            Number.isFinite(nextScrollTop) &&
            Math.abs(nextScrollTop - window.scrollY) > 1;

          if (willScroll) {
            scrollExpandedGalleryViewport(nextScrollTop, "auto");
          }
        } else {
          const stageContentNode =
            stageNode.querySelector('[data-gallery-stage-content="true"]') ??
            stageNode;

          if (stageContentNode instanceof HTMLElement) {
            const rect = stageContentNode.getBoundingClientRect();
            const nextScrollTop = resolveScrollTopToRevealRect(rect, {
              topInset: expandedGalleryStickyTop,
              topBias: openingScrollBias,
            });
            const willScroll =
              Number.isFinite(nextScrollTop) &&
              Math.abs(nextScrollTop - window.scrollY) > 1;

            if (willScroll) {
              scrollExpandedGalleryViewport(nextScrollTop, "auto");
            }
          }
        }
      }
    }

    const stageOpacityFrom = useExpandedLandingPerimeter ? 0.16 : 0;

    // Crossfade the expanded stage in while the captured landing layout dissolves away.
    gsap.fromTo(
      motionNode,
      { opacity: stageOpacityFrom },
      {
        opacity: 1,
        duration: EXPANDED_GALLERY_PREMIUM_OPEN_DURATION,
        ease: "power1.out",
        overwrite: "auto",
        clearProps: "opacity",
      },
    );

    if (openingClone instanceof HTMLElement) {
      gsap.killTweensOf(openingClone);
      gsap.to(openingClone, {
        opacity: 0,
        duration: EXPANDED_GALLERY_PREMIUM_OPEN_DURATION,
        ease: "power1.out",
        overwrite: "auto",
        onComplete: () => {
          if (expandedGalleryOpeningCloneRef.current === openingClone) {
            expandedGalleryOpeningCloneRef.current = null;
          }
          openingClone.remove();
        },
      });
    }

    return () => {
      gsap.killTweensOf(motionNode);
      if (openingClone instanceof HTMLElement) {
        gsap.killTweensOf(openingClone);
        if (expandedGalleryOpeningCloneRef.current === openingClone) {
          expandedGalleryOpeningCloneRef.current = null;
        }
        openingClone.remove();
      }
    };
  }, [
    expandedGalleryImageKey,
    alignExpandedLandingPerimeterForOpen,
    expandedGalleryStickyTop,
    getExpandedGalleryOpenScrollBias,
    isDesktopGallery,
    removeOpeningClone,
    scrollExpandedGalleryViewport,
    useExpandedLandingPerimeter,
  ]);

  useLayoutEffect(() => {
    if (!expandedGalleryImageKey || !isDesktopGallery) return undefined;

    const outerNode = expandedGalleryFixedCardRef.current;
    if (!outerNode) return undefined;
    const motionNode =
      outerNode.querySelector('[data-gallery-card-inner="true"]') ?? outerNode;
    const sourceRect = expandedGallerySourceRectRef.current;

    gsap.killTweensOf(motionNode);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      gsap.set(motionNode, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        scale: 1,
        opacity: 1,
      });
      expandedGallerySourceRectRef.current = null;
      expandedGallerySourceInnerRef.current = null;
      return undefined;
    }

    if (useExpandedLandingPerimeter) {
      const finalRect = outerNode.getBoundingClientRect();
      const rawSaved = sourceRect;
      const scrollAtCapture = expandedGallerySourceScrollRef.current;
      const liveInner = expandedGallerySourceInnerRef.current;

      let effectiveSourceRect = null;
      if (
        rawSaved?.width &&
        rawSaved?.height &&
        typeof window !== "undefined"
      ) {
        // Use the captured click rect first so the morph originates from
        // the actual card the user tapped, even if the source gallery gets
        // reflowed downward when the perimeter layout mounts.
        effectiveSourceRect = {
          left: rawSaved.left + scrollAtCapture.x - window.scrollX,
          top: rawSaved.top + scrollAtCapture.y - window.scrollY,
          width: rawSaved.width,
          height: rawSaved.height,
        };
      } else if (liveInner && liveInner.isConnected) {
        const live = liveInner.getBoundingClientRect();
        if (live.width && live.height) {
          effectiveSourceRect = {
            left: live.left,
            top: live.top,
            width: live.width,
            height: live.height,
          };
        }
      }

      expandedGallerySourceInnerRef.current = null;
      expandedGallerySourceRectRef.current = null;

      if (
        effectiveSourceRect?.width &&
        effectiveSourceRect?.height &&
        finalRect.width &&
        finalRect.height
      ) {
        const sourceCenterX =
          effectiveSourceRect.left + effectiveSourceRect.width / 2;
        const sourceCenterY =
          effectiveSourceRect.top + effectiveSourceRect.height / 2;
        const finalCenterX = finalRect.left + finalRect.width / 2;
        const finalCenterY = finalRect.top + finalRect.height / 2;

        gsap.fromTo(
          motionNode,
          {
            x: sourceCenterX - finalCenterX,
            y: sourceCenterY - finalCenterY,
            scaleX: effectiveSourceRect.width / finalRect.width,
            scaleY: effectiveSourceRect.height / finalRect.height,
            transformOrigin: "center center",
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: EXPANDED_GALLERY_PERIMETER_HERO_OPEN_DURATION,
            ease: "power3.out",
            overwrite: "auto",
            clearProps: "transform",
          },
        );
      } else {
        gsap.fromTo(
          motionNode,
          {
            filter: "brightness(0.988) saturate(0.992)",
          },
          {
            filter: "brightness(1) saturate(1)",
            duration: EXPANDED_GALLERY_HERO_SWAP_DURATION,
            ease: "power2.out",
            overwrite: "auto",
            clearProps: "transform,filter",
          },
        );
      }

      return () => {
        gsap.killTweensOf(motionNode);
      };
    }

    expandedGallerySourceRectRef.current = null;

    gsap.fromTo(
      motionNode,
      { y: 10, scale: 0.985 },
      {
        y: 0,
        scale: 1,
        duration: 0.36,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "transform",
      },
    );
    return () => {
      gsap.killTweensOf(motionNode);
    };
  }, [expandedGalleryImageKey, isDesktopGallery, useExpandedLandingPerimeter]);

  useEffect(() => {
    if (
      useExpandedLandingPerimeter ||
      !expandedGalleryImageKey ||
      !isDesktopGallery
    ) {
      return undefined;
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      return undefined;
    }

    const stageNode = expandedGalleryStageRef.current;
    const pinnedNode = expandedGalleryFixedCardRef.current;
    if (!stageNode || !pinnedNode) return undefined;

    let rafId = 0;
    const updateFlowMotion = () => {
      rafId = 0;

      const pinnedRect = pinnedNode.getBoundingClientRect();
      if (!pinnedRect.width || !pinnedRect.height) return;

      const pinnedCenterX = pinnedRect.left + pinnedRect.width / 2;
      const pinnedCenterY = pinnedRect.top + pinnedRect.height / 2;
      const maxHorizontalDistance = Math.max(pinnedRect.width * 0.78, 1);
      const maxVerticalDistance = Math.max(pinnedRect.height * 0.9, 1);

      stageNode
        .querySelectorAll("[data-gallery-flow-card-key]")
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          const inner = node.querySelector('[data-gallery-card-inner="true"]');
          if (!(inner instanceof HTMLElement)) return;

          const rect = node.getBoundingClientRect();
          const cardCenterX = rect.left + rect.width / 2;
          const cardCenterY = rect.top + rect.height / 2;
          const normalizedX = clampValue(
            -1,
            (cardCenterX - pinnedCenterX) / maxHorizontalDistance,
            1,
          );
          const normalizedY =
            (cardCenterY - pinnedCenterY) / maxVerticalDistance;
          const outsideBandProgress = clampValue(
            0,
            (Math.abs(normalizedY) - EXPANDED_GALLERY_FLOW_DEAD_ZONE) /
              (1 - EXPANDED_GALLERY_FLOW_DEAD_ZONE),
            1,
          );
          const horizontalInfluence = Math.abs(normalizedX);
          const offsetStrength = outsideBandProgress * horizontalInfluence;
          const x =
            Math.round(
              -normalizedX * EXPANDED_GALLERY_FLOW_MAX_X * offsetStrength * 100,
            ) / 100;
          const y =
            Math.round(
              -Math.sign(normalizedY || 0) *
                EXPANDED_GALLERY_FLOW_MAX_Y *
                outsideBandProgress *
                (1 - horizontalInfluence * 0.5) *
                100,
            ) / 100;

          gsap.set(inner, {
            x,
            y,
            force3D: true,
          });
        });
    };

    const queueUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateFlowMotion);
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => queueUpdate());

    resizeObserver?.observe(stageNode);
    resizeObserver?.observe(pinnedNode);
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate, { passive: true });
    queueUpdate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);

      stageNode
        .querySelectorAll("[data-gallery-flow-card-key]")
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const inner = node.querySelector('[data-gallery-card-inner="true"]');
          if (!(inner instanceof HTMLElement)) return;
          gsap.set(inner, { clearProps: "x,y,force3D" });
        });
    };
  }, [expandedGalleryImageKey, isDesktopGallery, useExpandedLandingPerimeter]);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      )?.matches;
      const scopeEl = container.current;
      const isRenderableIntroNode = (el) => {
        if (!(el instanceof HTMLElement)) return false;
        const { display } = window.getComputedStyle(el);
        return display !== "none" && display !== "contents";
      };
      const introPanel =
        gsap.utils
          .toArray(".hero-intro-panel", scopeEl || undefined)
          .find(isRenderableIntroNode) || null;
      const introItems = gsap.utils
        .toArray(".hero-intro-item", scopeEl || undefined)
        .filter(isRenderableIntroNode);

      if (!introPanel && !introItems.length) {
        setEntranceDone(true);
        return;
      }

      if (prefersReducedMotion) {
        if (introPanel) {
          gsap.set(introPanel, {
            opacity: 1,
            y: 0,
            scale: 1,
            clearProps: "transform,opacity",
          });
        }
        if (introItems.length) {
          gsap.set(introItems, { opacity: 1, y: 0, clearProps: "transform" });
        }
        setEntranceDone(true);
        return;
      }

      const introTimeline = gsap.timeline({
        onComplete: () => setEntranceDone(true),
      });

      if (introPanel) {
        introTimeline.fromTo(
          introPanel,
          { opacity: 0, y: 34, scale: 0.975, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "expo.out",
            clearProps: "transform,opacity,filter",
          },
        );
      }

      if (introItems.length) {
        // Let the items chase the panel in with a slightly longer, more orchestrated cascade.
        introTimeline.fromTo(
          introItems,
          { opacity: 0, y: 28, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.14,
            ease: "expo.out",
            clearProps: "transform,filter",
          },
          introPanel ? "-=1.0" : 0,
        );
      }

      // Scroll-driven hero fade — mirrors the gallery card motion vocabulary
      // (opacity / x / y / scale). Reverses smoothly when scrolling back up.
      const heroEl = (scopeEl || document).querySelector("#home-hero");
      if (heroEl && !prefersReducedMotion) {
        gsap.fromTo(
          heroEl,
          { opacity: 1, x: 0, y: 0, scale: 1 },
          {
            opacity: 0,
            x: -10,
            y: 20,
            scale: 0.985,
            ease: "none",
            scrollTrigger: {
              trigger: heroEl,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      }

      const content = reviewsContentRef.current;
      const wrapper = reviewsSectionRef.current;
      if (content && wrapper && !prefersReducedMotion) {
        const cards = content.querySelectorAll('[data-review-card="true"]');
        gsap.set(content, { opacity: 0 });
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 30 });
        }

        let cardsRevealed = false;

        gsap.to(content, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "top 25%",
            scrub: true,
            onUpdate: (self) => {
              wrapper.style.pointerEvents = self.progress > 0.8 ? "" : "none";

              if (!cardsRevealed && self.progress > 0.6 && cards.length) {
                cardsRevealed = true;
                gsap.to(cards, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power2.out",
                  overwrite: true,
                  clearProps: "transform",
                });
              }
            },
          },
        });
      }

      const backdrop = reviewsBackdropRef.current;
      const selectedSection = selectedRef.current;
      if (backdrop && selectedSection && wrapper && !prefersReducedMotion) {
        gsap.set(backdrop, { opacity: 0 });

        // One scrubbed timeline prevents competing tweens on `opacity`.
        // Range: after Selected Work leaves viewport → end of full Reviews grid.
        const bgTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: selectedSection,
            start: "bottom top",
            endTrigger: wrapper,
            end: "bottom bottom",
            scrub: true,
          },
        });

        // Fade in, hold, then fade out to white at the very end.
        bgTl.to(backdrop, { opacity: 1, duration: 0.18 });
        bgTl.to(backdrop, { opacity: 1, duration: 0.67 });
        bgTl.to(backdrop, { opacity: 0, duration: 0.15 });
      }
    },
    { scope: container },
  );

  const renderExpandedLandingPerimeter = () => {
    if (!expandedLandingSelectedImage) {
      return <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />;
    }

    const selectedCardKey = `${expandedLandingSelectedImage.galleryKey}:${expandedLandingSelectedImage.id}`;
    const selectedAltLabel =
      expandedLandingSelectedImage.altLabel ?? "Landing Page";
    const selectedAltText =
      expandedLandingSelectedImage.altText ??
      `${selectedAltLabel} expanded photo`;

    return (
      <div
        ref={expandedGalleryStageRef}
        data-gallery-layout="perimeter"
        className="relative"
        style={{
          minHeight: `${expandedGalleryPerimeterOuterHeight}px`,
          paddingTop: `${expandedGalleryPerimeterVerticalShift}px`,
          scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
        }}
      >
        <div
          data-gallery-stage-content="true"
          className="sticky"
          style={{
            top: `${expandedGalleryStickyTop}px`,
          }}
        >
          <div
            className="relative"
            style={{
              width: "calc(125% + 0.5rem)",
              maxWidth: "none",
              marginLeft: "calc(-12.5% - 0.25rem)",
              height: `${expandedGalleryPerimeterStageHeight}px`,
              transform: expandedGalleryPerimeterVerticalShift
                ? `translateY(-${expandedGalleryPerimeterVerticalShift}px)`
                : undefined,
            }}
          >
            <div
              ref={expandedGalleryPerimeterFlowRef}
              data-gallery-perimeter-flow="true"
              className="absolute inset-0"
              style={{ willChange: "opacity, filter" }}
            >
              {expandedGalleryPerimeterCards.map(
                ({ img, cardKey, pose }, i) => {
                  const imageAltLabel = img.altLabel ?? "Landing Page";
                  const imageAltText =
                    img.altText ?? `${imageAltLabel} photo ${i + 1}`;
                  const cardOpacity = Number(pose.opacity.toFixed(3));

                  return (
                    <div
                      key={cardKey}
                      data-gallery-card-key={cardKey}
                      data-gallery-flow-card-key={cardKey}
                      data-gallery-edge={pose.edge}
                      data-gallery-featured="false"
                      role="button"
                      tabIndex={cardOpacity < 0.2 ? -1 : 0}
                      aria-expanded="false"
                      aria-label={`Expand ${imageAltLabel} photo ${i + 1}`}
                      className="home-gallery-card absolute block rounded-[8px] border-0 bg-transparent p-0 text-left transition-[filter,box-shadow,opacity] duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
                      style={{
                        left: `${pose.x}%`,
                        top: `${pose.y}%`,
                        width: `min(${pose.width}%, 15rem)`,
                        transform: "translate(-50%, -50%)",
                        opacity: cardOpacity,
                        zIndex: 5,
                        scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
                        pointerEvents: cardOpacity < 0.2 ? "none" : "auto",
                        willChange: "transform,opacity",
                      }}
                      onClick={(e) =>
                        handleGalleryImageClick(img.galleryKey, img.id, e)
                      }
                      onKeyDown={(e) => {
                        if (e.key !== "Enter" && e.key !== " ") return;
                        e.preventDefault();
                        handleGalleryImageClick(img.galleryKey, img.id, e);
                      }}
                    >
                      <div
                        data-gallery-card-inner="true"
                        className="relative w-full overflow-hidden rounded-[8px] bg-slate-200/20 aspect-[4/3] shadow-xl shadow-slate-200/60"
                      >
                        <ProgressiveCldImage
                          publicId={img.publicId}
                          cldImg={img.cldImg}
                          alt={imageAltText}
                          loading="lazy"
                          decoding="async"
                          imgClassName="object-cover"
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <div
              ref={expandedGalleryFixedCardRef}
              data-gallery-card-key={selectedCardKey}
              data-gallery-featured="true"
              data-gallery-pinned="true"
              className="home-gallery-card absolute z-30 block rounded-[8px] border-0 bg-transparent p-0 text-left cursor-default"
              style={{
                left: "50%",
                top: "50%",
                width: `min(${EXPANDED_GALLERY_PERIMETER_HERO_WIDTH}%, 55rem)`,
                transform: "translate(-50%, -50%)",
                scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
              }}
            >
              <div
                data-gallery-card-inner="true"
                className="relative w-full overflow-hidden rounded-[8px] bg-slate-200/20 aspect-[4/3] shadow-2xl shadow-slate-900/15"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeExpandedGalleryImage();
                  }}
                  className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all cursor-pointer"
                  aria-label={`Close ${selectedAltLabel}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                  </svg>
                </button>
                <ExpandedGalleryHeroImage
                  imageKey={selectedCardKey}
                  publicId={expandedLandingSelectedImage.publicId}
                  cldImg={expandedLandingSelectedImage.cldImg}
                  alt={selectedAltText}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  imgClassName="object-cover"
                />
                <div
                  className={[
                    "absolute left-1/2 -translate-x-1/2 z-30 transition-[opacity,transform] duration-700 ease-out",
                    showLightboxBookingPrompt && !showQuoteModal
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-3 pointer-events-none",
                  ].join(" ")}
                  style={{ bottom: "20px" }}
                >
                  <Link
                    to="/booking"
                    className="group inline-flex items-center gap-3 pl-5 pr-4 py-2.5 bg-[#18181B]/90 hover:bg-black backdrop-blur-md text-white rounded-full text-[13px] font-light tracking-wide transition-colors duration-300"
                  >
                    <span>Ready to get started?</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHomeGalleryGrid = (
    images,
    galleryKey,
    gridRef,
    altLabel,
    allowExpandedLayout = true,
  ) => {
    const galleryHasExpandedImage =
      isDesktopGallery &&
      allowExpandedLayout &&
      (galleryKey
        ? expandedGalleryImage?.galleryKey === galleryKey
        : hasExpandedGalleryImage);
    const suppressPerimeterSourceGallery =
      useExpandedLandingPerimeter && !allowExpandedLayout;
    const usePinnedDesktopLayout =
      galleryHasExpandedImage && isDesktopGallery && !galleryKey;
    const pinnedDesktopImage = usePinnedDesktopLayout
      ? (images.find((img) => {
          const imageGalleryKey = img.galleryKey ?? galleryKey;
          return (
            expandedGalleryImage?.galleryKey === imageGalleryKey &&
            expandedGalleryImage.imageId === img.id
          );
        }) ?? null)
      : null;
    const pinnedDesktopCardKey = pinnedDesktopImage
      ? `${pinnedDesktopImage.galleryKey ?? galleryKey}:${pinnedDesktopImage.id}`
      : null;
    const pinnedDesktopAltLabel = pinnedDesktopImage?.altLabel ?? altLabel;
    const pinnedDesktopAltText =
      pinnedDesktopImage?.altText ?? `${pinnedDesktopAltLabel} expanded photo`;
    const pinnedDesktopReservedAreaStyle = usePinnedDesktopLayout
      ? {
          gridColumn: `${EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_START} / span ${EXPANDED_GALLERY_DESKTOP_PINNED_COLUMN_SPAN}`,
          gridRow: `${
            EXPANDED_GALLERY_DESKTOP_PINNED_ROW_START +
            expandedGalleryPinnedRowOffset
          } / span ${EXPANDED_GALLERY_DESKTOP_PINNED_ROW_SPAN}`,
        }
      : null;
    const expandedGalleryGridStyle = galleryHasExpandedImage
      ? usePinnedDesktopLayout
        ? {
            gridTemplateColumns: `repeat(${EXPANDED_GALLERY_DESKTOP_GRID_COLUMNS}, minmax(0, 1fr))`,
            gridAutoFlow: "row dense",
            width: "calc(125% + 0.5rem)",
            maxWidth: "none",
            marginLeft: "calc(-12.5% - 0.25rem)",
          }
        : isDesktopGallery
          ? {
              gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
              gridAutoFlow: "row dense",
              width: "calc(125% + 0.5rem)",
              maxWidth: "none",
              marginLeft: "calc(-12.5% - 0.25rem)",
            }
          : {
              gridAutoFlow: "row dense",
            }
      : undefined;

    return (
      <div
        ref={gridRef}
        className={`home-gallery-grid grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-8 items-start ${
          galleryHasExpandedImage ? "" : "group/gallery"
        }`}
        data-gallery-expanded={galleryHasExpandedImage ? "true" : "false"}
        style={expandedGalleryGridStyle}
      >
        {usePinnedDesktopLayout &&
          pinnedDesktopImage &&
          pinnedDesktopCardKey && (
            <div
              ref={expandedGalleryFixedCardRef}
              data-gallery-card-key={pinnedDesktopCardKey}
              data-gallery-featured="true"
              data-gallery-pinned="true"
              className="home-gallery-card relative z-30 block w-full rounded-[4px] md:rounded-[8px] border-0 bg-transparent p-0 text-left cursor-default"
              style={{
                ...pinnedDesktopReservedAreaStyle,
                position: "sticky",
                top: `${expandedGalleryStickyTop}px`,
                alignSelf: "start",
                scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
              }}
            >
              <div
                data-gallery-card-inner="true"
                className="relative w-full overflow-hidden rounded-[4px] md:rounded-[8px] bg-slate-200/20 aspect-[4/3] shadow-2xl shadow-slate-900/15"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeExpandedGalleryImage();
                  }}
                  className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all cursor-pointer"
                  aria-label={`Close ${pinnedDesktopAltLabel}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                  </svg>
                </button>
                <ExpandedGalleryHeroImage
                  imageKey={pinnedDesktopCardKey}
                  publicId={pinnedDesktopImage.publicId}
                  cldImg={pinnedDesktopImage.cldImg}
                  alt={pinnedDesktopAltText}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  imgClassName="object-cover"
                />
                <div
                  className={[
                    "absolute left-1/2 -translate-x-1/2 z-30 transition-[opacity,transform] duration-700 ease-out",
                    showLightboxBookingPrompt && !showQuoteModal
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-3 pointer-events-none",
                  ].join(" ")}
                  style={{ bottom: "20px" }}
                >
                  <Link
                    to="/booking"
                    className="group inline-flex items-center gap-3 pl-5 pr-4 py-2.5 bg-[#18181B]/90 hover:bg-black backdrop-blur-md text-white rounded-full text-[13px] font-light tracking-wide transition-colors duration-300"
                  >
                    <span>Ready to get started?</span>
                    <ArrowRight
                      size={16}
                      strokeWidth={1.5}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}
        {images.map((img, i) => {
          const imageGalleryKey = img.galleryKey ?? galleryKey;
          const imageAltLabel = img.altLabel ?? altLabel;
          const imageAltText = img.altText ?? `${imageAltLabel} photo ${i + 1}`;
          const imageCardKey = `${imageGalleryKey}:${img.id}`;
          const isExpanded =
            galleryHasExpandedImage &&
            expandedGalleryImage?.galleryKey === imageGalleryKey &&
            expandedGalleryImage.imageId === img.id;
          const disableExpandedCardToggle = isDesktopGallery && isExpanded;
          const isPinnedExpanded = isExpanded && usePinnedDesktopLayout;

          if (isPinnedExpanded) return null;

          const cardStyle = {
            scrollMarginTop: isDesktopGallery ? "112px" : "88px",
            ...(galleryHasExpandedImage
              ? usePinnedDesktopLayout
                ? {
                    gridColumn: `span ${EXPANDED_GALLERY_DESKTOP_CARD_SPAN} / span ${EXPANDED_GALLERY_DESKTOP_CARD_SPAN}`,
                  }
                : isExpanded
                  ? isDesktopGallery
                    ? {
                        gridColumn: "4 / span 9",
                        gridRow: "2 / span 3",
                        alignSelf: "start",
                      }
                    : {
                        gridColumn: "1 / -1",
                        gridRow: "auto",
                      }
                  : isDesktopGallery
                    ? {
                        gridColumn: "span 3 / span 3",
                      }
                    : {}
              : {}),
          };

          return (
            <div
              key={imageCardKey}
              data-gallery-card-key={
                suppressPerimeterSourceGallery ? undefined : imageCardKey
              }
              data-gallery-flow-card-key={imageCardKey}
              data-gallery-featured={isExpanded ? "true" : "false"}
              role={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? undefined
                  : "button"
              }
              tabIndex={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? -1
                  : 0
              }
              aria-hidden={suppressPerimeterSourceGallery ? true : undefined}
              aria-expanded={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? undefined
                  : isDesktopGallery
                    ? isExpanded
                    : undefined
              }
              aria-haspopup={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? undefined
                  : isDesktopGallery
                    ? undefined
                    : "dialog"
              }
              aria-label={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? undefined
                  : `${isDesktopGallery ? "Expand" : "Open"} ${imageAltLabel} photo ${i + 1}`
              }
              className={`home-gallery-card relative block w-full rounded-[4px] md:rounded-[8px] border-0 bg-transparent p-0 text-left transition-[filter,box-shadow] duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 ${
                galleryHasExpandedImage
                  ? ""
                  : "group-hover/gallery:brightness-[0.85] hover:!brightness-100"
              } ${isExpanded ? "z-20 cursor-default" : "cursor-pointer"} ${img.className}`}
              style={cardStyle}
              onClick={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? undefined
                  : (e) =>
                      handleGalleryCardActivate(
                        images,
                        imageGalleryKey,
                        img.id,
                        i,
                        e,
                      )
              }
              onKeyDown={
                suppressPerimeterSourceGallery || disableExpandedCardToggle
                  ? undefined
                  : (e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      handleGalleryCardActivate(
                        images,
                        imageGalleryKey,
                        img.id,
                        i,
                        e,
                      );
                    }
              }
              onMouseEnter={
                suppressPerimeterSourceGallery ? undefined : handleCardEnter
              }
              onMouseLeave={
                suppressPerimeterSourceGallery ? undefined : handleCardLeave
              }
            >
              <div
                data-gallery-card-inner="true"
                className={`relative w-full overflow-hidden rounded-[4px] md:rounded-[8px] bg-slate-200/20 ${img.aspectRatio} ${
                  isExpanded
                    ? "shadow-2xl shadow-slate-900/15"
                    : "shadow-xl shadow-slate-200/50"
                }`}
              >
                {isExpanded && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeExpandedGalleryImage();
                    }}
                    className="absolute top-4 right-4 z-30 flex p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all cursor-pointer"
                    aria-label={`Close ${imageAltLabel} photo ${i + 1}`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                    </svg>
                  </button>
                )}
                <ProgressiveCldImage
                  publicId={img.publicId}
                  cldImg={img.cldImg}
                  alt={imageAltText}
                  loading="lazy"
                  decoding="async"
                  imgClassName="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div id="home-page" ref={container} className="relative w-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 z-0 h-[220vh] max-h-[2400px] hidden md:block"
        style={{
          background:
            "radial-gradient(70% 65% at 65% 30%, #D0E8FF 0%, #EDF3FA 45%, #FFFFFF 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        ref={reviewsBackdropRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          opacity: 0,
          background:
            "radial-gradient(52.85% 52.85% at 49.04% 47.15%, #D0E8FF 0%, #F5F5F7 100%)",
        }}
      />
      <div
        className={[
          "md:hidden fixed inset-x-0 z-40 flex justify-center transition-[opacity,transform] duration-300 ease-out",
          showStickyReachOut && !showQuoteModal && !mobileLightbox
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none",
        ].join(" ")}
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <button
          type="button"
          onClick={() => setShowQuoteModal(true)}
          className="group inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] sm:w-[112px] sm:h-[24px] bg-[#242424] text-white rounded-[17px] text-[13px] sm:text-[12px] font-normal hover:bg-black transition-colors"
        >
          <span>Reach Out</span>
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>
      <div
        className={[
          "fixed inset-x-0 z-40 flex justify-center transition-[opacity,transform] duration-700 ease-out",
          showScrollHint &&
          !showQuoteModal &&
          !mobileLightbox &&
          !hasExpandedGalleryImage
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
      >
        <button
          type="button"
          onClick={handleScrollHintClick}
          aria-label="Scroll to view galleries"
          className="group inline-flex items-center gap-2.5 pl-4 pr-3 py-2 bg-white/80 backdrop-blur-md border border-slate-200/70 text-slate-600 rounded-full text-[11px] uppercase tracking-[0.25em] font-light hover:bg-white hover:text-slate-900 transition-all duration-300"
        >
          <span>View galleries</span>
          <svg
            className="w-3 h-3 animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div className="relative z-10">
        {/* Hero Section - Framed Premium Layout */}
        <section
          id="home-hero"
          className="relative w-full pt-5 md:pt-0 pb-8 max-w-[1440px] mx-auto min-h-[50vh] lg:min-h-[50vh] flex flex-col justify-center"
        >
          {/* Mobile-only: compact reviews eyebrow above image stack */}
          <div className="hero-mobile-eyebrow-row hero-intro-item md:hidden flex justify-center mb-11 -mt-2">
            <div className="hero-eyebrow max-w-full inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-1 rounded-full bg-white border border-slate-200/80 leading-none">
              <div className="flex items-center bg-[#F8F9FA] rounded-full px-2 py-1 border border-slate-100/50">
                <div className="flex items-center gap-1.5">
                  {/* Google */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {/* Yelp */}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 384 512"
                    fill="#FF1A1A"
                    className="flex-shrink-0"
                  >
                    <path d="M42.9 240.32l99.62 48.61c19.2 9.4 16.2 37.51-4.5 42.71L30.5 358.45a22.79 22.79 0 0 1-28.21-19.6 197.16 197.16 0 0 1 9-85.32 22.8 22.8 0 0 1 31.61-13.21zm44 239.25a199.45 199.45 0 0 0 79.42 32.11A22.78 22.78 0 0 0 192.94 490l3.9-110.82c.7-21.3-25.5-31.91-39.81-16.1l-74.21 82.4a22.82 22.82 0 0 0 4.09 34.09zm145.34-109.92l58.81 94a22.93 22.93 0 0 0 34 5.5 198.36 198.36 0 0 0 52.71-67.61A23 23 0 0 0 364.17 370l-105.42-34.26c-20.31-6.5-37.81 15.8-26.51 33.91zm148.33-132.23a197.44 197.44 0 0 0-50.41-69.31 22.85 22.85 0 0 0-34 4.4l-62 91.92c-11.9 17.7 4.7 40.61 25.2 34.71L366 268.63a23 23 0 0 0 14.61-31.21zM62.11 30.18a22.86 22.86 0 0 0-9.9 32l104.12 180.44c11.7 20.2 42.61 11.9 42.61-11.4V22.88a22.67 22.67 0 0 0-24.5-22.8 320.37 320.37 0 0 0-112.33 30.1z" />
                  </svg>
                  {/* WeddingWire */}
                  <img
                    src="https://www.google.com/s2/favicons?domain=weddingwire.com&sz=128"
                    alt="WeddingWire"
                    className="w-[12px] h-[12px] object-contain flex-shrink-0 rounded-[3px] opacity-90 max-[360px]:hidden"
                  />
                  {/* Thumbtack */}
                  <img
                    src="https://www.google.com/s2/favicons?domain=thumbtack.com&sz=128"
                    alt="Thumbtack"
                    className="w-[12px] h-[12px] object-contain flex-shrink-0 rounded-[3px] opacity-90 max-[360px]:hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] max-[360px]:text-[10px] font-medium text-slate-700 whitespace-nowrap">
                  1.2K+ Reviews
                </span>
                <div className="w-[1px] h-3 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] max-[360px]:text-[10px] font-semibold text-slate-800 whitespace-nowrap">
                    4.8/5
                  </span>
                  <div className="flex items-center gap-0.5 flex-nowrap">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-[11px] h-[11px] text-[#FBBC05] flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={
              !isMobileStack && heroScale < 1 && heroNaturalHeight > 0
                ? {
                    height: heroNaturalHeight * heroScale,
                    position: "relative",
                  }
                : undefined
            }
          >
            <div
              ref={heroLayoutRef}
              className="hero-primary-layout relative flex flex-col md:block md:px-12 w-full"
              style={heroLayoutStyle}
            >
              {/* Text Content Box */}
              <div className="hero-text-col contents md:z-20 md:block md:absolute md:-left-[130px] md:top-1/2 md:-translate-y-1/2 md:w-[604px] md:h-[318px]">
                <div className="hero-intro-panel contents md:flex md:flex-col md:justify-start md:items-center md:w-full md:h-full md:bg-white/[0.97] md:rounded-[22px] md:px-[42px] md:pt-[17px] md:pb-[47px]">
                  <div className="hero-eyebrow hero-intro-item hidden md:flex w-fit items-center justify-center md:gap-2 xl:gap-3 pl-1.5 md:pr-3 xl:pr-4 md:py-1 xl:py-1.5 rounded-full bg-white border border-slate-200/80 mb-4">
                    <div className="flex items-center bg-[#F8F9FA] rounded-full md:px-2 xl:px-2 md:py-1 xl:py-1 border border-slate-100/50">
                      <div className="flex items-center md:gap-1.5 xl:gap-2">
                        {/* Google */}
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] flex-shrink-0"
                        >
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        {/* Yelp */}
                        <svg
                          viewBox="0 0 384 512"
                          fill="#FF1A1A"
                          className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] flex-shrink-0"
                        >
                          <path d="M42.9 240.32l99.62 48.61c19.2 9.4 16.2 37.51-4.5 42.71L30.5 358.45a22.79 22.79 0 0 1-28.21-19.6 197.16 197.16 0 0 1 9-85.32 22.8 22.8 0 0 1 31.61-13.21zm44 239.25a199.45 199.45 0 0 0 79.42 32.11A22.78 22.78 0 0 0 192.94 490l3.9-110.82c.7-21.3-25.5-31.91-39.81-16.1l-74.21 82.4a22.82 22.82 0 0 0 4.09 34.09zm145.34-109.92l58.81 94a22.93 22.93 0 0 0 34 5.5 198.36 198.36 0 0 0 52.71-67.61A23 23 0 0 0 364.17 370l-105.42-34.26c-20.31-6.5-37.81 15.8-26.51 33.91zm148.33-132.23a197.44 197.44 0 0 0-50.41-69.31 22.85 22.85 0 0 0-34 4.4l-62 91.92c-11.9 17.7 4.7 40.61 25.2 34.71L366 268.63a23 23 0 0 0 14.61-31.21zM62.11 30.18a22.86 22.86 0 0 0-9.9 32l104.12 180.44c11.7 20.2 42.61 11.9 42.61-11.4V22.88a22.67 22.67 0 0 0-24.5-22.8 320.37 320.37 0 0 0-112.33 30.1z" />
                        </svg>
                        {/* WeddingWire */}
                        <img
                          src="https://www.google.com/s2/favicons?domain=weddingwire.com&sz=128"
                          alt="WeddingWire"
                          className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] object-contain flex-shrink-0 rounded-[3px] opacity-90"
                        />
                        {/* Thumbtack */}
                        <img
                          src="https://www.google.com/s2/favicons?domain=thumbtack.com&sz=128"
                          alt="Thumbtack"
                          className="md:w-[12px] md:h-[12px] xl:w-[14px] xl:h-[14px] object-contain flex-shrink-0 rounded-[3px] opacity-90"
                        />
                      </div>
                    </div>

                    <div className="flex items-center md:gap-2 xl:gap-2.5">
                      <span className="md:text-[11px] xl:text-[12px] font-semibold text-[#18181B] tracking-wide whitespace-nowrap">
                        1.2K+ Reviews
                      </span>
                      <div className="w-[1px] md:h-3 xl:h-3 bg-slate-300"></div>
                      <div className="flex items-center md:gap-1.5 xl:gap-1.5">
                        <span className="md:text-[11px] xl:text-[12px] font-semibold text-[#18181B] whitespace-nowrap">
                          4.8/5
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="md:w-[11px] md:h-[11px] xl:w-[12px] xl:h-[12px] text-[#FBBC05] flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="contents md:flex md:flex-col md:flex-1 md:w-full text-left">
                    <h1 className="sr-only">
                      Washington, D.C. Photographer | Wedding, Editorial,
                      Conference
                    </h1>
                    <div
                      aria-hidden="true"
                      className="hero-headline hero-intro-item order-1 md:order-none font-serif font-light uppercase md:normal-case text-[32px] md:text-[42px] lg:text-[50px] text-[#18181B] leading-[1.15] md:leading-[1.02] tracking-normal mb-6 md:mb-5 md:pl-4"
                    >
                      <div className="hero-text-line whitespace-nowrap">
                        Your story is <em>timeless</em>,
                      </div>
                      <div className="hero-text-line whitespace-nowrap">
                        Your photos should be <em>too</em>.
                      </div>
                    </div>
                    <div className="order-3 md:order-none w-full max-w-[386px] mx-auto md:flex md:flex-col md:flex-1">
                      <p className="hero-intro-item hero-desc text-[#6B6B76] font-light text-[13px] leading-[1.5] md:leading-[1.5] mb-8 md:mb-5">
                        Premium photography for{" "}
                        <Link
                          to="/booking"
                          className="text-current transition-colors duration-300 hover:text-[#18181B]"
                        >
                          weddings, editorials, and lifestyle
                        </Link>
                        . Based in{" "}
                        <Link
                          to="/about"
                          className="text-current transition-colors duration-300 hover:text-[#18181B]"
                        >
                          Washington, D.C. and Philadelphia
                        </Link>
                        , traveling worldwide.
                      </p>
                      <button
                        ref={heroReachOutButtonRef}
                        data-hero-reach-out
                        onClick={() => setShowQuoteModal(true)}
                        className="hero-intro-item hero-link group flex md:inline-flex items-center justify-center gap-1.5 w-[130px] h-[30px] sm:w-[112px] sm:h-[24px] bg-[#18181B] text-white rounded-full text-[13px] font-normal hover:bg-black transition-colors md:mt-auto mx-auto md:mx-0"
                      >
                        <span>Reach Out</span>
                        <ArrowRight
                          size={13}
                          strokeWidth={1.5}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staggered Image Stack */}
              <div className="hero-stack-col hero-intro-item w-full order-2 mb-2 md:mb-0 md:ml-auto md:mr-[-72px] md:w-[900px] flex items-center justify-end relative group md:py-16">
                <div
                  className="hero-stack-wrapper relative w-full md:w-[900px]"
                  ref={stackRef}
                  data-hero-stack-wrapper="true"
                  style={{
                    aspectRatio: "637 / 426",
                    transform: isMobileStack
                      ? undefined
                      : `translateX(${stackWrapperTranslateX}px)`,
                  }}
                >
                  {!isMobileStack &&
                    (() => {
                      const backIdx = visibleSet[0];
                      const bgCards = [
                        {
                          idx:
                            (backIdx - 2 + heroImages.length) %
                            heroImages.length,
                          opacity: 0.05,
                          offset: 2,
                        },
                        {
                          idx:
                            (backIdx - 1 + heroImages.length) %
                            heroImages.length,
                          opacity: 0.2,
                          offset: 1,
                        },
                      ];
                      return bgCards.map((card, i) => (
                        <div
                          key={`bg-${i}`}
                          className="absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                          data-hero-stack-bg-card="true"
                          data-hero-stack-base-opacity={card.opacity}
                          style={{
                            width: `calc(100% - ${(STACK_COUNT - 1) * stackOffsetX}px)`,
                            aspectRatio: "3 / 2",
                            zIndex: 0,
                            transform: `translate(${-card.offset * stackOffsetX}px, ${card.offset * stackOffsetY}px)`,
                            opacity: card.opacity,
                            border: "0.5px solid rgba(0,0,0,0.06)",
                          }}
                        >
                          <AdvancedImage
                            cldImg={heroImages[card.idx]}
                            className="w-full h-full object-cover"
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ));
                    })()}
                  {departingIdx !== null && (
                    <div
                      key={`dep-${departingIdx}`}
                      className="absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                      data-hero-stack-departing="true"
                      data-hero-stack-base-opacity="1"
                      style={{
                        width: `calc(100% - ${(STACK_COUNT - 1) * stackOffsetX}px)`,
                        aspectRatio: "3 / 2",
                        zIndex: 0,
                        boxShadow: CARD_SHADOWS[0],
                        animation:
                          "stackCardOut 2s cubic-bezier(0.65, 0, 0.35, 1) forwards",
                      }}
                    >
                      <AdvancedImage
                        cldImg={heroImages[departingIdx]}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                  )}
                  {visibleSet.map((imgIdx, pos) => {
                    const leftShift =
                      pos >= 1 ? Math.round(stackOffsetX * 0.4) : 0;
                    return (
                      <div
                        key={imgIdx}
                        className="hero-stack-card absolute left-0 bottom-0 overflow-hidden rounded-[8px]"
                        data-hero-stack-card="true"
                        data-hero-stack-card-position={pos}
                        style={{
                          width: `calc(100% - ${(STACK_COUNT - 1) * stackOffsetX}px)`,
                          aspectRatio: "3 / 2",
                          zIndex: pos + 1,
                          transform: `translate(${pos * stackOffsetX - leftShift}px, ${pos * -stackOffsetY}px)`,
                          transition: entranceDone
                            ? "transform 2.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 1.8s ease"
                            : "none",
                          boxShadow: CARD_SHADOWS[pos],
                          border: "0.5px solid rgba(0,0,0,0.06)",
                          willChange: "transform",
                        }}
                      >
                        <div
                          className="w-full h-full"
                          style={
                            pos === STACK_COUNT - 1 && hasInitialized
                              ? {
                                  animation:
                                    "stackCardIn 2.2s cubic-bezier(0.22, 1, 0.36, 1) both",
                                }
                              : undefined
                          }
                        >
                          <div
                            className="w-full h-full"
                            style={
                              pos === STACK_COUNT - 1
                                ? {
                                    animation:
                                      "heroKenBurns 18s ease-out forwards",
                                    willChange: "transform",
                                  }
                                : undefined
                            }
                          >
                            <AdvancedImage
                              cldImg={heroImages[imgIdx]}
                              className="w-full h-full object-cover"
                              alt={
                                HERO_IMAGE_ALTS[imgIdx] ??
                                `Starling Photography portfolio image ${imgIdx + 1}`
                              }
                              loading={
                                pos === STACK_COUNT - 1 ? "eager" : "lazy"
                              }
                              decoding="async"
                              fetchPriority={
                                pos === STACK_COUNT - 1 ? "high" : "auto"
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Assorted / Selected Work */}
        <section
          id="home-selected"
          ref={selectedRef}
          data-nav-dark
          className={`px-3 md:px-12 max-w-7xl mx-auto py-12 ${
            hasExpandedGalleryImage && isDesktopGallery
              ? ""
              : "border-t border-slate-100"
          }`}
          style={
            hasExpandedGalleryImage && isDesktopGallery
              ? {
                  scrollMarginTop: `${Math.max(112, expandedGalleryStickyTop)}px`,
                }
              : undefined
          }
          onClick={
            hasExpandedGalleryImage && isDesktopGallery
              ? handleExpandedGalleryBackdropClick
              : undefined
          }
        >
          {hasExpandedGalleryImage && isDesktopGallery ? (
            expandedGalleryCatalogImages.length ? (
              renderExpandedLandingPerimeter()
            ) : (
              <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />
            )
          ) : (
            <>
              <div
                ref={selectedDividerRef}
                className="flex items-center gap-6 mb-2"
              >
                <div className="flex-1 h-px bg-slate-200" />
                <h2 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">
                  Selected Work
                </h2>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {renderSelected ? (
                renderHomeGalleryGrid(
                  assortedImages,
                  "selected",
                  assortedGridRef,
                  "Selected Work",
                )
              ) : (
                <div className="h-[22vh] md:h-[28vh]" aria-hidden="true" />
              )}
            </>
          )}
        </section>

        {/* Featured Galleries / Recent Work */}
        <section
          id="home-featured"
          ref={featuredRef}
          data-nav-dark
          className="px-3 md:px-12 max-w-7xl mx-auto pt-4 pb-12 min-h-[50vh]"
          style={
            useExpandedLandingPerimeter
              ? {
                  visibility: "hidden",
                }
              : undefined
          }
        >
          {renderFeatured || hasExpandedGalleryImage ? (
            <div className="space-y-[72px]">
              {/* Opening statement */}
              <ScrollWordReveal className="font-serif font-light text-slate-700 text-2xl md:text-3xl leading-relaxed tracking-wide text-center max-w-3xl mx-auto px-6">
                We <em>love</em> the way life looks.
              </ScrollWordReveal>

              {/* Gallery 1 - Smith Wedding */}
              <div>
                <div
                  ref={wedding1HeaderRef}
                  className="flex items-center gap-6 mb-2"
                >
                  <div className="flex-1 h-px bg-slate-200" />
                  <h3 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">
                    Smith Wedding
                  </h3>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {renderHomeGalleryGrid(
                  wedding1Images,
                  "wedding-1",
                  wedding1GridRef,
                  "Smith Wedding",
                  false,
                )}
              </div>

              {/* Interlude */}
              <ScrollWordReveal className="font-serif font-light text-slate-700 text-2xl md:text-3xl leading-relaxed tracking-wide text-center max-w-3xl mx-auto px-6">
                Our approach is <em>true to color</em>, <em>editorial</em>, and{" "}
                <em>artistic</em>.
              </ScrollWordReveal>

              {/* Gallery 2 - Makayla and Hunter */}
              <div>
                <div
                  ref={wedding2HeaderRef}
                  className="flex items-center gap-6 mb-2"
                >
                  <div className="flex-1 h-px bg-slate-200" />
                  <h3 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">
                    Makayla and Hunter
                  </h3>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {renderHomeGalleryGrid(
                  wedding2Images,
                  "wedding-2",
                  wedding2GridRef,
                  "Makayla and Hunter",
                  false,
                )}
              </div>

              {/* Interlude */}
              <ScrollWordReveal className="font-serif font-light text-slate-700 text-2xl md:text-3xl leading-relaxed tracking-wide text-center max-w-3xl mx-auto px-6">
                Our goal is to capture your life in the{" "}
                <em>most beautiful light</em> possible.
              </ScrollWordReveal>

              {/* Gallery 3 - Thickstun Wedding */}
              <div>
                <div
                  ref={wedding3HeaderRef}
                  className="flex items-center gap-6 mb-2"
                >
                  <div className="flex-1 h-px bg-slate-200" />
                  <h3 className="text-[11px] uppercase tracking-[0.3em] text-slate-400 font-light whitespace-nowrap">
                    Thickstun Wedding
                  </h3>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {renderHomeGalleryGrid(
                  wedding3Images,
                  "wedding-3",
                  wedding3GridRef,
                  "Thickstun Wedding",
                  false,
                )}
              </div>
            </div>
          ) : (
            <div className="h-[40vh] md:h-[45vh]" aria-hidden="true" />
          )}

          {/* Scroll hint (desktop only — mobile shows form inline) */}
          <div className="hidden md:flex flex-col items-center gap-2 mt-16 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-light">
              Keep scrolling to inquire
            </span>
            <svg
              className="w-4 h-4 text-slate-300 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </section>

        {/* Scroll-driven booking reveal */}
        <ScrollBookingReveal sectionRef={bookingRevealRef} />

        {/* Full review grid */}
        <div
          ref={reviewsSectionRef}
          className="relative"
          style={{
            marginTop: isMobileStack ? 0 : "-100vh",
            pointerEvents: "none",
          }}
        >
          <div ref={reviewsContentRef} className="relative z-[25]">
            <h2 className="sr-only">Client reviews and testimonials</h2>
            <ReviewsGrid showHeading={false} animate={false} />
          </div>
        </div>

        {/* Quote Modal */}
        {showQuoteModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4"
            style={
              isMobileStack
                ? undefined
                : {
                    animation:
                      isClosingQuoteModal === "slow"
                        ? "lightboxOut 1.5s cubic-bezier(0.23,1,0.32,1) forwards"
                        : isClosingQuoteModal === "fast"
                          ? "lightboxOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                          : "lightboxIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                  }
            }
          >
            <div
              className={
                isMobileStack
                  ? "absolute inset-0 starling-quote-backdrop"
                  : "absolute inset-0 bg-black/40 backdrop-blur-sm md:bg-white/70 md:backdrop-blur-3xl"
              }
              onClick={() => closeQuoteModal(false)}
              style={
                isMobileStack
                  ? {
                      animation:
                        isClosingQuoteModal === "slow"
                          ? "starlingQuoteBackdropOut 1.5s cubic-bezier(0.23,1,0.32,1) both"
                          : isClosingQuoteModal === "fast"
                            ? "starlingQuoteBackdropOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) both"
                            : "starlingQuoteBackdropIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
                    }
                  : undefined
              }
            />

            <div
              className={
                isMobileStack
                  ? "relative z-10 w-full overflow-hidden starling-quote-card"
                  : "relative z-10 w-full overflow-hidden animate-fade-in"
              }
              style={{
                ...(isMobileStack
                  ? {
                      animation:
                        isClosingQuoteModal === "slow"
                          ? "starlingQuoteCardOut 1.5s cubic-bezier(0.23,1,0.32,1) both"
                          : isClosingQuoteModal === "fast"
                            ? "starlingQuoteCardOut 0.35s cubic-bezier(0.16, 1, 0.3, 1) both"
                            : "starlingQuoteCardIn 1s ease-out both",
                    }
                  : null),
                maxWidth: 608,
                borderRadius: 22,
                backgroundColor: "#242424",
                border: "1px solid #000000",
                padding: "36px 44px",
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
              >
                <div className="booking-form-glow-orb booking-form-glow-orb--1" />
                <div className="booking-form-glow-orb booking-form-glow-orb--2" />
                <div className="booking-form-glow-orb booking-form-glow-orb--3" />
              </div>

              <button
                type="button"
                onClick={() => closeQuoteModal(false)}
                className="absolute top-4 right-4 z-30 p-1.5 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-[8px] transition-all"
                aria-label="Close"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
              <form onSubmit={handleQuoteSubmit}>
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    quoteStatus === "success"
                      ? "opacity-100 translate-y-0 z-10 pointer-events-auto duration-1000 delay-500"
                      : "opacity-0 translate-y-8 -z-10 pointer-events-none duration-500 delay-0"
                  }`}
                  style={{ padding: "36px 44px" }}
                >
                  <p
                    className="text-white text-center font-light"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "18px",
                      lineHeight: "1.5",
                    }}
                  >
                    Thank you! We'll be in touch shortly.
                  </p>
                </div>

                <div
                  className={`relative z-[1] transition-all ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    quoteStatus === "success"
                      ? "pointer-events-none"
                      : "pointer-events-auto"
                  }`}
                >
                  <div
                    style={{
                      pointerEvents:
                        quoteStatus === "sending" || quoteStatus === "success"
                          ? "none"
                          : "auto",
                    }}
                  >
                    <div
                      className={`mb-8 text-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${quoteStatus === "sending" || quoteStatus === "success" ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
                      style={{
                        transitionDelay:
                          quoteStatus === "sending" || quoteStatus === "success"
                            ? "0ms"
                            : "150ms",
                      }}
                    >
                      <h3 className="text-white text-xl font-serif tracking-wide mb-2">
                        Request a Quote
                      </h3>
                      <p className="text-slate-400 text-sm font-light">
                        Enter your details and we'll reach out to you shortly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-y-7">
                      <div
                        className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${quoteStatus === "sending" || quoteStatus === "success" ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
                        style={{
                          transitionDelay:
                            quoteStatus === "sending" ||
                            quoteStatus === "success"
                              ? "50ms"
                              : "200ms",
                        }}
                      >
                        <label
                          htmlFor="quote-phone"
                          className="block text-xs uppercase tracking-widest mb-4"
                          style={{ color: "#FFFFFF" }}
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="quote-phone"
                          value={quoteForm.phone}
                          onChange={(e) =>
                            setQuoteForm({ phone: e.target.value })
                          }
                          required
                          className="w-full bg-transparent py-2 text-sm text-white font-light focus:outline-none"
                          style={{
                            border: "none",
                            borderBottom: "1px solid #B7B7B7",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex justify-center mt-9 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${quoteStatus === "sending" || quoteStatus === "success" ? "opacity-0 -translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`}
                    style={{
                      transitionDelay:
                        quoteStatus === "sending" || quoteStatus === "success"
                          ? "100ms"
                          : "250ms",
                    }}
                  >
                    <button
                      type="submit"
                      disabled={quoteStatus === "sending"}
                      className="flex items-center justify-center cursor-pointer transition-opacity duration-300"
                      style={{
                        width: 143,
                        height: 24,
                        backgroundColor: "#F7F7F7",
                        borderRadius: 6,
                        color: "#000000",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: 14,
                        border: "none",
                        opacity: quoteStatus === "sending" ? 0.8 : 1,
                      }}
                    >
                      Get a Quote
                    </button>
                  </div>

                  {quoteStatus === "error" && (
                    <p
                      className={`text-red-400 text-sm font-light mt-6 text-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${quoteStatus === "error" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                    >
                      Something went wrong. Please try again later.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {mobileLightbox && mobileLightboxImage && (
          <div
            className="fixed inset-0 z-50"
            data-starling-mobile-lightbox
            role="dialog"
            aria-modal="true"
            aria-label="Gallery lightbox"
          >
            <div
              className="absolute inset-0 overflow-hidden bg-black"
              style={
                isMobileLandscape
                  ? undefined
                  : { animation: "lightboxIn 380ms ease-out both" }
              }
              onClick={closeMobileLightbox}
            >
              {!isMobileLandscape && (
                <>
                  <AdvancedImage
                    key={`mlb-ambient-${mobileLightbox.index}`}
                    cldImg={mobileLightboxImage.cldImg}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: "blur(80px) brightness(0.58) saturate(1.4)",
                      transform: "scale(1.25)",
                      transformOrigin: "center",
                      animation: "lightboxIn 700ms ease-out both",
                    }}
                    alt=""
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.3) 100%)",
                    }}
                  />
                </>
              )}
            </div>

            <div className="pointer-events-none absolute inset-0 z-20">
              {isMobileLandscape ? (
                <button
                  type="button"
                  onClick={closeMobileLightbox}
                  className="pointer-events-auto absolute z-20 w-12 h-12 p-0 flex items-center justify-center bg-transparent text-white hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] cursor-pointer"
                  style={{
                    top: "calc(env(safe-area-inset-top) + 12px)",
                    right: "calc(env(safe-area-inset-right) + 12px)",
                  }}
                  aria-label="Close"
                >
                  <X size={28} strokeWidth={1.75} />
                </button>
              ) : (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMobileLightbox();
                  }}
                  className="pointer-events-auto absolute z-30 flex items-center justify-center w-9 h-9 text-white bg-black/35 hover:bg-black/55 backdrop-blur-md rounded-full transition-all cursor-pointer"
                  style={{
                    top: "calc(env(safe-area-inset-top) + 14px)",
                    right: "calc(env(safe-area-inset-right) + 14px)",
                  }}
                  aria-label={`Close ${(mobileLightboxImage.altLabel ?? "gallery image").toLowerCase()}`}
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              )}

              {mobileLightbox.images.length > 1 && isMobileLandscape && (
                <>
                  <button
                    type="button"
                    onClick={() => navigateMobileLightbox(-1)}
                    className="pointer-events-auto absolute left-3 top-1/2 z-20 -translate-y-1/2 p-3 text-white transition-colors duration-300 hover:text-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} strokeWidth={0.8} />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateMobileLightbox(1)}
                    className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 p-3 text-white transition-colors duration-300 hover:text-white"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} strokeWidth={0.8} />
                  </button>
                </>
              )}

              {isMobileLandscape ? (
                <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] tracking-[0.3em] font-light tabular-nums text-white/60">
                  {mobileLightbox.index + 1} - {mobileLightbox.images.length}
                </div>
              ) : (
                <>
                  <div
                    className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
                    style={{
                      bottom: "calc(env(safe-area-inset-bottom) + 60px)",
                      animation: "lightboxIn 600ms ease-out 200ms both",
                    }}
                  >
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowQuoteModal(true);
                      }}
                      className="pointer-events-auto group inline-flex items-center justify-center gap-2 px-5 h-9 bg-white text-[#18181B] rounded-full text-[13px] font-medium tracking-wide shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] hover:bg-slate-100 transition-colors duration-300"
                    >
                      <span>Reach Out</span>
                      <ArrowRight
                        size={14}
                        strokeWidth={1.75}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </button>
                  </div>
                  {mobileLightbox.images.length > 1 && (
                    <div
                      className="absolute left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5"
                      style={{
                        bottom: "calc(env(safe-area-inset-bottom) + 22px)",
                        animation: "lightboxIn 600ms ease-out 120ms both",
                      }}
                    >
                      {mobileLightbox.images.map((_, i) => (
                        <span
                          key={i}
                          className={`h-1 rounded-full transition-all duration-500 ease-out ${
                            i === mobileLightbox.index
                              ? "w-5 bg-white/95"
                              : "w-1 bg-white/35"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div
              ref={mobileLightboxTrackRef}
              className="absolute inset-0 z-10"
              style={{
                touchAction: "pan-y",
                willChange: "transform",
                animation:
                  mobileLightbox.index === 0 && !isMobileLandscape
                    ? "lightboxImage 520ms cubic-bezier(0.32, 0.72, 0, 1) both"
                    : undefined,
              }}
              onTouchStart={handleMobileLightboxTouchStart}
              onTouchMove={handleMobileLightboxTouchMove}
              onTouchEnd={handleMobileLightboxTouchEnd}
            >
              {mobileLightbox.images.map((img, i) => {
                const distance = i - mobileLightbox.index;
                if (Math.abs(distance) > 1) return null;
                const slideAlt =
                  img.altText ??
                  `${img.altLabel ?? "Gallery"} photo ${i + 1} of ${mobileLightbox.images.length}`;
                return (
                  <div
                    key={img.id ?? `slide-${i}`}
                    className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
                      isMobileLandscape ? "p-0" : "px-4"
                    }`}
                    style={{
                      transform: `translateX(${distance * 100}%)`,
                    }}
                    aria-hidden={distance !== 0}
                  >
                    <div
                      className={`pointer-events-auto relative ${
                        isMobileLandscape
                          ? "w-full h-full overflow-hidden shadow-none"
                          : "rounded-2xl overflow-hidden shadow-[0_28px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/5"
                      }`}
                    >
                      <div
                        className={isMobileLandscape ? "w-full h-full" : undefined}
                        style={{ transformOrigin: "center" }}
                      >
                        <AdvancedImage
                          cldImg={img.cldImg}
                          className={
                            isMobileLandscape
                              ? "block w-full h-full max-w-none max-h-none object-contain"
                              : "block max-w-[92vw] max-h-[80vh] object-contain"
                          }
                          alt={slideAlt}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
