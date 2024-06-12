"use client";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import styles from "./SettingsModal.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { MutableRefObject, useRef } from "react";

export default function SettingsModal() {
    const router = useRouter();
    const enabled = useSearchParams().get("settings");

    let overlayRef = useRef() as MutableRefObject<HTMLDivElement | null>;
    const onClose = () => router.push("/");

    return (
        <>
            {enabled && (
            <div className={styles["modal-container"]}>
                <Dialog static open={true} onClose={onClose} initialFocus={overlayRef} className={styles["settings-modal"]}>
                    <h2>Settings</h2>
                    <button onClick={onClose}>Close</button>
                </Dialog>
            </div>
            )}
        </>
    )
}
