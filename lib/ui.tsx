"use client";

import type {
  AnchorHTMLAttributes,
  AriaAttributes,
  ComponentProps,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import {
  type DesignTheme,
  GlobalErrorDocument as SharedGlobalErrorDocument,
  ThemeMenuButton,
  useDesignPortalTheme,
} from "@hraness/design-kit/react";
import Link from "next/link";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Label,
  Modal as AriaModal,
  ModalOverlay,
  Radio,
  RadioGroup,
  Slider,
  SliderFill,
  SliderThumb,
  SliderTrack,
  Text,
} from "react-aria-components";

function classNames(...values: readonly (string | undefined)[]): string {
  return values.filter((value): value is string => Boolean(value)).join(" ");
}

export type ButtonProps = Omit<AriaButtonProps, "className"> & Readonly<{
  "aria-busy"?: AriaAttributes["aria-busy"];
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
  controlClassName?: string;
  size?: "compact" | "default" | "large" | "transport";
  variant?: "danger" | "primary" | "quiet" | "secondary";
}>;

export function Button({
  "aria-busy": ariaBusy,
  buttonRef,
  className,
  controlClassName,
  isDisabled = false,
  size = "default",
  variant = "secondary",
  ...props
}: ButtonProps) {
  return (
    <span
      aria-busy={ariaBusy === true || ariaBusy === "true" ? "true" : undefined}
      className={classNames("sleepyland-button", className)}
      data-disabled={isDisabled || undefined}
      data-size={size}
      data-variant={variant}
    >
      <AriaButton
        {...props}
        aria-busy={ariaBusy === true || ariaBusy === "true" ? "true" : undefined}
        className={classNames("sleepyland-button__control", controlClassName)}
        isDisabled={isDisabled}
        ref={buttonRef}
      />
    </span>
  );
}

export type IconButtonProps = Omit<ButtonProps, "variant"> & Readonly<{
  tooltip?: ReactNode;
  variant?: "danger" | "primary" | "quiet" | "secondary";
}>;

export function IconButton({
  "aria-busy": ariaBusy,
  buttonRef,
  className,
  controlClassName,
  isDisabled = false,
  size = "default",
  tooltip: _tooltip,
  variant = "quiet",
  ...props
}: IconButtonProps) {
  void _tooltip;
  return (
    <span
      aria-busy={ariaBusy === true || ariaBusy === "true" ? "true" : undefined}
      className={classNames("sleepyland-icon-button", className)}
      data-disabled={isDisabled || undefined}
      data-size={size}
      data-variant={variant}
    >
      <AriaButton
        {...props}
        aria-busy={ariaBusy === true || ariaBusy === "true" ? "true" : undefined}
        className={classNames("sleepyland-icon-button__control", controlClassName)}
        isDisabled={isDisabled}
        ref={buttonRef}
      />
    </span>
  );
}

export type PressableProps = Omit<AriaButtonProps, "className"> & Readonly<{
  buttonRef?: Ref<HTMLButtonElement>;
  className?: string;
}>;

export function Pressable({ buttonRef, className, ...props }: PressableProps) {
  return (
    <AriaButton
      {...props}
      className={classNames("sleepyland-pressable", className)}
      ref={buttonRef}
    />
  );
}

export type SegmentedItem<Id extends string> = Readonly<{
  ariaLabel?: string;
  id: Id;
  label: ReactNode;
}>;

