import * as React from "react";
import { Toaster, toast } from "sonner";
// icons
import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
// spinner
import { CircularBarSpinner } from "./circularspinner";
// helper
import { cn } from "@/lib/utils";

export enum TOAST_TYPE {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  LOADING = "loading",
}

type SetToastProps =
  | {
      type: TOAST_TYPE.LOADING;
      title?: string;
    }
  | {
      id?: string | number;
      type: Exclude<TOAST_TYPE, TOAST_TYPE.LOADING>;
      title: string;
      message?: string;
      actionItems?: React.ReactNode;
    };

type PromiseToastCallback<ToastData> = (data: ToastData) => string;
type ActionItemsPromiseToastCallback<ToastData> = (
  data: ToastData
) => React.JSX.Element;

type PromiseToastData<ToastData> = {
  title: string;
  message?: PromiseToastCallback<ToastData>;
  actionItems?: ActionItemsPromiseToastCallback<ToastData>;
};

type PromiseToastOptions<ToastData> = {
  loading?: string;
  success: PromiseToastData<ToastData>;
  error: PromiseToastData<ToastData>;
};

type ToastContentProps = {
  toastId: string | number;
  icon?: React.ReactNode;
  textColorClassName: string;
  backgroundColorClassName: string;
  borderColorClassName: string;
};

export const Toast = () => {
  return <Toaster visibleToasts={5} gap={16} />;
};

export const setToast = (props: SetToastProps) => {
  const renderToastContent = ({
    toastId,
    icon,
    textColorClassName,
    backgroundColorClassName,
    borderColorClassName,
  }: ToastContentProps) =>
    props.type === TOAST_TYPE.LOADING ? (
      <div
        className="flex items-center h-24.5 w-87.5"
        data-prevent-outside-click
      >
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className={cn(
            "w-full rounded-lg border shadow-sm p-2",
            backgroundColorClassName,
            borderColorClassName
          )}
        >
          <div className="w-full h-full flex items-center justify-center px-4 py-2">
            {icon && (
              <div className="flex items-center justify-center">{icon}</div>
            )}
            <div
              className={cn(
                "w-full flex items-center gap-0.5 pr-1",
                icon ? "pl-4" : "pl-1"
              )}
            >
              <div
                className={cn("grow text-sm font-semibold", textColorClassName)}
              >
                {props.title ?? "Caricamento..."}
              </div>
              <div className="shrink-0">
                <X
                  className="hover:opacity-75 cursor-pointer"
                  style={{ color: "rgb(128 131 141)" }}
                  strokeWidth={1.5}
                  width={14}
                  height={14}
                  onClick={() => toast.dismiss(toastId)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div
        data-prevent-outside-click
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className={cn(
          "relative group flex flex-col w-87.5 rounded-lg border shadow-sm p-2",
          backgroundColorClassName,
          borderColorClassName
        )}
      >
        <X
          className="fixed top-2 right-2.5 hover:opacity-75 cursor-pointer"
          style={{ color: "rgb(128 131 141)" }}
          strokeWidth={1.5}
          width={14}
          height={14}
          onClick={() => toast.dismiss(toastId)}
        />
        <div className="w-full flex flex-col gap-2 p-2">
          <div className="flex items-center w-full">
            {icon && (
              <div className="flex items-center justify-center">{icon}</div>
            )}
            <div
              className={cn(
                "flex flex-col gap-0.5 pr-1",
                icon ? "pl-4" : "pl-1"
              )}
            >
              <div className={cn("text-sm font-semibold", textColorClassName)}>
                {props.title}
              </div>
              {props.message && (
                <div
                  className="text-xs font-medium"
                  style={{ color: "rgb(128 131 141)" }}
                >
                  {props.message}
                </div>
              )}
            </div>
          </div>
          {props.actionItems && (
            <div className="flex items-center pl-8">
              {props.actionItems}
            </div>
          )}
        </div>
      </div>
    );

  switch (props.type) {
    case TOAST_TYPE.SUCCESS:
      return toast.custom(
        (toastId) =>
          renderToastContent({
            toastId,
            icon: (
              <CheckCircle2
                width={24}
                height={24}
                strokeWidth={1.5}
                style={{ color: "rgb(62 155 79)" }}
              />
            ),
            textColorClassName: "",
            backgroundColorClassName: "",
            borderColorClassName: "",
          }),
        {
          ...(props.id ? { id: props.id } : {}),
          style: {
            color: "rgb(62 155 79)",
            backgroundColor: "rgb(253 253 254)",
            borderColor: "rgb(218 241 219)",
          },
        }
      );
    case TOAST_TYPE.ERROR:
      return toast.custom(
        (toastId) =>
          renderToastContent({
            toastId,
            icon: (
              <XCircle
                width={24}
                height={24}
                strokeWidth={1.5}
                style={{ color: "rgb(220 62 66)" }}
              />
            ),
            textColorClassName: "",
            backgroundColorClassName: "",
            borderColorClassName: "",
          }),
        {
          ...(props.id ? { id: props.id } : {}),
          style: {
            color: "rgb(220 62 66)",
            backgroundColor: "rgb(255 252 252)",
            borderColor: "rgb(255 219 220)",
          },
        }
      );
    case TOAST_TYPE.WARNING:
      return toast.custom(
        (toastId) =>
          renderToastContent({
            toastId,
            icon: (
              <AlertTriangle
                width={24}
                height={24}
                strokeWidth={1.5}
                style={{ color: "rgb(255 186 24)" }}
              />
            ),
            textColorClassName: "",
            backgroundColorClassName: "",
            borderColorClassName: "",
          }),
        {
          ...(props.id ? { id: props.id } : {}),
          style: {
            color: "rgb(255 186 24)",
            backgroundColor: "rgb(254 253 251)",
            borderColor: "rgb(255 247 194)",
          },
        }
      );
    case TOAST_TYPE.INFO:
      return toast.custom(
        (toastId) =>
          renderToastContent({
            toastId,
            textColorClassName: "",
            backgroundColorClassName: "",
            borderColorClassName: "",
          }),
        {
          ...(props.id ? { id: props.id } : {}),
          style: {
            color: "rgb(51 88 212)",
            backgroundColor: "rgb(253 253 254)",
            borderColor: "rgb(210 222 255)",
          },
        }
      );

    case TOAST_TYPE.LOADING:
      return toast.custom(
        (toastId) =>
          renderToastContent({
            toastId,
            icon: <CircularBarSpinner style={{ color: "rgb(96 100 108)" }} />,
            textColorClassName: "",
            backgroundColorClassName: "",
            borderColorClassName: "",
          }),
        {
          style: {
            color: "rgb(28 32 36)",
            backgroundColor: "rgb(253 253 254)",
            borderColor: "rgb(224 225 230)",
          },
        }
      );
  }
};

export const setPromiseToast = <ToastData,>(
  promise: Promise<ToastData>,
  options: PromiseToastOptions<ToastData>
): void => {
  const tId = setToast({ type: TOAST_TYPE.LOADING, title: options.loading });

  promise
    .then((data: ToastData) => {
      setToast({
        type: TOAST_TYPE.SUCCESS,
        id: tId,
        title: options.success.title,
        message: options.success.message?.(data),
        actionItems: options.success.actionItems?.(data),
      });
    })
    .catch((data: ToastData) => {
      setToast({
        type: TOAST_TYPE.ERROR,
        id: tId,
        title: options.error.title,
        message: options.error.message?.(data),
        actionItems: options.error.actionItems?.(data),
      });
    });
};
