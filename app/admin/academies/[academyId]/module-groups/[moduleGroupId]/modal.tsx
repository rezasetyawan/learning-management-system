// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// export function Modal() {
//   return (
//       <Dialog defaultOpen={true}>
//         <DialogTrigger>Edit Profile</DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]" asChild>
//           <DialogHeader>
//             <DialogTitle>Edit profile</DialogTitle>
//             <DialogDescription>
//               Make changes to your profile here. Click save when
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter></DialogFooter>
//         </DialogContent>
//       </Dialog>
//   );
// }

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
  console.log("helpp me");

  return domReady
    ? createPortal(
        <div className="modal-backdrop">
          <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
            modal
            <button onClick={onDismiss} className="close-button" />
          </dialog>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )
    : null;
}
