import { routes } from "./routes";

export const imageSources = {
  classifiedPlaceholder:
    "https://magic-motors.s3.eu-north-1.amazonaws.com/uploads/classified-placeholder.jpg",
  carLinup:
    "https://magic-motors.s3.eu-north-1.amazonaws.com/uploads/peter-broomfield-m3m-lnR90uM-unsplash.jpg",
  featureSection:
    "https://magic-motors.s3.eu-north-1.amazonaws.com/uploads/roberto-nickson-zu95jkyrGtw-unsplash.jpg",
};

export const CLASSIFIED_PER_PAGE = 3;

export const navLinks = [
  { id: 1, href: routes.home, label: "Home" },
  { id: 2, href: routes.inventory, label: "Inventory" },
];

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
