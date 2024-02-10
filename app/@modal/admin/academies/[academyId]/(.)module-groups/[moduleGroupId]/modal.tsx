"use client";

import { type ElementRef, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function Modal() {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const [domReady, setDomReady] = useState(false);

  useEffect(() => {
    setDomReady(true);
  }, []);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
    console.log(document.getElementById("modal-root"));
  }, []);

  function onDismiss() {
    router.back();
  }
  console.log("helpp me test");

  return domReady
    ? createPortal(
        <div className="modal-backdrop">
          <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
            modal intercept root
            <button onClick={onDismiss} className="close-button" />
          </dialog>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )
    : null;
}