export function SegmentedControl<Id extends string>({
  "aria-label": ariaLabel,
  className,
  isDisabled = false,
  items,
  onChange,
  size = "default",
  surfaceClassName,
  value,
}: Readonly<{
  "aria-label": string;
  className?: string;
  isDisabled?: boolean;
  items: readonly SegmentedItem<Id>[];
  onChange: (id: Id) => void;
  size?: "compact" | "default";
  surfaceClassName?: string;
  value: Id;
}>) {
  return (
    <div
      className={classNames("sleepyland-segmented-control__surface", surfaceClassName)}
      data-size={size}
    >
      <RadioGroup
        aria-label={ariaLabel}
        className={classNames("sleepyland-segmented-control", className)}
        isDisabled={isDisabled}
        onChange={(id) => {
          const item = items.find((candidate) => candidate.id === id);
          if (item !== undefined) onChange(item.id);
        }}
        value={value}
      >
        {items.map((item) => (
          <Radio
            aria-label={item.ariaLabel}
            className="sleepyland-segmented-control__item"
            key={item.id}
            value={item.id}
          >
            <span className="sleepyland-segmented-control__item-content">
              <span className="sleepyland-segmented-control__item-label">{item.label}</span>
            </span>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

export function Fader({
  className,
  label,
  orientation = "vertical",
  ...props
}: Omit<ComponentProps<typeof Slider<number>>, "children" | "className"> & Readonly<{
  className?: string;
  label: ReactNode;
}>) {
  return (
    <Slider
      {...props}
      className={classNames("sleepyland-fader", className)}
      orientation={orientation}
    >
      <Label className="sleepyland-visually-hidden">{label}</Label>
      <SliderTrack className="sleepyland-fader__track">
        <SliderFill className="sleepyland-fader__fill" />
        <SliderThumb className="sleepyland-fader__thumb" />
      </SliderTrack>
    </Slider>
  );
}

export { DialogTrigger };

export function Modal({
  children,
  className,
  closeLabel = "Close dialog",
  description,
  size = "medium",
  surfaceClassName,
  title,
}: Readonly<{
  children: ReactNode | ((options: Readonly<{ close: () => void }>) => ReactNode);
  className?: string;
  closeLabel?: string;
  description?: ReactNode;
  size?: "large" | "medium" | "small";
  surfaceClassName?: string;
  title: ReactNode;
}>) {
  const theme = useDesignPortalTheme() ?? "dark";
  return (
    <ModalOverlay className="sleepyland-modal-overlay" data-theme={theme} isDismissable>
      <AriaModal
        className={classNames("sleepyland-modal__surface", surfaceClassName, "sleepyland-modal", className)}
        data-size={size}
      >
        <AriaDialog className="sleepyland-modal__dialog">
          {({ close }) => (
            <>
              <header className="sleepyland-modal__header">
                <div className="sleepyland-modal__heading">
                  <Heading className="sleepyland-modal__title" slot="title">{title}</Heading>
                  {description === undefined ? null : (
                    <Text className="sleepyland-modal__description" slot="description">
                      {description}
                    </Text>
                  )}
                </div>
                <button
                  aria-label={closeLabel}
                  className="sleepyland-modal__close"
                  onClick={close}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </header>
              <div className="sleepyland-modal__body">
                {typeof children === "function" ? children({ close }) : children}
              </div>
            </>
          )}
        </AriaDialog>
      </AriaModal>
    </ModalOverlay>
  );
}

export function ViewportFrame({
  as = "div",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & Readonly<{ as?: "div" | "main" | "section" }>) {
  const Element = as;
  return <Element {...props} className={classNames("sleepyland-viewport-frame", className)} />;
}

export function WrappingRow({
  as = "div",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & Readonly<{
  as?: "div" | "footer" | "header" | "nav" | "section" | "span";
}>) {
  const Element = as;
  return <Element {...props} className={classNames("sleepyland-wrapping-row", className)} />;
}

export interface BreadcrumbItem {
  readonly href?: string;
  readonly id: string;
  readonly label: ReactNode;
}

export function Breadcrumbs({
  "aria-label": ariaLabel = "Breadcrumbs",
  className,
  items,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & Readonly<{
  items: readonly [BreadcrumbItem, ...BreadcrumbItem[]];
}>) {
  return (
    <nav {...props} aria-label={ariaLabel} className={classNames("sleepyland-breadcrumbs", className)}>
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.id}>
              {item.href === undefined || current
                ? <span aria-current={current ? "page" : undefined}>{item.label}</span>
                : <a href={item.href}>{item.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SkipLink({
  children = "Skip to main content",
  className,
  href = "#main-content",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} className={classNames("sleepyland-skip-link", className)} href={href}>
      {children}
    </a>
  );
}

export interface RouteErrorPageProps {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
  readonly showThemeToggle?: boolean;
}

export function RouteNotFoundPage(props: Readonly<{ showThemeToggle?: boolean }>) {
  void props.showThemeToggle;
  return (
    <main className="sleepyland-route-state" id="main-content" tabIndex={-1}>
      <p aria-hidden="true">404</p>
      <h1>Page not found</h1>
      <p>The address may be out of date, or this page may have moved.</p>
      <nav aria-label="Where to look next" className="sleepyland-route-state__actions">
        <Link href="/">Research</Link>
        <Link href="/noise">Sound machine</Link>
        <Link href="/llms.txt">llms.txt</Link>
        <Link href="/sitemap.md">Sitemap</Link>
      </nav>
    </main>
  );
}

export function RouteLoadingPage() {
  return (
    <main aria-busy="true" className="sleepyland-route-state" id="main-content">
      <p role="status">Loading page</p>
    </main>
  );
}

export function RouteErrorPage({ reset }: RouteErrorPageProps) {
  return (
    <main
      aria-label="This view could not load"
      aria-live="assertive"
      className="sleepyland-route-state"
      id="main-content"
      tabIndex={-1}
    >
      <p aria-hidden="true">!</p>
      <h1>This view could not load</h1>
      <p>Retry this view, or return home and continue from there.</p>
      <div className="sleepyland-route-state__actions">
        <button onClick={reset} type="button">Try again</button>
        <Link href="/">Return home</Link>
      </div>
    </main>
  );
}

export function GlobalErrorDocument({
  darkColor = "#151515",
  diagnostics,
  lightColor = "#ffffff",
  theme,
  ...props
}: RouteErrorPageProps & Readonly<{
  darkColor?: string;
  diagnostics?: ReactNode;
  lightColor?: string;
  theme?: DesignTheme;
}>) {
  return (
    <SharedGlobalErrorDocument
      {...props}
      {...(diagnostics === undefined ? {} : { diagnostics })}
      {...(theme === undefined ? {} : { theme })}
      darkColor={darkColor}
      lightColor={lightColor}
    />
  );
}

export function DesignSystemGallery() {
  return (
    <main className="sleepyland-design" id="main-content">
      <header className="sleepyland-design__header">
        <div>
          <p>Product-owned interface specification</p>
          <h1>Sleepyland design</h1>
        </div>
        <ThemeMenuButton
          aria-label="Appearance"
          className="sleepyland-design__appearance"
        />
      </header>
      <section>
        <h2>Night palette</h2>
        <p>Black, warm amber, compact controls, and one bright transport action.</p>
      </section>
      <section>
        <h2>Sound controls</h2>
        <p>Three clear sound states with detailed tuning available only on demand.</p>
      </section>
    </main>
  );
}
